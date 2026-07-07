import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useLocation } from "wouter";

type WorkflowStep = "upload" | "extract" | "translate" | "merge";

export default function Workflow() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  
  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("English");
  
  // Extract state
  const [transcriptionId, setTranscriptionId] = useState<number | null>(null);
  const [extractedText, setExtractedText] = useState("");
  
  // Translate state
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [context, setContext] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translationId, setTranslationId] = useState<number | null>(null);
  
  // Merge state
  const [mergeTitle, setMergeTitle] = useState("");
  const [mergeDescription, setMergeDescription] = useState("");
  const [mergedMarkdown, setMergedMarkdown] = useState("");
  
  const uploadMutation = trpc.translator.uploadTranscription.useMutation();
  const transcribeAudioMutation = trpc.translator.transcribeAudioFile.useMutation();
  const translateMutation = trpc.translator.translateText.useMutation();
  const mergeMutation = trpc.translator.mergeDocuments.useMutation();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to use this page.</p>
          <Button onClick={() => setLocation("/")}>Back to Home</Button>
        </Card>
      </div>
    );
  }
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    const text = await file.text();
    
    try {
      const result = await uploadMutation.mutateAsync({
        fileName: file.name,
        jsonData: text,
        sourceLanguage,
      });
      
      setTranscriptionId(result.transcriptionId);
      setExtractedText(result.extractedText);
      setCurrentStep("extract");
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("File upload failed");
    }
  };
  
  const handleTranslate = async () => {
    if (!transcriptionId) return;
    
    try {
      const result = await translateMutation.mutateAsync({
        transcriptionId,
        sourceLanguage,
        targetLanguage,
        context: context || undefined,
      });
      
      setTranslationId(result.translationId);
      setTranslatedText(result.translatedText);
      setCurrentStep("merge");
      toast.success("Translation completed!");
    } catch (error) {
      toast.error("Translation failed");
    }
  };
  
  const handleMerge = async () => {
    if (!translatedText) return;
    
    try {
      const result = await mergeMutation.mutateAsync({
        title: mergeTitle || "Translateilen Document",
        description: mergeDescription,
        parts: [
          { title: "Original Text", content: extractedText },
          { title: "Translatei", content: translatedText },
        ],
      });
      
      setMergedMarkdown(result.mergedMarkdown);
      toast.success("Documents merged successfully!");
    } catch (error) {
      toast.error("Merging failed");
    }
  };
  
  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([mergedMarkdown], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${mergeTitle || "document"}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([mergedMarkdown.replace(/[#*]/g, "")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${mergeTitle || "document"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const downloadJSON = () => {
    const jsonData = {
      title: mergeTitle || "Document",
      description: mergeDescription,
      timestamp: new Date().toISOString(),
      parts: [
        { title: "Original Text", content: extractedText },
        { title: "Translatei", content: translatedText },
      ],
    };
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `${mergeTitle || "document"}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-8">
          <h1 className="text-5xl font-black mb-2">Academic Translation Workflow</h1>
          <p className="text-lg text-muted-foreground">Step-by-step video transcription, translation, and merging</p>
        </div>
      </div>
      
      {/* Steps Navigation */}
      <div className="border-b border-border">
        <div className="container py-6 flex gap-8">
          {(["upload", "extract", "translate", "merge"] as const).map((step, idx) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`flex items-center gap-3 pb-2 border-b-2 transition-colors ${
                currentStep === step
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="w-8 h-8 bg-primary text-white flex items-center justify-center font-bold rounded-none">
                {idx + 1}
              </div>
              <span className="font-semibold">
                {step === "upload" && "Upload"}
                {step === "extract" && "Extract"}
                {step === "translate" && "Translate"}
                {step === "merge" && "Merge"}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="container py-12">
        {currentStep === "upload" && (
          <Card className="p-8 max-w-2xl">
            <h2 className="text-3xl font-black mb-6">Adım 1: Dosya Upload</h2>
            <div className="space-y-6">
              <div className="border-b border-border pb-6">
                <h3 className="text-lg font-bold mb-4">Option 1: JSON Transcription File</h3>
              </div>
              
              <div>
                <Label htmlFor="file">JSON Transcription File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={uploadMutation.isPending}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Whisper API'den çıkan JSON dosyasını yükleyin
                </p>
              </div>
              
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="source-lang">Source Language</Label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urdu">Urduca</SelectItem>
                    <SelectItem value="Bengali">Bengalce</SelectItem>
                    <SelectItem value="Hindi">Hintçe</SelectItem>
                    <SelectItem value="German">Almanca</SelectItem>
                    <SelectItem value="French">Fransızca</SelectItem>
                    <SelectItem value="English">İngilizce</SelectItem>
                    <SelectItem value="Italian">İtalyanca</SelectItem>
                    <SelectItem value="Spanish">İspanyolca</SelectItem>
                    <SelectItem value="Finnish">Fince</SelectItem>
                    <SelectItem value="Estonian">Estonca</SelectItem>
                    <SelectItem value="Indonesian">Endonez Dili</SelectItem>
                    <SelectItem value="Malay">Malezya Dili</SelectItem>
                    <SelectItem value="Japanese">Japonca</SelectItem>
                    <SelectItem value="Korean">Korece</SelectItem>
                    <SelectItem value="Chinese">Çince</SelectItem>
                    <SelectItem value="Swedish">İsveçce</SelectItem>
                    <SelectItem value="Norwegian">Norveçce</SelectItem>
                    <SelectItem value="Danish">Danimarkaca</SelectItem>
                    <SelectItem value="Dutch">Hollandaca</SelectItem>
                    <SelectItem value="Persian">Farsça</SelectItem>
                    <SelectItem value="Turkish">Türkçe</SelectItem>
                    <SelectItem value="Arabic">Arapça</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button
                onClick={() => uploadedFile && handleFileUpload({ target: { files: [uploadedFile] } } as any)}
                disabled={!uploadedFile || uploadMutation.isPending}
                className="w-full bg-primary text-white"
              >
                {uploadMutation.isPending ? "Uploadniyor..." : "Next Step"}
              </Button>
              
              <div className="border-t border-b border-border py-6">
                <h3 className="text-lg font-bold mb-4">Option 2: Ses/Video Dosyası (Whisper API)</h3>
              </div>
              
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="audio-file">Select Audio/Video File</Label>
                <Input
                  id="audio-file"
                  type="file"
                  accept=".mp3,.wav,.m4a,.webm,.ogg"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    // Validate file size (16MB limit for Whisper)
                    const maxSize = 16 * 1024 * 1024; // 16MB
                    if (file.size > maxSize) {
                      toast.error(`Dosya çok büyük. Maksimum 16MB olmalıdır. (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                      return;
                    }
                    
                    // Validate file format
                    const validFormats = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/webm", "audio/ogg"];
                    if (!validFormats.includes(file.type)) {
                      toast.error("Desteklenmeyen dosya formatı. MP3, WAV, M4A, WebM veya OGG kullanın.");
                      return;
                    }
                    
                    // In production, upload to S3 and get URL
                    // For now, create a local URL (works for testing)
                    const fileUrl = URL.createObjectURL(file);
                    setAudioUrl(fileUrl);
                    toast.success(`Dosya seçildi: ${file.name}`);
                  }}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Desteklenen formatlar: MP3, WAV, M4A, WebM, OGG (Maksimum 16MB)
                  </p>
                </div>
                {audioUrl && (
                  <div className="pb-2">
                    <p className="text-xs text-muted-foreground italic">Video dili algılandı</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="audio-url">Audio/Video File URL'si</Label>
                  <Input
                    id="audio-url"
                    type="url"
                    placeholder="https://example.com/audio.mp3"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    S3 veya başka bir depolama hizmetinden ses/video dosyasının URL'sini girin (mp3, wav, m4a, webm, ogg - max 16MB)
                  </p>
                </div>
                {audioUrl && (
                  <div className="pb-2">
                    <p className="text-xs text-muted-foreground italic">Video dili algılandı</p>
                  </div>
                )}
              </div>
              
              <Button
                onClick={async () => {
                  if (!audioUrl) return;
                  try {
                    const result = await transcribeAudioMutation.mutateAsync({
                      audioUrl,
                      sourceLanguage,
                    });
                    setTranscriptionId(result.transcriptionId);
                    setExtractedText(result.extractedText);
                    setCurrentStep("extract");
                    toast.success("Ses başarıyla transkribe edildi!");
                  } catch (error) {
                    toast.error("Transkripsiyon başarısız oldu");
                  }
                }}
                disabled={!audioUrl || transcribeAudioMutation.isPending}
                className="w-full bg-primary text-white"
              >
                {transcribeAudioMutation.isPending ? "Transkribe ediliyor..." : "Transcribe Audio"}
              </Button>
            </div>
          </Card>
        )}
        
        {currentStep === "extract" && (
          <Card className="p-8 max-w-4xl">
            <h2 className="text-3xl font-black mb-6">Adım 2: Metin Extract</h2>
            <div className="space-y-6">
              <div>
                <Label>Extractnan Metin</Label>
                <Textarea
                  value={extractedText}
                  readOnly
                  className="mt-2 h-48"
                />
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={() => setCurrentStep("upload")}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep("translate")}
                  className="flex-1 bg-primary text-white"
                >
                  Translateiye Devam Et
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {currentStep === "translate" && (
          <Card className="p-8 max-w-4xl">
            <h2 className="text-3xl font-black mb-6">Adım 3: Akademik Translatei</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Source Language</Label>
                  <Input value={sourceLanguage} disabled className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="target-lang">Target Language</Label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urdu">Urduca</SelectItem>
                    <SelectItem value="Bengali">Bengalce</SelectItem>
                    <SelectItem value="Hindi">Hintçe</SelectItem>
                    <SelectItem value="German">Almanca</SelectItem>
                    <SelectItem value="French">Fransızca</SelectItem>
                    <SelectItem value="English">İngilizce</SelectItem>
                    <SelectItem value="Italian">İtalyanca</SelectItem>
                    <SelectItem value="Spanish">İspanyolca</SelectItem>
                    <SelectItem value="Finnish">Fince</SelectItem>
                    <SelectItem value="Estonian">Estonca</SelectItem>
                    <SelectItem value="Indonesian">Endonez Dili</SelectItem>
                    <SelectItem value="Malay">Malezya Dili</SelectItem>
                    <SelectItem value="Japanese">Japonca</SelectItem>
                    <SelectItem value="Korean">Korece</SelectItem>
                    <SelectItem value="Chinese">Çince</SelectItem>
                    <SelectItem value="Swedish">İsveçce</SelectItem>
                    <SelectItem value="Norwegian">Norveçce</SelectItem>
                    <SelectItem value="Danish">Danimarkaca</SelectItem>
                    <SelectItem value="Dutch">Hollandaca</SelectItem>
                    <SelectItem value="Persian">Farsça</SelectItem>
                    <SelectItem value="Turkish">Türkçe</SelectItem>
                    <SelectItem value="Arabic">Arapça</SelectItem>
                  </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="context">Bağlam (İsteğe Bağlı)</Label>
                <Textarea
                  id="context"
                  placeholder="Örn: Felsefe dersi, Heidegger hakkında..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="mt-2 h-24"
                />
              </div>
              
              {translatedText && (
                <div>
                  <Label>Translatei Sonucu</Label>
                  <Textarea
                    value={translatedText}
                    readOnly
                    className="mt-2 h-48"
                  />
                </div>
              )}
              
              <div className="flex gap-4">
                <Button
                  onClick={() => setCurrentStep("extract")}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleTranslate}
                  disabled={translateMutation.isPending}
                  className="flex-1 bg-primary text-white"
                >
                  {translateMutation.isPending ? "Çevriliyor..." : "Translatei Yap"}
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {currentStep === "merge" && (
          <Card className="p-8 max-w-4xl">
            <h2 className="text-3xl font-black mb-6">Adım 4: Documentler Merge</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="merge-title">Document Başlığı</Label>
                <Input
                  id="merge-title"
                  value={mergeTitle}
                  onChange={(e) => setMergeTitle(e.target.value)}
                  placeholder="Document başlığını girin"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="merge-desc">Açıklama (İsteğe Bağlı)</Label>
                <Textarea
                  id="merge-desc"
                  value={mergeDescription}
                  onChange={(e) => setMergeDescription(e.target.value)}
                  placeholder="Document açıklaması"
                  className="mt-2 h-24"
                />
              </div>
              
              {mergedMarkdown && (
                <div>
                  <Label>Mergeilmiş Document (Markdown)</Label>
                  <Textarea
                    value={mergedMarkdown}
                    readOnly
                    className="mt-2 h-48"
                  />
                </div>
              )}
              
              <div className="flex gap-4">
                <Button
                  onClick={() => setCurrentStep("translate")}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleMerge}
                  disabled={mergeMutation.isPending || !translatedText}
                  className="flex-1 bg-primary text-white"
                >
                  {mergeMutation.isPending ? "Mergeiliyor..." : "Documentler Merge"}
                </Button>
              </div>
              
              {mergedMarkdown && (
                <div className="flex gap-4 pt-4 border-t border-border">
                  <Button
                    onClick={downloadMarkdown}
                    variant="outline"
                    className="flex-1 text-sm"
                  >
                    Markdown İndir
                  </Button>
                  <Button
                    onClick={downloadText}
                    className="flex-1 bg-primary text-white text-sm"
                  >
                    Metin İndir
                  </Button>
                  <Button
                    onClick={downloadJSON}
                    variant="outline"
                    className="flex-1 text-sm"
                  >
                    JSON İndir
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
