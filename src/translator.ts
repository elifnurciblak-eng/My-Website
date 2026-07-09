import * as fs from 'fs';
import * as path from 'path';

export class AcademicTranslator {
    private glossary: Record<string, string>;

    constructor() {
        const glossaryPath = path.join(__dirname, '../academic_glossary.json');
        if (fs.existsSync(glossaryPath)) {
            this.glossary = JSON.parse(fs.readFileSync(glossaryPath, 'utf8'));
        } else {
            this.glossary = {};
        }
    }

    translate(text: string): string {
        let translatedText = text;
        for (const [term, definition] of Object.entries(this.glossary)) {
            const regex = new RegExp(term, 'gi');
            translatedText = translatedText.replace(regex, `${term} (${definition})`);
        }
        return translatedText;
    }
}

// Örnek kullanım
const translator = new AcademicTranslator();
const sampleText = "The Attention Mechanism is a key component of modern AI.";
console.log('Orijinal:', sampleText);
console.log('Çeviri:', translator.translate(sampleText));
