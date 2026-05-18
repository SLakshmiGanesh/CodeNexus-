require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function fallbackReply(message) {
  return [
    "I can help with this, but the Anthropic API key is not configured on the backend yet.",
    "",
    `Your prompt was: ${message}`,
    "",
    "Set ANTHROPIC_API_KEY in the backend environment to enable live AI tutoring.",
  ].join("\n");
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/chat", async (req, res) => {
  const { system, messages, max_tokens: maxTokens = 1000 } = req.body || {};
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.json({
      content: [{ type: "text", text: fallbackReply(messages?.[0]?.content || "") }],
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        system,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Anthropic API request failed",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Backend request failed" });
  }
});

app.listen(port, () => {
  console.log(`CP-Mentor backend listening on http://localhost:${port}`);
});
