// frontend/app/component/events/RegistrationFormPage.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
// Removed: PaymentSimulationModal import
// Removed: ConfirmationModal import
import { Event, RegistrationField } from '../types'; // Removed Registration import as not needed for simplified functions
import axios from 'axios';

// Removed: Registration and related interfaces/types not strictly needed for basic rendering logic here.

interface RegistrationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  // Removed onFinalizeRegistration, setMessage, setMessageType as they are part of the removed complex logic
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  // Removed onFinalizeRegistration, setMessage, setMessageType from destructuring
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFieldsLoading, setIsFieldsLoading] = useState(true);
  const [fetchedRegistrationFields, setFetchedRegistrationFields] = useState<RegistrationField[] | null>(null);

  // useEffect to fetch registration fields (remains the same)
  useEffect(() => {
    if (event?.id && isOpen) {
      setIsFieldsLoading(true);
      //console.log(event);
      axios.get(`http://localhost:5000/event/registration?event_id=${event.id}`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setFetchedRegistrationFields(response.data);
            console.log(response.data);
          } else {
            console.error("Backend returned non-array for registration fields:", response.data);
            setFetchedRegistrationFields([]); // Set to empty array to prevent map error
          }
          setIsFieldsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching registration fields:", error);
          setIsFieldsLoading(false);
          // For now, no message display, just console log.
        });
    } else if (!isOpen) {
      setFetchedRegistrationFields(null);
      setIsFieldsLoading(true);
    }
  }, [event?.id, isOpen]);

  // useEffect for initial form data (remains the same, but simplified)
  useEffect(() => {
    if (event && isOpen && fetchedRegistrationFields) {
      const initialData: Record<string, string> = {};
      fetchedRegistrationFields.forEach(field => {
        initialData[field.name] = '';
      });
      setFormData(initialData);
      setErrors({}); // Clear errors
    }
  }, [event, isOpen, fetchedRegistrationFields]);

  // handleChange function (remains the same, but simplified error handling)
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Removed complex error state update for simplicity
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, [setFormData, setErrors]);

  // Simplified handleSubmit and validation (just for basic rendering)
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted locally with data:", formData);
    // No backend call, no payment, no confirmation for now.
    onClose(); // Just close the modal on submit for now.
  }, [formData, onClose]);


  if (!isOpen) return null;

  // Show loading state
  if (isFieldsLoading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-gray-700 flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading form fields...
          </div>
        </div>
      </div>
    );
  }

  // Handle case where fields failed to load or no fields are defined
  // This will also catch if fetchedRegistrationFields is null or empty array.
  if (!event || !Array.isArray(fetchedRegistrationFields) || fetchedRegistrationFields.length === 0) {
    console.log("No registration fields found for event or invalid format:", fetchedRegistrationFields);
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-red-700 flex flex-col items-center">
            <X className="h-8 w-8 mb-3" />
            <p>No custom registration fields defined for this event, or data is invalid.</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg">Close</button>
          </div>
        </div>
      </div>
    );
  }

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
              Register for {event.name}
            </h2>
            <p className="text-gray-600 mt-1">
              Please fill out the registration form
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* --- THIS IS WHERE INPUTS ARE MAPPED AND RENDERED --- */}
            {fetchedRegistrationFields.map((field) => (
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
                {/* Simplified error message display */}
                {errors[field.name] && (
                  <p className="text-sm text-red-500">{errors[field.name]}</p>
                )}
              </div>
            ))}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Confirm Registration
              </button>
            </div>
          </form>
        </div>
      </div>

      
    </div>
  );
};

export default RegistrationModal;