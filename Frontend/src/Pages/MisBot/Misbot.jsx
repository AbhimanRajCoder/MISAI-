import React, { useState, useRef, useEffect } from 'react';
import './MisBot.css';
import Navbar from '../Navbar/Navbar';

const MisBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm MisBot, your misinformation detection assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Connect to backend API
      const response = await fetch(`${import.meta.env.VITE_HOST_URL}/misbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage.text,
          conversation_history: messages.map(msg => ({
            text: msg.text,
            sender: msg.sender
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add bot response to chat
      const botResponse = {
        id: messages.length + 2,
        text: data.result || "I'm having trouble processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        factCheck: data.fact_check || null
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm sorry, I couldn't connect to the server. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Navbar />
      <div className="misbot-container">
        <div className="chat-header">
          <h1>MisBot</h1>
          <p className="description">Your AI assistant for detecting and understanding misinformation</p>
        </div>
        
        <div className="chat-interface">
          <div className="messages-container">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  {message.factCheck && (
                    <div className="fact-check-result">
                      <h4>Fact Check:</h4>
                      <p className={`verification-status ${message.factCheck.verified ? 'verified' : 'unverified'}`}>
                        {message.factCheck.verified ? 'Verified Information' : 'Potential Misinformation Detected'}
                      </p>
                      {message.factCheck.confidence && (
                        <div className="confidence-meter">
                          <span>Confidence:</span>
                          <div className="meter-bar">
                            <div 
                              className="meter-fill" 
                              style={{ width: `${message.factCheck.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span>{Math.round(message.factCheck.confidence * 100)}%</span>
                        </div>
                      )}
                      {message.factCheck.sources && message.factCheck.sources.length > 0 && (
                        <div className="sources">
                          <h4>Sources:</h4>
                          <ul>
                            {message.factCheck.sources.map((source, index) => (
                              <li key={index}>
                                <a href={source.url} target="_blank" rel="noopener noreferrer">
                                  {source.title || source.url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="message-time">{formatTimestamp(message.timestamp)}</span>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message loading-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={sendMessage} className="message-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              disabled={isLoading}
              className="message-input"
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputMessage.trim()} 
              className="send-button"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MisBot;