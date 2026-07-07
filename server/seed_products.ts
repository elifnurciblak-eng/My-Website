import { createProduct, getAllProducts } from "./db";

async function seed() {
  try {
    const existing = await getAllProducts();
    if (existing.length > 0) {
      console.log("Products already exist, skipping seed.");
      return;
    }

    const sampleProducts = [
      {
        title: "Akademik Video Çeviri Hizmeti - Başlangıç",
        description: "10 dakikaya kadar olan akademik videolarınız için profesyonel çeviri ve transkripsiyon hizmeti.",
        price: "299.00 TRY",
        link: "https://websitemymy.netlify.app/services/basic-translation",
        imageLink: "https://websitemymy.netlify.app/assets/service-basic.jpg",
        brand: "AcademicTranslator",
        googleProductCategory: "Business & Industrial > Advertising & Marketing > Translation Services",
      },
      {
        title: "Akademik Video Çeviri Hizmeti - Profesyonel",
        description: "60 dakikaya kadar olan videolar için derinlemesine akademik terminoloji korumalı çeviri.",
        price: "999.00 TRY",
        link: "https://websitemymy.netlify.app/services/pro-translation",
        imageLink: "https://websitemymy.netlify.app/assets/service-pro.jpg",
        brand: "AcademicTranslator",
        googleProductCategory: "Business & Industrial > Advertising & Marketing > Translation Services",
      },
    ];

    for (const product of sampleProducts) {
      await createProduct(product);
      console.log(`Added product: ${product.title}`);
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
  }
}

seed();
