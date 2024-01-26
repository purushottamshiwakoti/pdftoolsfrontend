export async function handler(req, res) {
  const { slug } = req.query;

  const apiUrl = `https://pdftoolsbackend.vercel.app/api/other/${slug}`;

  const response = await fetch(apiUrl, { cache: "no-store", method: "GET" });
  const data = await response.json();
  const { page } = data;
  return res.status(200).json({ page });
}

export default handler;
