// E:\projects\GradGuide\frontend\app\component\CustomModal.tsx
'use client'; // This modal likely requires client-side interactivity (state for isOpen, button clicks)

import React from 'react';
import { XCircle } from 'lucide-react'; // Assuming you have lucide-react installed for the icon

// Define props for better type checking (optional but recommended for TypeScript)
interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // React.ReactNode allows any valid React child (elements, strings, etc.)
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h3>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close modal" // Add accessibility for button
        >
          {/* Ensure XCircle is imported or replaced with another icon/text */}
          <XCircle className="h-6 w-6" />
        </button>
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;