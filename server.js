const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Your Gemini API key
const GEMINI_API_KEY = "AIzaSyCwSIJA62axl23pdvoVrZBiesZ7HRRwHRQ";
// A currently supported model
const MODEL = "gemini-2.5-pro";

app.post("/chat", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Missing 'question'" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: question }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      res.json({ answer: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: "No valid response from Gemini API", details: data });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Gemini proxy is running! Use POST /chat to send questions.");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

