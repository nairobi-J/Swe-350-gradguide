// frontend/app/component/events/HomePage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import EventCard from './EventCard';
import { Event } from '../types'; // Import Event interface

interface HomePageProps {
  events: Event[];
  onRegister: (eventId: string) => void;
  onShowDetails: (eventId: string) => void;
  setMessage: (message: string | null) => void; // Keeping for consistency, though it's set in Page.tsx
  setMessageType: (type: 'success' | 'error' | 'info') => void; // Keeping for consistency
  navigateToCreateEvent: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ events, onRegister, onShowDetails, navigateToCreateEvent }) => {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const newFilteredEvents = events.filter(event =>
      event.name.toLowerCase().includes(lowercasedSearchTerm) ||
      event.description.toLowerCase().includes(lowercasedSearchTerm) ||
      (event.location && event.location.toLowerCase().includes(lowercasedSearchTerm))
    );
    setFilteredEvents(newFilteredEvents);
  }, [searchTerm, events]);

  return (
    <div className="p-6 bg-gray-50 text-black min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Explore Events</h1>
        <button
          onClick={navigateToCreateEvent}
          className="bg-gradient-to-r from-blue-300 to-purple-100 text-black font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Create New Event
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search events by name, description, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
      </div>

      {events.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No events found. Try creating one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={() => onShowDetails(event.id)}
              onRegister={() => onRegister(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage; // Renamed from original, consider a more descriptive name like EventListingPage