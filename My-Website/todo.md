# Academic Video Translator - Proje TODO

## Veritabanı ve Backend
- [x] Drizzle schema güncelle (transcriptions, translations, mergedDocuments tabloları)
- [x] tRPC prosedürleri yaz (upload, extract, translate, merge, download)
- [x] Whisper API entegrasyonu (voice-transcription.md referansı)
- [x] LLM entegrasyonu (llm-integration.md referansı)
- [ ] File storage entegrasyonu (file-storage.md referansı)

## Frontend - Ana Sayfa ve Navigasyon
- [x] İsviçre Tipografik Stili CSS (beyaz zemin, kırmızı aksanlar, siyah sans-serif)
- [x] Global tema ve renk paletini index.css'te tanımla
- [x] Ana sayfa layout'u tasarla (asimetrik grid, negatif alan)
- [x] Navigasyon yapısı (Ana Sayfa, İş Akışı, Kaynak Kodu, Dokümantasyon)

## Frontend - İş Akışı Sayfası
- [x] Step 1: Yükle (JSON veya Ses/Video dosyası yükleme)
- [x] Step 2: Ayıkla (Metin ayıklama ve önizleme)
- [x] Step 3: Çevir (Dil seçimi, akademik çeviri)
- [x] Step 4: Birleştir (Çoklu parça birleştirme)
- [x] Sonuç görüntüleme (Markdown ve metin formatı)

## Frontend - Kaynak Kodu Görüntüleme Sayfası
- [x] Frontend kodlarını göster (client/ dizini)
- [x] Backend kodlarını göster (server/ dizini)
- [x] Kopyalama işlevi (her kod bloğu için)

## Frontend - Dokümantasyon Sayfası
- [x] SKILL.md içeriğini göster
- [x] SKILL.md indirme linki
- [x] Kurulum talimatları

## Entegrasyonlar
- [x] Whisper API ses/video transkripsiyon
- [x] Forge API LLM çeviri
- [ ] S3 file storage (indirme için)

## Test ve Doğrulama
- [ ] Backend prosedürleri için vitest testleri yaz
- [ ] Frontend bileşenleri test et
- [ ] İş akışı uçtan uca test et

## Dağıtım ve Dokümantasyon

## İyileştirmeler ve Eksik Özellikler
- [x] Ses/video dosyası yükleme UI'si ekle ve Whisper transkripsiyon sonucunu JSON akışına bağla (dosya validation ile)
- [x] JSON indirme desteği ekle (ham transcription JSON ve/veya merged export JSON)
- [ ] Workflow'da kullanıcıya dinamik çoklu parça ekleme/çıkarma arayüzü ekle
- [ ] Sonuçlar için ayrı Markdown ve düz metin önizleme panelleri ekle
- [ ] Kaynak kodu sayfasını gerçek proje dosyalarını okuyup listeleyecek şekilde uygula
- [ ] Syntax highlighting için gerçek bir çözüm ekle (Shiki/Prism)
- [ ] Gerekirse indirme işlemleri için backend/tRPC download endpointleri ekle
