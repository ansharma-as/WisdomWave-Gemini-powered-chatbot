import React, { useState } from 'react';
import axios from 'axios';
import { FiSend } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const ChatComponent = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { role: 'user', text: userMessage };

    setLoading(true);
    try {
        const response = await axios.post('https://wisdomwave-student-chatbot.vercel.app/api/chat', {
          userMessage,
        });

        const botResponse = {
            role: 'StudyBot',
            text: response.data.response,
            aiResponse: response.data.aiResponse,
        };

        setChatHistory((prevHistory) => [...prevHistory, newMessage, botResponse]);
    } catch (error) {
        console.error('Error sending message:', error);
    } finally {
        setLoading(false);
        setUserMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white p-6">
      {/* Sidebar for Chat History */}
      <div className="hidden lg:block w-full lg:w-1/4 bg-gray-800 rounded-lg shadow-lg p-4 mr-0 lg:mr-4 mb-4 lg:mb-0 overflow-y-auto transition-all duration-300 ease-in-out">
        <h2 className="text-xl bg-blue-500 rounded-full p-4 font-semibold mb-4">Chat History</h2>
        {chatHistory.map((message, index) => (
          <div key={index} className={`mb-2 bg-gray-600 p-2 rounded-2xl ${message.role === 'user' ? 'text-right' : 'text-left'} ${message.role === 'user' ? 'text-blue-400' : 'text-gray-300'}`}>
            <p>
              {message.role === 'user' ? 'You: ' : 'StudyBot: '}
              {message.text}
            </p>
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col">
        {/* Header */}
        <div className="w-full mb-4 flex items-center justify-center lg:justify-start">
          <FaRobot className="text-3xl text-blue-500 mr-2" />
          <h1 className="text-2xl font-semibold text-center">Hello, How can I help you today?</h1>
        </div>

        {/* Response Area */}
        <div className="flex-1 w-full overflow-y-auto mb-4">
          {chatHistory.map((message, index) => (
            <div key={index} className={`mb-4 flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-200'} `}>
                <p>{message.text}</p>
                {message.aiResponse && (
                  <div className="mt-2 text-sm text-gray-300">
                    <ReactMarkdown>{message.aiResponse}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex items-center w-full mt-auto bg-gray-800 p-4 rounded-lg shadow-lg">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 p-3 border border-gray-700 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="ml-4 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
          >
            <FiSend className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
