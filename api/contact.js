module.exports = async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ success: false, message: "Method not allowed" });
        }

        const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

        const name = (body.name || "").toString().trim();
        const email = (body.email || "").toString().trim();
        const inquiry = (body.inquiry || "").toString();
        const message = (body.message || "").toString().trim();

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const key = process.env.WEB3FORMS_KEY;
        if (!key) {
            return res.status(500).json({
                success: false,
                message: "WEB3FORMS_KEY environment variable is missing"
            });
        }

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                access_key: key,
                name,
                email,
                inquiry,
                message,
                subject: "New message from Sentinel Portfolio",
                from_name: "Sentinel Contact Form"
            })
        });

        // Read as text first so we can see HTML errors
        const text = await response.text();
        console.log("Web3Forms status:", response.status);
        console.log("Web3Forms raw reply:", text.slice(0, 300));

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: "Web3Forms returned non-JSON response",
                status: response.status,
                preview: text.slice(0, 200)
            });
        }

        return res.status(response.status).json(data);

    } catch (error) {
        console.error("Full error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message || String(error)
        });
    }
};