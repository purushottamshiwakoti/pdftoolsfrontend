import { dashboardUrl } from "@/lib/url";
import axios from "axios";

export async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      // Return 405 Method Not Allowed for non-POST requests
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = req.body;
    console.log(body);

    // Validate the presence of required fields
    const { id } = body;

    try {
      const sendViews = await axios.post(`${dashboardUrl}/views`, {
        blog_id: id,
      });
      return res
        .status(200)
        .json({ success: true, message: "Successfully added views" });
    } catch (error) {
      console.log("Error sending views:", error.message);

      // Return a 500 Internal Server Error with an error message
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.log("Unexpected error:", error.message);

    // Return a 500 Internal Server Error with an error message
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
