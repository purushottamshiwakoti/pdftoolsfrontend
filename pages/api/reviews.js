export async function handler(req, res) {
  const apiUrl = `https://pdftoolsbackend.vercel.app/api/reviews`;

  const response = await fetch(apiUrl, { cache: "no-store", method: "GET" });
  const data = await response.json();

  return res.status(200).json(data);
}

export default handler;