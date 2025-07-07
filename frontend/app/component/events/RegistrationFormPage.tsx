'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PaymentSimulationModal from '../modals/PaymentSimulationModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Event, Registration } from '../types';
import axios from 'axios';

interface RegistrationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onFinalizeRegistration: (registration: Registration) => void;
  setMessage: (message: string | null) => void;
  setMessageType: (type: 'success' | 'error' | 'info') => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onFinalizeRegistration,
  setMessage,
  setMessageType
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState<Registration['confirmationData'] | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  useEffect(() => {
    if (event && isOpen) {
      const initialData: Record<string, string> = {};
      const initialErrors: Record<string, string> = {};
      
      event.registrationFields.forEach(field => {
        initialData[field.name] = '';
        if (field.required) {
          initialErrors[field.name] = '';
        }
      });
      
      setFormData(initialData);
      setErrors(initialErrors);
    }
  }, [event, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const field = event?.registrationFields.find(f => f.name === name);
    if (field?.required) {
      setErrors(prev => ({
        ...prev,
        [name]: value.trim() ? '' : 'This field is required'
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!event) return false;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    event.registrationFields.forEach(field => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = 'This field is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage("Please fill in all required fields");
      setMessageType('error');
      return;
    }

    if (event?.isPaid) {
      setIsPaymentModalOpen(true);
    } else {
      await finalizeRegistrationProcess(formData, null);
    }
  };

  const finalizeRegistrationProcess = async (
    data: Record<string, string>,
    paymentDetails: { amount: number; transactionId: string } | null
  ) => {
    if (!event) return;

    setIsLoading(true);
    
    try {
      await axios.post('http://localhost:5000/regform/submit/?id=33', {
        userId: 1,
        responses: data
      }, {
        headers: { "Content-Type": 'application/json' }
      });

      const registrationId = `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const registrationData: Registration = {
        id: registrationId,
        eventId: event.id,
        eventName: event.name,
        userId: 'user-123',
        formData: JSON.stringify(data),
        status: event.isPaid ? 'paid' : 'confirmed',
        paymentDetails: paymentDetails,
        registeredAt: new Date(),
        confirmationData: {
          joinLink: event.location,
          downloadContent: `
Registration Confirmed for: ${event.name}
Date: ${event.date}
Time: ${event.time}
${event.type === 'online' ? 'Online Link: ' + event.location : 'Location: ' + event.location}
Your Registration ID: ${registrationId}

Submitted Details:
${Object.entries(data).map(([key, value]) => 
  `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`
).join('\n')}

Thank you for your registration!
`,
          downloadFileName: `registration_${event.name.replace(/\s/g, '_')}_${registrationId}.txt`,
          registrationId: registrationId,
        }
      };

      onFinalizeRegistration(registrationData);
      setConfirmationDetails(registrationData.confirmationData);
      setIsConfirmationModalOpen(true);
      setMessage("Registration successful!");
      setMessageType('success');
      
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      setMessageType('error');
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
      setIsPaymentModalOpen(false);
    }
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    if (!event) return;
    await finalizeRegistrationProcess(formData, { 
      amount: event.price, 
      transactionId: transactionId 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Register for {event?.name}
            </h2>
            <p className="text-gray-600 mt-1">
              Please fill out the registration form
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {event?.registrationFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors[field.name] ? 'border-red-500' : ''
                    }`}
                    rows={3}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors[field.name] ? 'border-red-500' : ''
                    }`}
                  />
                )}
                {errors[field.name] && (
                  <p className="text-sm text-red-500">{errors[field.name]}</p>
                )}
              </div>
            ))}
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 
                 event?.isPaid ? `Pay $${event.price.toFixed(2)}` : 'Confirm Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {event && (
        <>
          <PaymentSimulationModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            event={event}
            onPaymentSuccess={handlePaymentSuccess}
          />
          {confirmationDetails && (
            <ConfirmationModal
              isOpen={isConfirmationModalOpen}
              onClose={() => {
                setIsConfirmationModalOpen(false);
                onClose();
              }}
              confirmationData={confirmationDetails}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RegistrationModal;