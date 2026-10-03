export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { name, email, inquiry, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                access_key: process.env.WEB3FORMS_KEY, // secret — not visible in browser
                name,
                email,
                inquiry: inquiry || "",
                message,
                subject: "New message from Sentinel Portfolio",
                from_name: "Sentinel Contact Form"
            })
        });

        const data = await response.json();

        return res.status(response.status).json(data);

    } catch (error) {
        console.error("Contact form error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}