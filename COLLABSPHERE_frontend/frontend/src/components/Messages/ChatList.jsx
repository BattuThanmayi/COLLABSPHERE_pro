import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import './Messages.css';

function ChatList({ onSelectUser }) {
  const { token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const data = await api.getConversations(token);
      setConversations(data || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="chat-list"><div className="loading">Loading conversations...</div></div>;
  }

  return (
    <div className="chat-list">
      <h3>Messages</h3>
      {conversations.length === 0 ? (
        <div className="empty-state">
          <p>No conversations yet</p>
        </div>
      ) : (
        <div className="conversation-list">
          {conversations.map((conv) => (
            <div
              key={conv._id}
              className="conversation-item"
              onClick={() => onSelectUser(conv._id, conv.name)}
            >
              <div className="conv-avatar">{conv.name?.charAt(0).toUpperCase()}</div>
              <div className="conv-info">
                <h4>{conv.name}</h4>
                <p className="last-message">{conv.lastMessage || 'No messages'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatList;
