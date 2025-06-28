// frontend/app/component/modals/PaymentSimulationModal.tsx
'use client';
import React, { useState } from 'react';
import CustomModal from './CustomModal'; // Assuming CustomModal is in the same folder
import { Event } from '../types';

interface PaymentSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onPaymentSuccess: (transactionId: string) => Promise<void>; // Make it async
}

const PaymentSimulationModal: React.FC<PaymentSimulationModalProps> = ({ isOpen, onClose, event, onPaymentSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const simulatePayment = async () => { // Make this function async
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate async payment
    const transactionId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    await onPaymentSuccess(transactionId); // Call the async success handler
    onClose();
    setIsLoading(false);
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={`Simulate Payment for ${event.name}`}>
      <div className="text-center p-4">
        <p className="text-lg text-gray-800 mb-4">
          You are about to pay <span className="font-bold">${event.price.toFixed(2)}</span> for {event.name}.
        </p>
        <p className="text-gray-600 mb-6">
          This is a simulation of a payment gateway. In a real application, you would be redirected.
        </p>
        <button
          onClick={simulatePayment}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors duration-200 ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-lg'
          }`}
        >
          {isLoading ? 'Processing Payment...' : `Simulate Pay $${event.price.toFixed(2)}`}
        </button>
      </div>
    </CustomModal>
  );
};

export default PaymentSimulationModal;