import { dashboardUrl } from "@/lib/url";

const handler = async (req, res) => {
  const apiUrl = `${dashboardUrl}/page/merge-pdf`;
  const response = await fetch(apiUrl, { cache: "no-store", method: "GET" });
  const data = await response.json();
  const { page } = data;
  return res.status(200).json({ page });
};

export default handler;
