// frontend/app/component/events/EventCard.tsx
import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Event } from '../types'; // Import Event interface

interface EventCardProps {
  event: Event;
  onViewDetails: () => void;
  onRegister: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails, onRegister }) => {
  return (
    <div className="bg-gradient-to-r from-blue-200 to-purple-100 rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.name}</h3>
      <p className="text-sm text-gray-800 mb-3 flex items-center">
        <CalendarDays className="w-4 h-4 mr-1" /> {event.date} at {event.time}
      </p>
      <p className="text-gray-700 line-clamp-2 mb-4">{event.description}</p>
      <div className="flex justify-between items-center text-sm font-semibold text-green-800 mb-4">
        <span>{event.type === 'online' ? 'Online Event' : 'Offline Event'}</span>
        <span>{event.isPaid ? `$${event.price.toFixed(2)}` : 'Free'}</span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onViewDetails}
          className="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 hover:bg-blue-600 text-black font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Details
        </button>
        <button
          onClick={onRegister}
          className="flex-1 bg-gradient-to-r from-green-400 to-green-200 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

export default EventCard;