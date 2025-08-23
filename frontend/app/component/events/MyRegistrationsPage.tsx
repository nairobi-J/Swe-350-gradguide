// frontend/app/component/events/MyRegistrationsPage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { UserRegistration } from '../types';
import { Calendar, Clock, MapPin, DollarSign, Download, Globe, User } from 'lucide-react';
import axios from 'axios';

const AZURE_BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL;

interface MyRegistrationsPageProps {
  currentUserId?: string;
}

const MyRegistrationsPage: React.FC<MyRegistrationsPageProps> = ({ currentUserId }) => {
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getLoggedInUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const fetchUserRegistrations = async () => {
    const userId = getLoggedInUserId();
    if (!userId) {
      setError('Please log in to view your registrations.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/regForm/eventsByUser/?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRegistrations(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      setError('Failed to load registrations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRegistrations();
  }, []);

  const handleDownloadConfirmation = (event: UserRegistration) => {
    const confirmationText = `
Event Registration Confirmation
================================

Event: ${event.name}
Event ID: ${event.id}
Type: ${event.type.toUpperCase()}
Date: ${new Date(event.date).toLocaleDateString()}
Time: ${event.time}
Location: ${event.location}
Description: ${event.description}

${event.is_paid ? `
Payment Information:
Price: $${event.price}
Status: Paid
` : 'Registration Type: Free Event'}

Registration Date: ${new Date(event.created_at).toLocaleString()}

Thank you for registering!
`;

    const element = document.createElement('a');
    const file = new Blob([confirmationText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `event_registration_${event.name.replace(/\s/g, '_')}_${event.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchUserRegistrations}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Event Registrations</h1>
        
        {registrations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Registrations Yet</h3>
            <p className="text-gray-600 mb-6">You haven't registered for any events yet.</p>
            <button
              onClick={() => window.location.href = '/dashboard/event'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {registrations.map((event: UserRegistration) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                {/* Event Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{event.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.type === 'online' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {event.type === 'online' ? (
                        <>
                          <Globe className="w-3 h-3 mr-1" />
                          Online Event
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3 mr-1" />
                          In-Person
                        </>
                      )}
                    </span>
                  </div>
                  {event.is_paid && (
                    <div className="text-right">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Paid Event
                      </div>
                      <div className="text-lg font-bold text-green-600 mt-1">
                        ${event.price}
                      </div>
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{formatTime(event.time)}</span>
                  </div>
                  
                  <div className="flex items-start text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="break-words">{event.location}</span>
                  </div>

                  {event.is_paid && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>Price: ${event.price}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Registration Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Registered:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(event.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Event ID:</span>
                    <span className="font-mono text-gray-900">#{event.id}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownloadConfirmation(event)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Confirmation
                  </button>
                  
                  {event.type === 'online' && event.location.includes('meet.com') && (
                    <button
                      onClick={() => window.open(`https://${event.location}`, '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrationsPage;