// frontend/app/component/events/EventCard.tsx
'use client';
import { CalendarDays } from 'lucide-react';
import { useState, useCallback } from 'react'; // Added useCallback
import { Registration } from '../types'; // Import Event and Registration types
import RegistrationModal from './RegistrationFormPage'; // Import your RegistrationModal component

interface EventCardProps {
  event: Event;
  onViewDetails: () => void;

  
}

export default function EventCard({ event, onViewDetails }: EventCardProps) { // Removed onRegister from destructuring
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFinalizeRegistrationLocally = useCallback((registration: Registration) => {
    console.log("Registration completed locally for:", registration.eventName);
    // Here you could add a local alert or toast notification.
    setIsModalOpen(false); // Close the modal after local finalization
  }, []);

  const setLocalMessage = useCallback((message: string | null) => {
    console.log("Local message from RegistrationModal:", message);
    // You can implement local message display here if needed (e.g., a small pop-up on the card)
  }, []);

  const setLocalMessageType = useCallback((type: 'success' | 'error' | 'info') => {
    console.log("Local message type from RegistrationModal:", type);
  }, []);
  // --- End of local implementations ---


  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{event.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span>{event.date} at {event.time}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        <div className="flex justify-between items-center text-xs font-medium mb-4">
          <span className={`px-2 py-1 rounded-full ${
            event.type === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {event.type === 'online' ? 'Online' : 'In-Person'}
          </span>
          <span className={`px-2 py-1 rounded-full ${
            event.is_paid ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {event.is_paid ? `৳${event.price}` : 'Free'}
          </span>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="flex gap-3">
          {/* Details button remains the same, calling onViewDetails prop */}
          <button
            onClick={onViewDetails}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Details
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)} // Correctly set local state to open modal
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Register
          </button>
        </div>
      </div>

    
      {isModalOpen && (
        <RegistrationModal
          event={event} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} // Function to close the modal
          onFinalizeRegistration={handleFinalizeRegistrationLocally} // Pass the local function
          setMessage={setLocalMessage} // Pass the local function
          setMessageType={setLocalMessageType} // Pass the local function
        />
      )}
    </div>
  );
}