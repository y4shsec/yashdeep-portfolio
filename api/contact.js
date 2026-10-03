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

        // Use form-urlencoded (sometimes works better than JSON with Cloudflare)
        const params = new URLSearchParams();
        params.append("access_key", key);
        params.append("name", name);
        params.append("email", email);
        params.append("inquiry", inquiry);
        params.append("message", message);
        params.append("subject", "New message from Sentinel Portfolio");
        params.append("from_name", "Sentinel Contact Form");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Origin": "https://yashdeep-portfolio-sentinel.vercel.app",
                "Referer": "https://yashdeep-portfolio-sentinel.vercel.app/"
            },
            body: params.toString()
        });

        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Reply preview:", text.slice(0, 200));

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: "Web3Forms returned non-JSON (likely Cloudflare block)",
                status: response.status,
                preview: text.slice(0, 150)
            });
        }

        return res.status(response.status).json(data);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};