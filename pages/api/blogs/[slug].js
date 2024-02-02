import { dashboardUrl } from "@/lib/url";

export async function handler(req, res) {
  const { slug } = req.query;
  console.log(slug);
  const apiUrl = `${dashboardUrl}/blogs/${slug}`;

  const response = await fetch(apiUrl, { cache: "no-store", method: "GET" });
  const data = await response.json();

  return res.status(200).json(data);
}

export default handler;
