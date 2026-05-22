import React, { useState } from 'react';
import ChatList from '../components/Messages/ChatList';
import ChatWindow from '../components/Messages/ChatWindow';
import '../components/Messages/Messages.css';
import './Pages-Updated.css';

function MessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [showChatList, setShowChatList] = useState(true);

  const handleSelectUser = (userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setShowChatList(false);
  };

  const handleBack = () => {
    setSelectedUserId(null);
    setSelectedUserName(null);
    setShowChatList(true);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">💬 Messages</h1>
        <p className="page-subtitle">Chat with your team members</p>
      </div>
      <div className="messages-container">
        <div className={`chat-list ${showChatList ? 'active' : ''}`}>
          <ChatList onSelectUser={handleSelectUser} />
        </div>
        {selectedUserId && (
          <ChatWindow
            selectedUserId={selectedUserId}
            selectedUserName={selectedUserName}
            onBack={handleBack}
          />
        )}
        {!selectedUserId && !showChatList && (
          <div className="chat-window" style={{ display: 'none' }} />
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
