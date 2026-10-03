module.exports = async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ success: false, message: "Method not allowed" });
        }

        // Debug: show what we received
        console.log("Method:", req.method);
        console.log("Body type:", typeof req.body);
        console.log("Body:", req.body);
        console.log("Has WEB3FORMS_KEY:", !!process.env.WEB3FORMS_KEY);

        const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

        const name = (body.name || "").toString().trim();
        const email = (body.email || "").toString().trim();
        const inquiry = (body.inquiry || "").toString();
        const message = (body.message || "").toString().trim();

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                debug: { name, email, message: !!message, rawBody: body }
            });
        }

        const key = process.env.WEB3FORMS_KEY;
        if (!key) {
            return res.status(500).json({
                success: false,
                message: "WEB3FORMS_KEY environment variable is missing"
            });
        }

        const payload = {
            access_key: key,
            name,
            email,
            inquiry,
            message,
            subject: "New message from Sentinel Portfolio",
            from_name: "Sentinel Contact Form"
        };

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Web3Forms response:", data);

        return res.status(response.ok ? 200 : response.status).json(data);

    } catch (error) {
        console.error("Full error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message || String(error)
        });
    }
};