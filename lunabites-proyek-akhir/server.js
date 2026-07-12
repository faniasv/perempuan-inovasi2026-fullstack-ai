const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:3000"
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("LunaBites Server Berjalan");
});

app.post("/api/rekomendasi", async (req, res) => {
    console.log("POST /api/rekomendasi masuk");
    const { prompt } = req.body;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );
        console.log("Status:", response.status);
        if (!response.ok) {
            const error = await response.json();
            console.error("Gemini Error:", error);

            return res.status(response.status).json(error);
        }
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Gagal menghubungi Gemini."
        });
    }
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});