import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [chatWithName, setChatWithName] = useState('Chatting with...');
  const [onlineStatus, setOnlineStatus] = useState({ status: 'offline', text: 'Offline' });
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserDisplayName, setCurrentUserDisplayName] = useState('Student');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesAreaRef = useRef(null);
  const messageInputRef = useRef(null);
  
  // Mock data for demonstration
  const mentorUidFromStorage = 'mentor123';
  const mentorNameFromStorage = 'Dr. Smith';
  
  useEffect(() => {
    // Initialize chat - replace with your Firebase authentication logic
    const initializeAuth = () => {
      // Mock authentication
      setCurrentUserId('student123');
      setCurrentUserDisplayName('John Doe');
      setChatWithName(`Chatting with ${mentorNameFromStorage}`);
      
      // Mock online status
      setOnlineStatus({ status: 'online', text: 'Online' });
      
      // Load mock messages
      loadMockMessages();
    };
    
    initializeAuth();
    
    // Focus input
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, []);
  
  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const loadMockMessages = () => {
    const mockMessages = [
      {
        id: '1',
        text: 'Hello! How can I help you today?',
        senderUID: 'mentor123',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      },
      {
        id: '2',
        text: 'Hi! I have a question about the upcoming project.',
        senderUID: 'student123',
        timestamp: new Date(Date.now() - 240000), // 4 minutes ago
      },
      {
        id: '3',
        text: 'Sure! What would you like to know?',
        senderUID: 'mentor123',
        timestamp: new Date(Date.now() - 180000), // 3 minutes ago
      }
    ];
    setMessages(mockMessages);
  };
  
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const text = messageInput.trim();
    if (!text || !currentUserId) return;
    
    setIsLoading(true);
    
    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      text: text,
      senderUID: currentUserId,
      timestamp: new Date(),
    };
    
    // Add message to state
    setMessages(prev => [...prev, newMessage]);
    
    // Clear input
    setMessageInput('');
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
    }
    
    // Simulate typing indicator for response
    setTimeout(() => {
      setIsTyping(true);
    }, 500);
    
    // Simulate mentor response
    setTimeout(() => {
      setIsTyping(false);
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        text: `Thanks for your message: "${text}". How else can I help you?`,
        senderUID: 'mentor123',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
    
    setIsLoading(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleBackClick = () => {
    // Navigate back - replace with your routing logic
    window.history.back();
  };
  
  const displayMessage = (message) => {
    const isSentByCurrentUser = message.senderUID === currentUserId;
    const senderDisplayName = isSentByCurrentUser ? "You" : mentorNameFromStorage;
    
    let timeString = 'sending...';
    if (message.timestamp) {
      timeString = message.timestamp.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return (
      <div 
        key={message.id} 
        className={`message ${isSentByCurrentUser ? 'sent' : 'received'}`}
      >
        <p className="msg-text">{message.text}</p>
        <span className="msg-meta">
          {senderDisplayName} - {timeString}
        </span>
      </div>
    );
  };
  
  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <header className="chat-header">
          <button onClick={handleBackClick} className="back-btn">
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back</span>
          </button>
          <h2>{chatWithName}</h2>
          <div className={`status-indicator ${onlineStatus.status}`}>
            <span>{onlineStatus.text}</span>
          </div>
        </header>
        
        <div className="messages-area" ref={messagesAreaRef}>
          {messages.map(message => displayMessage(message))}
          
          {isTyping && (
            <div className="typing-indicator">
              <span>Typing</span>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
        
        <div className="message-input-area">
          <textarea
            ref={messageInputRef}
            value={messageInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="message-input"
            id="messageInput"
            rows="1"
            required
          />
          <button 
            type="button"
            onClick={handleSubmit}
            className="send-btn"
            disabled={isLoading || !messageInput.trim()}
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-paper-plane"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;