'use client';
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface MessageCardProps {
  message: string | null;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  autoDismiss?: boolean;
  dismissTimeout?: number;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  type,
  onClose,
  autoDismiss = true,
  dismissTimeout = 3000,
}) => {
  useEffect(() => {
    if (autoDismiss && message) {
      const timer = setTimeout(() => {
        onClose();
      }, dismissTimeout);
      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss, dismissTimeout, onClose]);

  if (!message) return null;

  const variantStyles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 min-w-[300px] max-w-[90vw] p-4 rounded-lg shadow-md border-l-4 ${variantStyles[type]} z-[1000] animate-fade-in transition-opacity duration-300`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-sm leading-snug">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-current hover:opacity-70 transition-opacity"
          aria-label="Close message"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageCard;