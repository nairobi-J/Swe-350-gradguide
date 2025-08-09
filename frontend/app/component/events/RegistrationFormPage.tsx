// frontend/app/component/events/RegistrationFormPage.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Event, RegistrationField } from '../types'; // Only Event and RegistrationField needed
import axios from 'axios';
const AZURE_BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL;
interface RegistrationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  // Removed: onFinalizeRegistration, setMessage, setMessageType
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  // Removed: onFinalizeRegistration, setMessage, setMessageType from destructuring
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFieldsLoading, setIsFieldsLoading] = useState(true);
  const [fetchedRegistrationFields, setFetchedRegistrationFields] = useState<RegistrationField[] | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For submit button loading state

  // useEffect to fetch registration fields
  useEffect(() => {
    if (event?.id && isOpen) {
      setIsFieldsLoading(true);
      axios.get(`${AZURE_BACKEND_URL}/event/registration?event_id=${event.id}`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setFetchedRegistrationFields(response.data);
          } else {
            console.error("Backend returned non-array for registration fields:", response.data);
            setFetchedRegistrationFields([]);
          }
          setIsFieldsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching registration fields:", error);
          setIsFieldsLoading(false);
        });
    } else if (!isOpen) {
      setFetchedRegistrationFields(null);
      setIsFieldsLoading(true);
    }
  }, [event?.id, isOpen]);

  // useEffect for initial form data
  useEffect(() => {
    if (event && isOpen && fetchedRegistrationFields) {
      const initialData: Record<string, string> = {};
      fetchedRegistrationFields.forEach(field => {
        initialData[field.name] = '';
      });
      setFormData(initialData);
      setErrors({});
    }
  }, [event, isOpen, fetchedRegistrationFields]);

  // handleChange function
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, [setFormData, setErrors]);

  // validateForm function
  const validateForm = useCallback((): boolean => {
    if (!event || !Array.isArray(fetchedRegistrationFields) || fetchedRegistrationFields.length === 0) return false;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    fetchedRegistrationFields.forEach(field => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = 'This field is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [event, fetchedRegistrationFields, formData, setErrors]);

  // handleSubmit function
const handleSubmit = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm() || !event) {
    console.error("Validation failed");
    return;
  }

  setIsLoading(true);

  try {
    if (event.is_paid) {
      // For paid events - only send essential data
      const paymentResponse = await axios.post(
        `${AZURE_BACKEND_URL}/api/payment/init`,
        {
          eventId: event.id,
          userId: 1 // Replace with actual user ID from your auth system
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (paymentResponse.data.paymentUrl) {
        window.location.href = paymentResponse.data.paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } else {
      // For free events - handle registration
      await axios.post(`${AZURE_BACKEND_URL}/event/register-event`, {
        eventId: event.id,
        formData: formData // Keep form data only for registration
      });
      alert("Registration successful!");
      onClose();
    }
  } catch (error) {
    console.error("Payment error:", {
      config: error.config,
      response: error.response?.data
    });
    alert("Payment initiation failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
}, [event, formData, validateForm, onClose]);
  if (!isOpen) return null;

  // Show loading state for fields
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
   (event?.is_paid ? 'Proceed to Payment' : 'Confirm Registration')}
</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;