import React from "react";
import fs from "fs";
import fetch from "node-fetch"; // Importing fetch for Node.js environment

const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const baseUrl = {
    development: "http://localhost:3000",
    production: "https://allpdfconverter.com",
  }[process.env.NODE_ENV];

  const response = await fetch(`${baseUrl}/api/blogs`);
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
          <priority>1.0</priority>
        </url>
      `;
    })
    .join("");

  const blogUrls = blogs
    .map((item) => {
      return `
        <url>
          <loc>${baseUrl}/blog/${item.slug}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>1.0</priority>
        </url>
      `;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
