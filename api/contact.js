export default async function handler(req, res) {
    // Allow only POST
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        // Parse body (handles both parsed and raw cases)
        let body = req.body;
        if (typeof body === "string") {
            body = JSON.parse(body);
        }

        const name = body?.name?.trim();
        const email = body?.email?.trim();
        const inquiry = body?.inquiry || "";
        const message = body?.message?.trim();

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (!process.env.WEB3FORMS_KEY) {
            console.error("WEB3FORMS_KEY is missing");
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                access_key: process.env.WEB3FORMS_KEY,
                name,
                email,
                inquiry,
                message,
                subject: "New message from Sentinel Portfolio",
                from_name: "Sentinel Contact Form"
            })
        });

        const data = await response.json();
        return res.status(response.status).json(data);

    } catch (error) {
        console.error("Contact API error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}