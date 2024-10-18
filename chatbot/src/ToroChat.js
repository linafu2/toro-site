import React, { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ToroChat = () => {
  const [messages, setMessages] = useState([{ role: "system", content: "You are Toro, a friendly cat!" }]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessages = [...messages, { role: "user", content: userMessage }];

    setMessages(newMessages);
    setUserMessage('');
    setLoading(true);

    try {
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: newMessages,
      });

      const toroReply = chatCompletion.choices[0].message;
      setMessages([...newMessages, toroReply]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Toro Chatbot</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.role}:</strong> {msg.content}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="talk to toro..."
          required
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
};

export default ToroChat;