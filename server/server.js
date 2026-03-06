const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 5001;

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to parse JSON
app.use(express.json());

// enable CORS so the React app on port 3000 can talk to this server
const cors = require('cors');
app.use(cors());

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Toro Chatbot Server!');
});

// Chatbot Route
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    // If the error is a quota / rate-limit issue, return a friendly dev fallback
    const code = error && (error.code || (error.error && error.error.code));
    const type = error && (error.type || (error.error && error.error.type));
    const status = error && error.status;

    if (status === 429 || code === 'insufficient_quota' || type === 'insufficient_quota') {
      return res.json({ reply: "Toro is busy right now (dev fallback). I'll be back when API quota is available." });
    }

    res.status(500).send('Error generating chat completion');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
