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
    console.log(body);
    const { fullName, email, comment } = body;

    try {
      const sendComment = await axios.post(
        "https://pdftoolsbackend.vercel.app/api/comment",
        { fullName, email, comment, id }
      );
      console.log(sendComment.data);

      // Here, you can process the received values and perform any necessary actions

      return res.status(200).json({ success: true, message: "Success" });
    } catch (error) {
      console.log("Error sending comment:", error.message);

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
