// frontend/app/component/modals/ConfirmationModal.tsx
'use client';
import React from 'react';
import CustomModal from './CustomModal';
import { CheckCircle } from 'lucide-react';
import { Registration } from '../types'; // Import Registration interface

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  confirmationData: Registration['confirmationData'] | null; // Use the specific part of Registration
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, confirmationData }) => {
  const handleDownload = () => {
    if (confirmationData?.downloadContent) {
      const element = document.createElement('a');
      const file = new Blob([confirmationData.downloadContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = confirmationData.downloadFileName || 'registration_confirmation.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Registration Confirmed!">
      <div className="text-center py-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-900 mb-2">
          Thank you for registering!
        </p>
        {confirmationData?.joinLink && (
          <p className="text-gray-700 mb-3">
            Join Link: <a href={confirmationData.joinLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{confirmationData.joinLink}</a>
          </p>
        )}
        {confirmationData?.registrationId && (
          <p className="text-gray-700 mb-3">
            Your Registration ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{confirmationData.registrationId}</span>
          </p>
        )}
        <p className="text-gray-600 mb-4">
          A confirmation email has been sent to your registered email address.
        </p>
        {confirmationData?.downloadContent && (
          <button
            onClick={handleDownload}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
          >
            Download Confirmation
          </button>
        )}
      </div>
    </CustomModal>
  );
};

export default ConfirmationModal;