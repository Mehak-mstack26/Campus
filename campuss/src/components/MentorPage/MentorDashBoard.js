import React, { useState, useEffect, useCallback } from 'react';

const MentorDashboard = () => {
  // State management
  const [currentMentor, setCurrentMentor] = useState(null);
  const [activeChatRoomId, setActiveChatRoomId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockMentor = {
    uid: 'mentor123',
    displayName: 'Dr. Sarah Johnson',
    photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b381f46d?w=150&h=150&fit=crop&crop=face',
    role: 'mentor'
  };

  const mockConversations = [
    {
      id: 'chat1',
      studentName: 'Alex Chen',
      lastMessage: 'Thank you for the guidance on my project!',
      timestamp: new Date(Date.now() - 3600000),
      studentUID: 'student1'
    },
    {
      id: 'chat2',
      studentName: 'Maria Garcia',
      lastMessage: 'Could you help me with my career planning?',
      timestamp: new Date(Date.now() - 7200000),
      studentUID: 'student2'
    },
    {
      id: 'chat3',
      studentName: 'James Wilson',
      lastMessage: 'I have questions about the internship program',
      timestamp: new Date(Date.now() - 10800000),
      studentUID: 'student3'
    }
  ];

  const mockMessages = {
    chat1: [
      { id: 1, senderUID: 'student1', text: 'Hi! I need help with my final project', timestamp: new Date(Date.now() - 7200000) },
      { id: 2, senderUID: 'mentor123', text: 'Hello Alex! I\'d be happy to help. What specific area are you struggling with?', timestamp: new Date(Date.now() - 7100000) },
      { id: 3, senderUID: 'student1', text: 'I\'m having trouble with the data analysis part', timestamp: new Date(Date.now() - 7000000) },
      { id: 4, senderUID: 'mentor123', text: 'Data analysis can be tricky. Let\'s start with understanding your dataset. What type of data are you working with?', timestamp: new Date(Date.now() - 6900000) },
      { id: 5, senderUID: 'student1', text: 'Thank you for the guidance on my project!', timestamp: new Date(Date.now() - 3600000) }
    ],
    chat2: [
      { id: 1, senderUID: 'student2', text: 'Hello Dr. Johnson! I hope you\'re doing well', timestamp: new Date(Date.now() - 8000000) },
      { id: 2, senderUID: 'mentor123', text: 'Hi Maria! I\'m doing great, thank you for asking. How can I help you today?', timestamp: new Date(Date.now() - 7900000) },
      { id: 3, senderUID: 'student2', text: 'Could you help me with my career planning?', timestamp: new Date(Date.now() - 7200000) }
    ],
    chat3: [
      { id: 1, senderUID: 'student3', text: 'Good morning!', timestamp: new Date(Date.now() - 11000000) },
      { id: 2, senderUID: 'mentor123', text: 'Good morning James! How are your studies going?', timestamp: new Date(Date.now() - 10900000) },
      { id: 3, senderUID: 'student3', text: 'I have questions about the internship program', timestamp: new Date(Date.now() - 10800000) }
    ]
  };

  // Initialize mentor data
  useEffect(() => {
    const initializeMentor = async () => {
      try {
        // Simulate authentication check
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        
        setCurrentMentor(mockMentor);
        setConversations(mockConversations);
        setIsOnline(true);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing mentor:', error);
        setLoading(false);
      }
    };

    initializeMentor();
  }, []);

  // Handle conversation selection
  const selectConversation = useCallback((chatId, studentName) => {
    setActiveChatRoomId(chatId);
    setSelectedStudentName(studentName);
    setMessages(mockMessages[chatId] || []);
  }, []);

  // Handle sending messages
  const sendMessage = useCallback(async () => {
    if (!messageInput.trim() || !activeChatRoomId || !currentMentor) return;

    const newMessage = {
      id: Date.now(),
      senderUID: currentMentor.uid,
      text: messageInput.trim(),
      timestamp: new Date()
    };

    // Add message to current messages
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation list with latest message
    setConversations(prev => prev.map(conv => 
      conv.id === activeChatRoomId 
        ? { ...conv, lastMessage: messageInput.trim(), timestamp: new Date() }
        : conv
    ));

    setMessageInput('');
  }, [messageInput, activeChatRoomId, currentMentor]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      setIsOnline(false);
      setCurrentMentor(null);
      // In real app, redirect to login page
      console.log('Mentor logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  // Message component
  const Message = ({ message, isOwn }) => (
    <div className={`message ${isOwn ? 'sent' : 'received'}`}>
      <p style={{ margin: '0 0 5px 0' }}>{message.text}</p>
      <span className="message-time">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh"
    }}>
      <div className="container" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Navigation Sidebar */}
        <nav style={{
          width: '250px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1000
        }}>
          <ul style={{ listStyle: 'none', padding: '20px 0' }}>
            <li>
              <a href="#" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 25px',
                textDecoration: 'none',
                color: '#667eea',
                fontSize: '1.4em',
                fontWeight: 'bold',
                borderBottom: '2px solid #f0f0f0',
                marginBottom: '10px'
              }}>
                <span>Mentor Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 25px',
                textDecoration: 'none',
                color: '#333',
                transition: 'all 0.3s ease'
              }}>
                <i className="fas fa-home" style={{ fontSize: '1.2em', marginRight: '15px', width: '20px', textAlign: 'center' }}></i>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 25px',
                textDecoration: 'none',
                color: '#333',
                transition: 'all 0.3s ease'
              }}>
                <i className="fas fa-user" style={{ fontSize: '1.2em', marginRight: '15px', width: '20px', textAlign: 'center' }}></i>
                <span>My Profile</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleLogout} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 25px',
                textDecoration: 'none',
                color: '#e74c3c',
                transition: 'all 0.3s ease',
                marginTop: 'auto'
              }}>
                <i className="fas fa-sign-out-alt" style={{ fontSize: '1.2em', marginRight: '15px', width: '20px', textAlign: 'center' }}></i>
                <span>Log out</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <section style={{
          marginLeft: '250px',
          padding: '30px',
          flex: 1,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px'
          }}>
            <h1 style={{
              color: '#333',
              fontSize: '2.2em',
              fontWeight: '600',
              margin: 0
            }}>
              Hello {currentMentor?.displayName || 'Mentor'}, Welcome Back!
            </h1>
            <img 
              src={currentMentor?.photoURL || 'images/mehak.png'} 
              alt="Mentor"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #667eea',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
            />
          </div>

          <h3 style={{
            color: 'white',
            fontSize: '1.5em',
            marginBottom: '20px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Your Dashboard
          </h3>

          {/* Dashboard Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '25px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '25px',
              borderRadius: '15px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '1.3em', textShadow: 'none' }}>
                <i className="fas fa-circle" style={{ color: isOnline ? '#28a745' : '#6c757d', marginRight: '10px' }}></i>
                Online Status
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '10px' }}>
                You are currently: <span style={{ fontWeight: 'bold', color: isOnline ? 'green' : 'red' }}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </p>
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '10px' }}>
                <small>Your chat availability is updated automatically.</small>
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '25px',
              borderRadius: '15px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '1.3em', textShadow: 'none' }}>
                <i className="fas fa-video" style={{ color: '#667eea', marginRight: '10px' }}></i>
                Video Meetings
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '10px' }}>
                Join scheduled video interactions with students.
              </p>
              <button style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}>
                <i className="fas fa-external-link-alt" style={{ marginRight: '8px' }}></i>
                Open Video Meet
              </button>
            </div>
          </div>

          {/* Chat Interface */}
          <section style={{
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '1.8em' }}>
              <i className="fas fa-comments" style={{ color: '#667eea', marginRight: '15px' }}></i>
              Student Chats
            </h2>
            
            <div style={{
              display: 'flex',
              minHeight: '60vh',
              maxHeight: '70vh',
              border: '1px solid #ddd',
              backgroundColor: '#f9f9f9',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Conversations List */}
              <div style={{
                width: '30%',
                borderRight: '1px solid #ddd',
                overflowY: 'auto',
                padding: '0',
                backgroundColor: '#fff'
              }}>
                {conversations.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#777', padding: '30px 20px' }}>
                    No active chats yet.
                  </p>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`conversation-item ${activeChatRoomId === conv.id ? 'active' : ''}`}
                      style={{
                        padding: '15px',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        backgroundColor: activeChatRoomId === conv.id ? '#e6f2ff' : 'transparent',
                        borderLeft: activeChatRoomId === conv.id ? '4px solid #667eea' : 'none'
                      }}
                      onClick={() => selectConversation(conv.id, conv.studentName)}
                      onMouseEnter={(e) => {
                        if (activeChatRoomId !== conv.id) {
                          e.target.style.backgroundColor = '#f5f5f5';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeChatRoomId !== conv.id) {
                          e.target.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <strong style={{ display: 'block', marginBottom: '5px', color: '#333', fontSize: '0.95em' }}>
                        <i className="fas fa-user-circle" style={{ marginRight: '8px', color: '#667eea' }}></i>
                        {conv.studentName}
                      </strong>
                      <small style={{ color: '#666', fontSize: '0.8em', paddingLeft: '20px' }}>
                        {conv.lastMessage.length > 35 ? conv.lastMessage.substring(0, 35) + '...' : conv.lastMessage}
                      </small>
                    </div>
                  ))
                )}
              </div>

              {/* Active Chat Area */}
              <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
                {/* Chat Header */}
                <div style={{
                  padding: '15px',
                  borderBottom: '1px solid #ddd',
                  background: '#f8f9fa',
                  fontWeight: 'bold',
                  color: '#333',
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="fas fa-user-circle" style={{ marginRight: '10px', color: '#667eea' }}></i>
                  {activeChatRoomId ? `Chatting with ${selectedStudentName}` : 'Select a conversation to start chatting'}
                </div>

                {/* Messages Area */}
                <div style={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(45deg, #f0f2f5, #e9ecef)'
                }}>
                  {messages.map((message) => (
                    <Message 
                      key={message.id} 
                      message={message} 
                      isOwn={message.senderUID === currentMentor?.uid}
                    />
                  ))}
                </div>

                {/* Message Input */}
                {activeChatRoomId && (
                  <div style={{
                    padding: '15px',
                    borderTop: '1px solid #ddd',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type your reply..."
                      style={{
                        flexGrow: 1,
                        padding: '12px 18px',
                        borderRadius: '25px',
                        border: '1px solid #ddd',
                        fontSize: '0.95em',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      <i className="fas fa-paper-plane" style={{ marginRight: '5px' }}></i>
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </section>
      </div>

      <style jsx>{`
        .message {
          margin-bottom: 12px;
          padding: 10px 15px;
          border-radius: 18px;
          max-width: 75%;
          word-break: break-word;
          line-height: 1.4;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.sent {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          margin-left: auto;
          border-bottom-right-radius: 5px;
        }

        .message.received {
          background: white;
          color: #333;
          margin-right: auto;
          border: 1px solid #e0e0e0;
          border-bottom-left-radius: 5px;
        }

        .message-time {
          font-size: 0.7em;
          opacity: 0.7;
          display: block;
          margin-top: 5px;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8, #6a4190);
        }
      `}</style>
    </div>
  );
};

export default MentorDashboard;