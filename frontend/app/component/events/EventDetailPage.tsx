/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { Info, DollarSign, Calendar, MapPin, Clock, HelpCircle, Send, User, MessageSquare, Banknote } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import axios from 'axios';
import { comment } from 'postcss';
import { Event, Feedback, Query, Answer, Registration, EventQuery } from '../types';
import RegistrationModal from './RegistrationFormPage';
import EventQueries from './EventQueries';
const AZURE_BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL;
interface EventDetailPageProps {
  event: Event | null;
  onRegisterEvent: (eventId: string) => void;
  addFeedback: (eventId: string, userId: string, username: string, comment: string) => void;
  addQuery: (eventId: string, userId: string, username: string, queryText: string) => void;
  addAnswerToQuery: (queryId: string, userId: string, username: string, answerText: string) => void;
  feedbacks: Feedback[];
  queries: Query[];
  currentUserId: string;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event,
  addFeedback,
  addQuery,
  addAnswerToQuery,
  feedbacks,
  queries,
  currentUserId,
}) => {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [eventQueries, setEventQueries] = useState<EventQuery[]>([]);

  //fetch actual event query and reply by eventid
  const fetchEventQueryDetails = async () => {
    if (!event) return;
    
    try {
      const response = await axios.get(`${AZURE_BACKEND_URL}/eventQuery/query/?eventId=${event.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data) {
        setEventQueries(response.data);
      }
    } catch (error) {
      console.error('Error fetching event queries:', error);
    }
  };

  useEffect(() => {
    if (event) {
      fetchEventQueryDetails();
    }
  }, [event]);

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const eventFeedbacks = feedbacks.filter(f => f.eventId === event.id);

  const handleSendFeedback = async(e: React.FormEvent) => {
    e.preventDefault();
    // This function can be implemented for feedback if needed
  };

  const getLoggedInUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    }
    return null;
  };

  const[userId, setUserId] = useState<string | null>(getLoggedInUserId());

  const handleSendQuery = async (questionText: string) => {
    try {
      const response = await axios.post(`${AZURE_BACKEND_URL}/eventQuery/query`, {
        eventId: event?.id,
        userId: userId,
        queryText: questionText
      }, {
        headers: {
          "Content-Type": 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh queries after adding new one
      await fetchEventQueryDetails();
    } catch (error) {
      console.error('Error posting query:', error);
    }
  };

  const handleSendReply = async (queryId: number, replyText: string) => {
    try {
      await axios.post(`${AZURE_BACKEND_URL}/eventQuery/reply`, {
        queryId: queryId,
        userId: userId,
        replyText: replyText
      }, {
        headers: {
          "Content-Type": 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh queries after adding reply
      await fetchEventQueryDetails();
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Event Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{event.name}</h1>
        <div className="flex justify-center items-center space-x-4 text-gray-600">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" /> {event.date}
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" /> {event.time}
          </span>
          <span className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" /> 
            {event.type === 'online' ? 'Online Event' : event.location}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Details</h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Event Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-500" /> Event Type
              </h3>
              <p className="text-gray-700">
                {event.type === 'online' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    Online
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                    In-Person
                  </span>
                )}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <Banknote className="h-5 w-5 mr-2 text-green-500" /> Pricing
              </h3>
              <p className="text-gray-700">
                {event.is_Paid ? (
                  <span className="text-2xl font-bold text-green-600">Taka:{event.price.toFixed(2)}</span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                    Free Admission
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Registration CTA */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-gray-800">Ready to join us?</h3>
                <p className="text-gray-600">Secure your spot now</p>
              </div>
              <button
                onClick={() => setIsRegistrationModalOpen(true)}
                className="bg-gradient-to-r from-blue-200 to-purple-200 hover:from-blue-300 hover:to-purple-300 text-black font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                <User className="h-5 w-5" /> Register Now
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Interaction Section */}
        <div className="space-y-6">
          {/* Q&A Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <EventQueries
              queries={eventQueries}
              eventId={Number(event.id)}
              onAddQuery={handleSendQuery}
              onAddReply={handleSendReply}
              currentUserId={Number(currentUserId)}
            />
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        event={event}
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  );
};

export default EventDetailPage;