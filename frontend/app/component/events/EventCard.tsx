// frontend/app/component/events/EventCard.tsx
'use client';
import { CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { Event } from '../types'; // Import Event interface if you haven't already

interface EventCardProps {
  event: Event;
  onViewDetails: () => void; // Add this prop
  onRegister: () => void; // Add this prop
}

export default function EventCard({ event, onViewDetails, onRegister }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Consider moving modal logic out or making it a separate component

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span>{event.date} at {event.time}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
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
          <button
            onClick={onViewDetails} // Use the prop here
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Details
          </button>
          <button
            onClick={onRegister} // Use the prop here
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}