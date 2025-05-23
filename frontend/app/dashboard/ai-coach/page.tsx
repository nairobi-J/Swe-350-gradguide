
'use client';

import { Bot, Send } from 'lucide-react';
import { useState } from 'react';

export default function AiCoachPage() {
  const [message, setMessage] = useState('');
  
  const suggestedPrompts = [
    "What skills should I develop?",
    "Help me write a resume",
    "Find entry-level jobs in tech",
    "Compare different career paths",
    "Recommend study programs"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI Career Coach</h1>
            <p className="text-gray-600 mt-1">Get personalized career guidance and advice from our AI assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-6 space-y-4">
          {/* AI Message */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-lg rounded-tl-none p-4 max-w-[80%]">
              <p className="text-gray-800">
                Hello! Im your AI Career Coach. I can help you with career planning, resume writing, job search strategies, and more. What would you like to discuss today?
              </p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          {/* Suggested Prompts */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setMessage(prompt)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button title='d' className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}