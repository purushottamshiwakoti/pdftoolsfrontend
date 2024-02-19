import React from "react";
import fs from "fs";
import fetch from "node-fetch"; // Importing fetch for Node.js environment
import { dashboardUrl } from "@/lib/url";

const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const baseUrl = {
    // development: "http://localhost:3000",
    development: "https://www.allpdfconverter.com",
    production: "https://www.allpdfconverter.com",
  }[process.env.NODE_ENV];

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

  <url>
    <loc>"sdmndsmnnm</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>;

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
          // <lastmod>${new Date(item.updated_at).toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.9</priority>
        </url>
      `;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap">
    <url>
          <loc>${baseUrl}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>1.0</priority>
        </url>
      ${staticUrls}
      ${blogUrls}
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
