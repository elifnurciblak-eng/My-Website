# iyzico Products Feed - XML Implementation Guide

## Overview
Bu dokümantasyon, projeye eklenen Google Merchant Center uyumlu XML ürün beslemesi (feed) özelliğini açıklar.

## Yapılan Değişiklikler

### 1. Paketler (Dependencies)
- **xmlbuilder**: XML oluşturma için (yüklü, isteğe bağlı olarak kullanılabilir)

### 2. Veritabanı Şeması (drizzle/schema.ts)
Yeni `products` tablosu eklendi:

```typescript
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: varchar("price", { length: 50 }).notNull(), // e.g., "99.99 TRY"
  link: varchar("link", { length: 512 }).notNull(),
  imageLink: varchar("imageLink", { length: 512 }).notNull(),
  availability: varchar("availability", { length: 50 }).default("in stock").notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  condition: varchar("condition", { length: 50 }).default("new").notNull(),
  googleProductCategory: varchar("googleProductCategory", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
```

### 3. Veritabanı Fonksiyonları (server/db.ts)
İki yeni fonksiyon eklendi:

```typescript
export async function createProduct(data: InsertProduct)
export async function getAllProducts()
```

### 4. tRPC Router (server/routers.ts)
Yeni `productsFeed` router'ı eklendi:

```typescript
productsFeed: router({
  getXmlFeed: publicProcedure.query(async () => {...}),
  getJsonFeed: publicProcedure.query(async () => {...}),
})
```

**Endpoints:**
- `productsFeed.getXmlFeed` - Google Merchant Center uyumlu XML formatında ürünleri döndürür
- `productsFeed.getJsonFeed` - JSON formatında ürünleri döndürür

### 5. Express API Endpoint (server/api_products_feed.ts)
Express backend için `/api/products-feed` endpoint'i oluşturuldu.

**Kullanım:**
```bash
# XML formatında (varsayılan)
GET /api/products-feed

# JSON formatında
GET /api/products-feed?format=json

# Sitemap formatında
GET /api/products-feed/sitemap
```

### 6. Seed Script (server/seed_products.ts)
Örnek ürün verilerini veritabanına yüklemek için script.

**Çalıştırma:**
```bash
npx tsx server/seed_products.ts
```

## XML Feed Formatı

Oluşturulan XML, Google Merchant Center standardına uyumludur:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Academic Translator - iyzico Products</title>
    <link>https://websitemymy.netlify.app</link>
    <description>Google Merchant Center Compatible Product Feed</description>
    <lastBuildDate>2026-07-07T13:30:00.000Z</lastBuildDate>
    <item>
      <g:id>1</g:id>
      <title>Akademik Video Çeviri Hizmeti - Başlangıç</title>
      <description>10 dakikaya kadar olan akademik videolarınız için profesyonel çeviri ve transkripsiyon hizmeti.</description>
      <g:price>299.00 TRY</g:price>
      <link>https://websitemymy.netlify.app/services/basic-translation</link>
      <g:image_link>https://websitemymy.netlify.app/assets/service-basic.jpg</g:image_link>
      <g:availability>in stock</g:availability>
      <g:brand>AcademicTranslator</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>Business & Industrial > Advertising & Marketing > Translation Services</g:google_product_category>
    </item>
  </channel>
</rss>
```

## Entegrasyon Adımları

### 1. Veritabanı Migrasyonu
Yeni `products` tablosunu oluşturmak için:

```bash
# Drizzle migration oluştur
npm run db:generate

# Migrationı uygula
npm run db:migrate
```

### 2. Örnek Verileri Yükle
```bash
npx tsx server/seed_products.ts
```

### 3. API'yi Test Et

**tRPC ile (Frontend):**
```typescript
// client/src/App.tsx
const { data: feed } = await trpc.productsFeed.getXmlFeed.query();
console.log(feed.xml);
```

**Express ile (Backend):**
```bash
curl http://localhost:5173/api/products-feed
curl http://localhost:5173/api/products-feed?format=json
curl http://localhost:5173/api/products-feed/sitemap
```

## Google Merchant Center Entegrasyonu

1. **Google Merchant Center'da** yeni veri kaynağı oluştur
2. **Feed URL'sini** ayarla: `https://websitemymy.netlify.app/api/products-feed`
3. **Format seç:** XML
4. **Güncelleme sıklığı:** Günlük veya saatlik
5. **Doğrula ve yayınla**

## iyzico Entegrasyonu

iyzico ürün listesi için:

1. **iyzico Dashboard**'a git
2. **Ürün Yönetimi** → **Veri Beslemesi** bölümüne git
3. **Feed URL'sini** ekle: `https://websitemymy.netlify.app/api/products-feed`
4. **Otomatik senkronizasyon** etkinleştir

## Güvenlik Notları

- `/api/products-feed` endpoint'i **public** olarak ayarlanmıştır (kimlik doğrulama gerektirmez)
- XML çıktısında tüm özel karakterler escape edilmiştir
- Veritabanı hatalarında hata mesajları döndürülür

## Gelecek İyileştirmeler

- [ ] Pagination desteği (büyük ürün listeleri için)
- [ ] Ürün kategorileri filtreleme
- [ ] Fiyat güncellemeleri için webhook
- [ ] Stok durumu senkronizasyonu
- [ ] CSV export seçeneği

## Sorun Giderme

**Feed boş görünüyor?**
- Veritabanında ürün olup olmadığını kontrol edin
- `getAllProducts()` fonksiyonunun çalıştığını doğrulayın

**XML parsing hatası?**
- XML'in geçerli olduğunu doğrulayın: https://www.xmlvalidation.com/
- Özel karakterlerin düzgün escape edildiğini kontrol edin

**Google Merchant Center kabul etmiyor?**
- Tüm zorunlu alanların doldurulduğunu kontrol edin
- `googleProductCategory` değerinin geçerli olduğunu doğrulayın
