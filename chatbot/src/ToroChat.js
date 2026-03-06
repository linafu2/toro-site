import React, { useState } from 'react';

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
      // send the new messages to this backend
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const toroReply = { role: 'assistant', content: data.reply };
      setMessages([...newMessages, toroReply]);
    } catch (error) {
      console.error('Error:', error);
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