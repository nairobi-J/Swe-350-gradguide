// frontend/app/component/events/RegistrationFormPage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import CustomModal from '../modals/CustomModal'; // Adjust import path
import PaymentSimulationModal from '../modals/PaymentSimulationModal'; // Adjust import path
import ConfirmationModal from '../modals/ConfirmationModal'; // Adjust import path
import LoadingSpinner from '../shared/LoadingSpinner';
import { Event, Registration } from '../types';
import axios from 'axios';


interface RegistrationFormPageProps {
  event: Event | null; // Can be null if data is loading
  onFinalizeRegistration: (registration: Registration) => void;
  setMessage: (message: string | null) => void;
  setMessageType: (type: 'success' | 'error' | 'info') => void;
}

const RegistrationFormPage: React.FC<RegistrationFormPageProps> = ({ event, onFinalizeRegistration, setMessage, setMessageType }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState<Registration['confirmationData'] | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  useEffect(() => {
    if (event) {
      const initialData: { [key: string]: string } = {};
      const initialErrors: { [key: string]: string } = {};
      event.registrationFields.forEach(field => {
        initialData[field.name] = '';
        if (field.required) {
          initialErrors[field.name] = 'Required';
        }
      });
      setFormData(initialData);
      setErrors(initialErrors);
    }
  }, [event]);

  if (!event) {
    return <LoadingSpinner />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const field = event.registrationFields.find(f => f.name === name);
    if (field?.required && !value) {
      setErrors(prev => ({ ...prev, [name]: 'Required' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    event.registrationFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'Required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("Please fill in all required fields.", "error");
      setMessageType('error');
      return;
    }

    if (event.isPaid) {
      setIsPaymentModalOpen(true);
    } else {
      
      await finalizeRegistrationProcess(formData, null);
    }
  };

  const finalizeRegistrationProcess = async (data: { [key: string]: string }, paymentDetails: { amount: number; transactionId: string } | null) => {
    setIsLoading(true);
    const registrationId = `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`; // Dummy ID
    await axios.post('http://localhost:5000/regform/submit/?id=33',{
        userId: 1,
        responses: formData
      },
        {headers:{
         "Content-Type": 'application/json',
      }
    })
    const registrationData: Registration = {
      id: registrationId,
      eventId: event.id,
      eventName: event.name,
      userId: 'user-123', // Assuming a logged-in user
      formData: JSON.stringify(data),
      status: event.isPaid ? 'paid' : 'confirmed',
      paymentDetails: paymentDetails,
      registeredAt: new Date(),
      confirmationData: { // Dummy confirmation data
        joinLink: event.location, // Meeting link explicitly provided here
        downloadContent: `
Registration Confirmed for: ${event.name}
Date: ${event.date}
Time: ${event.time}
${event.type === 'online' ? 'Online Link: ' + event.location : 'Location: ' + event.location}
Your Registration ID: ${registrationId}

Submitted Details:
${Object.entries(data).map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}

Thank you for your registration!
`,
        downloadFileName: `registration_${event.name.replace(/\s/g, '_')}_${registrationId}.txt`,
        registrationId: registrationId, // Add registrationId to confirmationData
      }
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    onFinalizeRegistration(registrationData); // Add to dummy registrations
    setConfirmationDetails(registrationData.confirmationData);
    setIsPaymentModalOpen(false);
    setIsConfirmationModalOpen(true);
    setMessage("Registration successful!", 'success');
    setIsLoading(false);

    console.log("Simulating email to:", data.email);
    console.log("Email Content:\n", registrationData.confirmationData.downloadContent);
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    await finalizeRegistrationProcess(formData, { amount: event.price, transactionId: transactionId });
  };

  return (
    <div className="p-6 bg-gray-50 text-black min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Register for: {event.name}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6">
        <p className="text-gray-700 mb-4">Please fill out the details below to register for **{event.name}**.</p>
        {event.registrationFields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors duration-200 ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
          }`}
        >
          {isLoading ? 'Processing...' : event.isPaid ? `Proceed to Pay $${event.price.toFixed(2)}` : 'Confirm Registration'}
        </button>
      </form>

      {event && ( // Render modals only if event exists
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
              onClose={() => setIsConfirmationModalOpen(false)}
              confirmationData={confirmationDetails}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RegistrationFormPage;