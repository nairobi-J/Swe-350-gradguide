// frontend/app/component/shared/MessageCard.tsx
'use client';
import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface MessageCardProps {
  message: string | null;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-blue-100 border-blue-400 text-blue-700';
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : Info;

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg border-l-4 ${bgColor} z-[100]`}>
      <div className="flex items-center">
        <Icon className="h-6 w-6 mr-3" />
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-auto text-current hover:opacity-80">
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageCard;