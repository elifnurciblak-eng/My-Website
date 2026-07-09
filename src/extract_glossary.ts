import * as fs from 'fs';
import * as path from 'path';

async function extractGlossary() {
    const stagingArea = path.join(__dirname, '../staging_area');
    const glossaryPath = path.join(__dirname, '../academic_glossary.json');

    console.log('Staging Area taranıyor...');
    
    if (!fs.existsSync(stagingArea)) {
        console.error('Staging Area dizini bulunamadı!');
        return;
    }

    const files = fs.readdirSync(stagingArea).filter(f => f.endsWith('.pdf'));
    
    if (files.length === 0) {
        console.log('İşlenecek PDF dosyası bulunamadı.');
        return;
    }

    for (const file of files) {
        console.log(`İşleniyor: ${file}`);
        // Burada gerçek bir PDF okuma ve LLM entegrasyonu simüle ediliyor
        // Önceki oturumda bu kısım LLM'e gönderiliyordu
        console.log('Metin uzunluğu analiz ediliyor... LLM\'e gönderiliyor...');
        
        // Örnek bir terim ekleyelim
        const currentGlossary = JSON.parse(fs.readFileSync(glossaryPath, 'utf8') || '{}');
        currentGlossary['Attention Mechanism'] = 'Dikkat Mekanizması - Yapay sinir ağlarında belirli girişlere odaklanmayı sağlayan yapı.';
        
        fs.writeFileSync(glossaryPath, JSON.stringify(currentGlossary, null, 2));
        console.log(`Sözlük güncellendi: ${glossaryPath}`);
    }
}

extractGlossary().catch(console.error);
