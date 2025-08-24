'use client';

import { useState, useEffect, useRef } from 'react';

export default function MessagingSystem() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const userListRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL;

  const getLoggedInUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.userId !== undefined) {
          return payload.userId;
        } else {
          console.warn('userId not found in payload');
          return null;
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    console.warn('No token found in localStorage');
    return null;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/auth/getUsers`);
        const userData = await response.json();
        setUsers(userData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const currentUserId = getLoggedInUserId();
      const selectedUserId = selectedChat;

      if (!currentUserId || !selectedUserId) {
        return;
      }

      const response = await fetch(`${BACKEND_URL}/message/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user1: currentUserId.toString(),
          user2: selectedUserId.toString(),
          sender: currentUserId.toString(),
          text: newMessage.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      const newMsg = {
        id: Date.now(),
        user1_id: parseInt(currentUserId),
        user2_id: parseInt(selectedUserId),
        sender_id: parseInt(currentUserId),
        message_text: newMessage.trim(),
        created_at: new Date().toISOString(),
        isMe: true,
      };

      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');
    } catch (error) {
      const newMsg = {
        id: messages.length + 1,
        senderId: 0,
        senderName: 'You',
        text: newMessage,
        timestamp: 'Just now',
        isMe: true,
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectChat = async (userId) => {
    setSelectedChat(userId);
    try {
      const currentUserId = getLoggedInUserId();
      if (!currentUserId) {
        return;
      }

      const response = await fetch(`${BACKEND_URL}/message/get-convo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId.toString(),
          selectedUser: userId.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }

      const data = await response.json();
      setMessages(data.data || []);
    } catch (error) {
      setMessages([]);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-20px)] w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-90px)] w-full bg-gray-50 overflow-hidden">
      <div className="flex w-full h-full bg-white rounded-lg shadow-xl">
        {/* Sidebar - Users List */}
        <div className="flex w-1/3 flex-col border-r border-gray-200 h-full">
          {/* Header for Users */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
          {/* User List - Scrollable */}
          <div className="flex-1 overflow-y-auto" ref={userListRef}>
            <div className="p-2 hidden-scrollbar">
              {users.filter(user => user.first_name).map((user) => (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 mb-1 ${
                    selectedChat === user.id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                  onClick={() => handleSelectChat(user.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{user.first_name}_{user.id}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {selectedChat ? (
            <>
              {/* Chat Header - Fixed */}
              <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    
                    {/* {users.find((u) => u.id === selectedChat)?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )} */}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {users.find((u) => u.id === selectedChat)?.first_name}_ {users.find((u) => u.id === selectedChat)?.id}
                    </h3>
                    <div className="flex items-center space-x-2">
                    
                      <span className="text-xs text-gray-500">
                        {users.find((u) => u.id === selectedChat)?.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area - Scrollable */}
              <div 
                className="flex-1 p-4 overflow-y-auto scroll-smooth scrollbar-hide"
                ref={messagesContainerRef}
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isMe || message.sender_id === getLoggedInUserId() ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isMe || message.sender_id === getLoggedInUserId()
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message_text || message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isMe || message.sender_id === getLoggedInUserId() ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {message.created_at
                            ? new Date(message.created_at).toLocaleTimeString()
                            : message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input - Fixed */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100">📎</button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pr-12 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100">
                      🙂
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ➤
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose from your contacts to start a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}