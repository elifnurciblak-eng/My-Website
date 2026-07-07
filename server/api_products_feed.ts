/**
 * Express endpoint for /api/products-feed
 * Serves Google Merchant Center compatible XML feed for iyzico products
 * 
 * Usage:
 * - XML feed: GET /api/products-feed?format=xml
 * - JSON feed: GET /api/products-feed?format=json
 * - Default: XML
 */

import { Router, Request, Response } from "express";
import { getAllProducts } from "./db";

export const productsFeedRouter = Router();

// Helper function to escape XML special characters
function escapeXml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Main endpoint: /api/products-feed
productsFeedRouter.get("/api/products-feed", async (req: Request, res: Response) => {
  try {
    const format = req.query.format as string || "xml";
    const products = await getAllProducts();

    if (format === "json") {
      // JSON format response
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        count: products.length,
        lastUpdated: new Date().toISOString(),
        products: products.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          link: p.link,
          imageLink: p.imageLink,
          availability: p.availability,
          brand: p.brand,
          condition: p.condition,
          googleProductCategory: p.googleProductCategory,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
      });
    } else {
      // XML format response (default)
      res.setHeader("Content-Type", "application/xml");

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n';
      xml += '  <channel>\n';
      xml += '    <title>Academic Translator - iyzico Products</title>\n';
      xml += '    <link>https://websitemymy.netlify.app</link>\n';
      xml += '    <description>Google Merchant Center Compatible Product Feed</description>\n';
      xml += `    <lastBuildDate>${new Date().toISOString()}</lastBuildDate>\n`;

      // Add each product as an item
      for (const product of products) {
        xml += '    <item>\n';
        xml += `      <g:id>${escapeXml(product.id.toString())}</g:id>\n`;
        xml += `      <title>${escapeXml(product.title)}</title>\n`;
        xml += `      <description>${escapeXml(product.description)}</description>\n`;
        xml += `      <g:price>${escapeXml(product.price)}</g:price>\n`;
        xml += `      <link>${escapeXml(product.link)}</link>\n`;
        xml += `      <g:image_link>${escapeXml(product.imageLink)}</g:image_link>\n`;
        xml += `      <g:availability>${escapeXml(product.availability)}</g:availability>\n`;
        xml += `      <g:brand>${escapeXml(product.brand)}</g:brand>\n`;
        xml += `      <g:condition>${escapeXml(product.condition)}</g:condition>\n`;
        
        if (product.googleProductCategory) {
          xml += `      <g:google_product_category>${escapeXml(product.googleProductCategory)}</g:google_product_category>\n`;
        }
        
        xml += '    </item>\n';
      }

      xml += '  </channel>\n';
      xml += '</rss>';

      res.send(xml);
    }
  } catch (error) {
    console.error("Error generating products feed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate products feed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Alternative endpoint for sitemap-style feed (optional)
productsFeedRouter.get("/api/products-feed/sitemap", async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();

    res.setHeader("Content-Type", "application/xml");

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add each product URL
    for (const product of products) {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(product.link)}</loc>\n`;
      xml += `    <lastmod>${product.updatedAt.toISOString().split("T")[0]}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    res.send(xml);
  } catch (error) {
    console.error("Error generating sitemap feed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate sitemap feed",
    });
  }
});
