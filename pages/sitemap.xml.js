import fs from "fs";
import fetch from "node-fetch"; // Importing fetch for Node.js environment
import { dashboardUrl } from "@/lib/url";

const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://www.allpdfconverter.com";

  const response = await fetch(`${dashboardUrl}/blogs`);
  const data = await response.json();
  const blogs = data.data;

  const staticPages = fs
    .readdirSync("pages")
    .filter((staticPage) => {
      return ![
        "_app.js",
        "_document.js",
        "_error.js",
        "sitemap.xml.js",
        "404.js",
        "api",
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${baseUrl}/${staticPagePath.split(".")[0]}`;
    });

  const staticUrls = staticPages
    .map((url) => {
      return `
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.9</priority>
        </url>
      `;
    })
    .join("");

  const blogUrls = blogs
    .map((item) => {
      return `
        <url>
          <loc>${baseUrl}/blog/${item.slug}</loc>
          <changefreq>monthly</changefreq>
          <priority>0.9</priority>
        </url>
      `;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>
     
     
      <url>
<loc>https://www.allpdfconverter.com/about</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>

<url>
<loc>https://www.allpdfconverter.com/blogs</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/bmp-to-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/compress-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/contacts</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/excel-to-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/extract-pdf-pages</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/grayscale-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>

<url>
<loc>https://www.allpdfconverter.com/jpg-to-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/merge-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/organize-pdf-pages</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/pdf-to-bmp</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/pdf-to-jpg</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/pdf-to-png</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/pdf-to-pptx</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/pdf-to-tiff</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/pdf-to-txt</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/pdf-to-word</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/pdf-to-zip</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/png-to-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/pptx-to-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/privacy-policy</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/protect-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/remove-pdf-pages</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/repair-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/rotate-pdf-pages</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/terms-of-use</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/tiff-to-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/txt-to-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/unlock-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://www.allpdfconverter.com/word-to-pdf</loc>
<lastmod>2024-03-27T10:42:19.808Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
${blogUrls}
    </urlset>
  `;

  // Set the response headers properly
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate"); // Cache for 24 hours
  res.setHeader("Vary", "Accept-Encoding");

  // Send the XML content as the response
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
