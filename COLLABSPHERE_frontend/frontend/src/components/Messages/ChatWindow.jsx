import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import './Messages.css';

function ChatWindow({ selectedUserId, selectedUserName, onBack }) {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages();
      // Poll for new messages every 2 seconds
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId]);

  const fetchMessages = async () => {
    try {
      const data = await api.getMessages(selectedUserId, token);
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const data = await api.sendMessage(selectedUserId, newMessage, token);
      if (!data.error) {
        setMessages([...messages, data]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h3>{selectedUserName}</h3>
      </div>

      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`message ${
                msg.from === user?.id || msg.from?._id === user?.id ? 'sent' : 'received'
              }`}
            >
              <p>{msg.text}</p>
              <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
