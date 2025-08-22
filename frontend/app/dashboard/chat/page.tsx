'use client';

import { useState, useEffect } from 'react';

export default function MessagingSystem() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);



const getLoggedInUserId = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      //console.log('Token payload:', payload);
      
      // Check if userId exists and return it
      if (payload && payload.userId !== undefined) {
        //console.log('Found userId:', payload.userId);
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
    // Fetch users from your backend API
    const fetchUsers = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch(`http://localhost:5000/auth/getUsers`);
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





const handleSendMessage = async () => {
  if (!newMessage.trim()) return;
  
  try {
    const currentUserId = getLoggedInUserId();
    const selectedUserId = selectedChat;

    if (!currentUserId || !selectedUserId) {
      console.error('User IDs not available');
      return;
    }

    // Send message to backend
    const response = await fetch(`http://localhost:5000/message/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user1: currentUserId.toString(),
        user2: selectedUserId.toString(),
        sender: currentUserId.toString(), // The sender is the current user
        text: newMessage.trim()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const result = await response.json();
    console.log('Message sent:', result);

    // Add the new message to the local state immediately
    const newMsg = {
      id: Date.now(), // Use timestamp for unique ID
      user1_id: parseInt(currentUserId),
      user2_id: parseInt(selectedUserId),
      sender_id: parseInt(currentUserId),
      message_text: newMessage.trim(),
      created_at: new Date().toISOString(),
      isMe: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Fallback: add message locally even if API fails
    const newMsg = {
      id: messages.length + 1,
      senderId: 0,
      senderName: 'You',
      text: newMessage,
      timestamp: 'Just now',
      isMe: true
    };
    
    setMessages([...messages, newMsg]);
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
    
    // Add this check to prevent the error
   
    
    console.log('Current user ID:', currentUserId, 'Selected user ID:', userId);
    
    const response = await fetch(`http://localhost:5000/message/get-convo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUserId.toString(),
        selectedUser: userId.toString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }

    const data = await response.json();
    setMessages(data.data || []);
    
  } catch (error) {
    console.error('Error in handleSelectChat:', error);
    setMessages([]);
  }
};








  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-140px)] flex">
          
          {/* Sidebar - Users List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              </div>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {users
  .filter(user => user.first_name)
  .map((user) => (
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
            <h3 className="font-medium text-gray-900 truncate">
              {user.first_name}{user.id} {/* Removed user.id from display */}
            </h3>
          </div>
        </div>
      </div>
    </div>
  ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                          <img 
                            src={users.find(u => u.id === selectedChat)?.avatar} 
                            alt={users.find(u => u.id === selectedChat)?.first_name} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        {users.find(u => u.id === selectedChat)?.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {users.find(u => u.id === selectedChat)?.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {users.find(u => u.id === selectedChat)?.role}
                          </span>
                          <span className="text-xs text-gray-500">
                            {users.find(u => u.id === selectedChat)?.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
              
                  </div>
                </div>

                {/* Messages Area */}
               {/* Messages Area */}
<div className="flex-1 p-4 overflow-y-auto">
  <div className="space-y-4">
    {messages.map((message) => (
      <div
        key={message.id}
        className={`flex ${message.isMe || message.sender_id === getLoggedInUserId() ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.isMe || message.sender_id === getLoggedInUserId()
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm">
            {message.message_text || message.text} {/* Handle both formats */}
          </p>
          <p className={`text-xs mt-1 ${
            message.isMe || message.sender_id === getLoggedInUserId() 
              ? 'text-blue-100' 
              : 'text-gray-500'
          }`}>
            {message.created_at 
              ? new Date(message.created_at).toLocaleTimeString() 
              : message.timestamp
            }
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      📎
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full pr-12 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100">
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
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose from your contacts to start a conversation
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}