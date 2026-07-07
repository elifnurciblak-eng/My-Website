import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createTranscription,
  getTranscriptionById,
  getUserTranscriptions,
  createTranslation,
  getTranscriptionTranslations,
  createMergedDocument,
  getUserMergedDocuments,
} from "./db";
import { invokeLLM, type InvokeResult } from "./_core/llm";
import { transcribeAudio } from "./_core/voiceTranscription";

export const appRouter = router({
    system: systemRouter,
    auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  translator: router({
    // Step 1: Upload JSON transcription or audio file
    uploadTranscription: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          jsonData: z.string(), // JSON string from file
          sourceLanguage: z.string().default("Persian"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const jsonObj = JSON.parse(input.jsonData);
          
          // Extract text from segments (Whisper API format)
          const segments = jsonObj.segments || [];
          const extractedText = segments
            .map((s: any) => (s.text || "").trim())
            .filter((t: string) => t.length > 0)
            .join(" ");

          const result = await createTranscription({
            userId: ctx.user.id,
            originalFileName: input.fileName,
            sourceLanguage: input.sourceLanguage,
            rawJsonData: input.jsonData,
            extractedText: extractedText,
          });

          return {
            success: true,
            transcriptionId: (result as any).insertId || 0,
            extractedText: extractedText,
          };
        } catch (error) {
          throw new Error(`Failed to process transcription: ${error}`);
        }
      }),

    // Step 2: Get transcription details
    // Transcribe audio/video using Whisper API
    transcribeAudioFile: protectedProcedure
      .input(
        z.object({
          audioUrl: z.string().url(),
          language: z.string().optional(),
          sourceLanguage: z.string().default("Persian"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const result = await transcribeAudio({
            audioUrl: input.audioUrl,
            language: input.language,
            prompt: "Transcribe academic lecture or discussion",
          });

          // Check if result is an error
          if ("error" in result) {
            throw new Error(result.error);
          }

          // Convert Whisper result to our JSON format
          const jsonData = JSON.stringify(result);
          const extractedText = result.text || "";

          const dbResult = await createTranscription({
            userId: ctx.user.id,
            originalFileName: `audio_${Date.now()}.mp3`,
            sourceLanguage: input.sourceLanguage,
            rawJsonData: jsonData,
            extractedText: extractedText,
          });

          return {
            success: true,
            transcriptionId: (dbResult as any).insertId || 0,
            extractedText: extractedText,
            language: result.language,
          };
        } catch (error) {
          throw new Error(`Transcription failed: ${error}`);
        }
      }),

    // Step 2: Get transcription details
    getTranscription: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const transcription = await getTranscriptionById(input.id);
        if (!transcription || transcription.userId !== ctx.user.id) {
          throw new Error("Transcription not found");
        }
        return transcription;
      }),

    // Step 3: Translate academic text using LLM
    translateText: protectedProcedure
      .input(
        z.object({
          transcriptionId: z.number(),
          sourceLanguage: z.string(),
          targetLanguage: z.string(),
          context: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const transcription = await getTranscriptionById(input.transcriptionId);
          if (!transcription || transcription.userId !== ctx.user.id) {
            throw new Error("Transcription not found");
          }

          const systemPrompt = `You are an expert academic translator specializing in ${input.sourceLanguage} to ${input.targetLanguage} translation.
The text is an academic lecture/discussion. Context: ${input.context || "Academic content"}

Guidelines:
- Translate philosophical/technical terms with their standard academic equivalents.
- Maintain a natural flow while preserving the speaker's original intent.
- Keep proper names in their original spelling.
- Translate titles and provide the original in parentheses.
- Organize the output into clear paragraphs.
- Mark ambiguous parts as [ambiguous].`;

          const userPrompt = `Translate the following ${input.sourceLanguage} text into ${input.targetLanguage}:\n\n${transcription.extractedText}`;

          const response = await invokeLLM({
            model: "claude-sonnet-4-6",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            max_tokens: 4000,
          });

          const messageContent = response.choices[0]?.message?.content;
          const translatedText = typeof messageContent === "string" ? messageContent : "";

          const result = await createTranslation({
            userId: ctx.user.id,
            transcriptionId: input.transcriptionId,
            sourceLanguage: input.sourceLanguage,
            targetLanguage: input.targetLanguage,
            context: input.context,
            translatedText: translatedText,
          });

          return {
            success: true,
            translationId: (result as any).insertId || 0,
            translatedText: translatedText,
          };
        } catch (error) {
          throw new Error(`Translation failed: ${error}`);
        }
      }),

    // Step 4: Get translations for a transcription
    getTranslations: protectedProcedure
      .input(z.object({ transcriptionId: z.number() }))
      .query(async ({ input }) => {
        return await getTranscriptionTranslations(input.transcriptionId);
      }),

    // Step 5: Merge multiple parts into single document
    mergeDocuments: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          parts: z.array(
            z.object({
              title: z.string(),
              content: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Build Markdown format
          const markdownParts = input.parts.map(
            (part, idx) => `## Part ${idx + 1}: ${part.title}\n\n${part.content}`
          );
          const mergedMarkdown = `# ${input.title}\n\n${input.description ? input.description + "\n\n" : ""}${markdownParts.join("\n\n---\n\n")}`;

          // Build plain text format
          const plainTextParts = input.parts.map(
            (part, idx) => `Part ${idx + 1}: ${part.title}\n\n${part.content}`
          );
          const mergedPlainText = `${input.title}\n\n${input.description ? input.description + "\n\n" : ""}${plainTextParts.join("\n\n---\n\n")}`;

          const result = await createMergedDocument({
            userId: ctx.user.id,
            title: input.title,
            description: input.description,
            mergedMarkdown: mergedMarkdown,
            mergedPlainText: mergedPlainText,
            partCount: input.parts.length,
          });

          return {
            success: true,
            documentId: (result as any).insertId || 0,
            mergedMarkdown: mergedMarkdown,
            mergedPlainText: mergedPlainText,
          };
        } catch (error) {
          throw new Error(`Merge failed: ${error}`);
        }
      }),

    // Get user's merged documents
    getUserDocuments: protectedProcedure.query(async ({ ctx }) => {
      return await getUserMergedDocuments(ctx.user.id);
    }),

    // Get user's transcriptions
    getUserTranscriptions: protectedProcedure.query(async ({ ctx }) => {
      return await getUserTranscriptions(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
