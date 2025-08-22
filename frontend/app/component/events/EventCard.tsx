// frontend/app/component/events/EventCard.tsx
'use client';
import { CalendarDays, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '../types';
import RegistrationModal from './RegistrationFormPage';

interface EventCardProps {
  event: Event;
  onViewDetails: () => void;
}

export default function EventCard({ event, onViewDetails }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const router = useRouter();
  console.log(event);

  // Function to check if user is logged in
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists, false otherwise
  };

  // Handle register button click
  const handleRegisterClick = () => {
    if (checkAuthentication()) {
      setIsModalOpen(true);
    } else {
      setShowLoginMessage(true);
      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowLoginMessage(false);
      }, 5000);
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    router.push('/dashboard'); // Redirect to login page
  };

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
        {/* Login Required Message */}
        {showLoginMessage && (
          <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm relative">
            <button
              onClick={() => setShowLoginMessage(false)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="pr-6">
              <p className="font-medium mb-1">Login Required</p>
              <p className="mb-2">You need to log in first to register for this event.</p>
              <button
                onClick={handleLoginRedirect}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={onViewDetails}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Details
          </button>
          <button
            onClick={handleRegisterClick} // Use the new authentication check function
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Register
          </button>
        </div>
      </div>

      {/* Render the RegistrationModal here */}
      {isModalOpen && (
        <RegistrationModal
          event={event} // Pass the event object
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          // Removed: onFinalizeRegistration, setMessage, setMessageType
        />
      )}
    </div>
  );
}