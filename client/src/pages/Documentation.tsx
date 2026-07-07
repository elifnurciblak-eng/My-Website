import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "sonner";

const SKILL_MD = `---
name: video-academic-translator
description: "Transcribes videos, translates academic/technical content with high precision, and merges multiple parts into a unified document. Use for: multi-part video lectures, academic seminars, philosophical discussions, and technical presentations requiring bilingual output."
---

# Video Academic Translator

This skill automates the workflow for transcribing videos and translating their content with academic rigor, especially for complex or multi-part sessions.

## Workflow

### 1. Transcription
Use \`manus-speech-to-text\` to transcribe the video. If the video is in multiple parts, transcribe each separately.
Extract the plain text from the resulting JSON using the helper script:
\`\`\`bash
python3 /home/ubuntu/skills/video-academic-translator/scripts/extract_text.py <input_json> <output_txt>
\`\`\`

### 2. Academic Translation
Use the specialized translation script which utilizes \`claude-sonnet-4-6\` for high-quality academic output.
\`\`\`bash
python3 /home/ubuntu/skills/video-academic-translator/scripts/translate_academic.py <input_txt> <output_txt> "[Source Lang]" "[Target Lang]" "[Context Description]"
\`\`\`
*Note: The script handles philosophical terms, proper names, and formatting automatically.*

### 3. Merging and Finalizing
For multi-part videos, merge the transcriptions and translations into a single structured Markdown file:
\`\`\`bash
python3 /home/ubuntu/skills/video-academic-translator/scripts/merge_parts.py <output_md> <part1_txt> <part2_txt> ...
\`\`\`

### 4. PDF Conversion
Finalize the document by converting it to PDF for the user:
\`\`\`bash
manus-md-to-pdf <input_md> <output_pdf>
\`\`\`

## Best Practices
- **Context is King**: Always provide a brief context (e.g., "Lecture on Heidegger and Nazism") to the translation script to improve terminology accuracy.
- **Bilingual Output**: Users often prefer seeing the original transcription and the translation in the same document. Use the merging script to create sections for each.
- **Model Choice**: Default to \`claude-sonnet-4-6\` for translation as it handles complex reasoning and long contexts better than standard models.
`;

export default function Documentation() {
  const downloadSkillMd = () => {
    const element = document.createElement("a");
    const file = new Blob([SKILL_MD], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = "SKILL.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("SKILL.md indirildi!");
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-8">
          <h1 className="text-5xl font-black mb-2">Documentation</h1>
          <p className="text-lg text-muted-foreground">Manus Skill tanımı ve kurulum talimatları</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="container py-12 max-w-4xl">
        <Card className="p-8 mb-8">
          <h2 className="text-3xl font-black mb-4">SKILL.md</h2>
          <p className="text-muted-foreground mb-6">
            Bu Manus Skill, akademik video transkripsiyon, çeviri ve birleştirme işlemlerini otomatikleştirir.
          </p>
          
          <div className="bg-muted p-6 rounded mb-6 font-mono text-sm overflow-x-auto">
            <pre>{SKILL_MD}</pre>
          </div>
          
          <Button
            onClick={downloadSkillMd}
            className="w-full bg-primary text-white gap-2"
          >
            <Download className="w-4 h-4" />
            SKILL.md İndir
          </Button>
        </Card>
        
        <Card className="p-8">
          <h2 className="text-3xl font-black mb-6">Kurulum Talimatları</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">1. Adım: Dosyaları Hazırlayın</h3>
              <p className="text-muted-foreground mb-3">
                Aşağıdaki Python scriptlerini \`/home/ubuntu/skills/video-academic-translator/scripts/\` dizinine kopyalayın:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>extract_text.py</li>
                <li>merge_parts.py</li>
                <li>translate_academic.py</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">2. Adım: SKILL.md Dosyasını Yerleştirin</h3>
              <p className="text-muted-foreground">
                İndirilen SKILL.md dosyasını \`/home/ubuntu/skills/video-academic-translator/\` dizinine kopyalayın.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">3. Adım: Bağımlılıkları Yükleyin</h3>
              <p className="text-muted-foreground mb-3">
                Scriptlerin çalışması için gerekli Python paketlerini yükleyin:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                pip install openai
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">4. Adım: Kullanmaya Get Started</h3>
              <p className="text-muted-foreground mb-3">
                Artık Manus Skill'i kullanarak akademik video çevirisi yapabilirsiniz:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-sm space-y-2">
                <div># 1. Transkripsiyon JSON'ından metin ayıkla</div>
                <div>python3 extract_text.py input.json output.txt</div>
                <div className="mt-2"># 2. Akademik çeviri yap</div>
                <div>python3 translate_academic.py output.txt translated.txt "Persian" "Turkish" "Felsefe dersi"</div>
                <div className="mt-2"># 3. Çoklu parçaları birleştir</div>
                <div>python3 merge_parts.py merged.md part1.txt part2.txt part3.txt</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
