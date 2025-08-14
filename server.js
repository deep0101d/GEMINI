const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_KEY = "AIzaSyBpLH4tah8Nj4z_NhMm79MF-vTQiA5ivhQ"; // Your Gemini API key

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Missing 'question' in request body" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: question }] }
          ]
        })
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Gemini AI proxy is running! Use POST /chat to send questions.");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
