// E:\projects\GradGuide\frontend\app\dashboard\event\EventPageClient.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // <--- IMPORT AXIOS HERE
// Import all necessary Lucide icons
import { Home, Bot, BookOpen, Briefcase, TrendingUp, CalendarDays, PlusCircle, User, LogOut, CheckCircle, XCircle, Info, DollarSign, MessageSquare, HelpCircle, Send } from 'lucide-react';

// Import dummy data
import { DUMMY_FEEDBACKS, DUMMY_QUERIES } from '../../component/types/DummyData'; // Importing dummy data
// Import component types
import { Event, Registration, Feedback, Query } from '../../component/types';

// Import individual components
import SideNavigation from '../../component/navigation/SideNavigation';
import MessageCard from '../../component/shared/MessageCard';
import HomePage from '../../component/events/HomePage'; // The event listing page
import CreateEventPage from '../../component/events/CreateEventPage';
import EventDetailPage from '../../component/events/EventDetailPage';
import RegistrationFormPage from '../../component/events/RegistrationFormPage';
import MyRegistrationsPage from '../../component/events/MyRegistrationsPage';

let DUMMY_REGISTRATIONS: Registration[] = [];

export default function EventPageClient() {
  const [currentPath, setCurrentPath] = useState('/dashboard/events');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true); // <--- ADD LOADING STATE
  const [registrations, setRegistrations] = useState<Registration[]>(DUMMY_REGISTRATIONS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(DUMMY_FEEDBACKS);
  const [queries, setQueries] = useState<Query[]>(DUMMY_QUERIES);
  const [currentUserId, setCurrentUserId] = useState('user-123');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // <--- MOVE DATA FETCHING HERE
  useEffect(() => {
    axios.get('http://localhost:5000/event/all')
      .then(response => {
        // Assuming your backend returns an array of Event objects
        setEvents(response.data);
        setLoading(false);
        setMessage('Events loaded successfully!', 'success'); // Optional: show success message
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setLoading(false);
        setMessage('Failed to load events. Please try again later.', 'error'); // Optional: show error message
        setMessageType('error');
      });
  }, []); // Empty dependency array means this runs once on mount

  // --- Rest of your functions (addEvent, addRegistration, etc.) remain unchanged ---
  const addEvent = useCallback((newEvent: Event) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
  }, []);

  const addRegistration = useCallback((newRegistration: Registration) => {
    setRegistrations(prevRegistrations => [...prevRegistrations, newRegistration]);
    DUMMY_REGISTRATIONS.push(newRegistration);
  }, []);

  const addFeedback = useCallback((eventId: string, userId: string, username: string, comment: string) => {
    const newFeedback: Feedback = {
      id: `f${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      eventId, userId, username, comment, createdAt: new Date(),
    };
    setFeedbacks(prev => [...prev, newFeedback]);
    setMessage("Feedback submitted successfully!");
    setMessageType('success');
  }, []);

  const addQuery = useCallback((eventId: string, userId: string, username: string, queryText: string) => {
    const newQuery: Query = {
      id: `q${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      eventId, userId, username, query: queryText, createdAt: new Date(), answers: [],
    };
    setQueries(prev => [...prev, newQuery]);
    setMessage("Query submitted successfully!");
    setMessageType('success');
  }, []);

  const addAnswerToQuery = useCallback((queryId: string, userId: string, username: string, answerText: string) => {
    setQueries(prevQueries => prevQueries.map(q =>
      q.id === queryId
        ? { ...q, answers: [...q.answers, { id: `a${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, userId, username, answer: answerText, createdAt: new Date(), }], }
        : q
    ));
    setMessage("Answer submitted successfully!");
    setMessageType('success');
  }, []);

  const navigate = useCallback((path: string, eventId: string | null = null) => {
    setCurrentPath(path);
    setSelectedEventId(eventId);
  }, []);

  const handleShowDetails = useCallback((eventId: string) => {
    navigate(`/dashboard/event-details/${eventId}`, eventId);
  }, [navigate]);

  const handleRegister = useCallback((eventId: string) => {
    navigate(`/dashboard/register/${eventId}`, eventId);
  }, [navigate]);

  const currentEvent = selectedEventId ? events.find(event => event.id === selectedEventId) : null;

  // ... (Your functions like addEvent, navigate, currentEvent definition, etc. should be above here)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Events...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full text-gray-900 font-sans antialiased">
      {message && <MessageCard message={message} type={messageType} onClose={() => setMessage(null)} />}

      <aside className="hidden border-r lg:block w-[280px] shadow-lg rounded-r-xl">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1 overflow-y-auto py-4">
            <SideNavigation currentPath={currentPath} navigate={navigate} />
          </div>
          <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
            <p>Current User ID: <span className="font-mono break-all">{currentUserId}</span></p>
            <p className="mt-2">Note: This uses dummy data and simulates navigation.</p>
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1">
        <header className="flex h-14 items-center gap-4 border-b border-gray-200 px-6 lg:h-[60px] shadow-sm backdrop-blur-md z-10">
          <h1 className="text-xl font-bold text-gray-900">
            {
              currentPath.includes('/dashboard/create-event') ? 'Create New Event' :
              currentPath.includes('/dashboard/event-details') ? 'Event Details' :
              currentPath.includes('/dashboard/register') ? 'Event Registration' :
              currentPath.includes('/dashboard/my-registrations') ? 'My Registrations' :
              'Events'
            }
          </h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-y-auto">
          {currentPath === '/dashboard/events' && (
            <HomePage
              events={events}
              onRegister={handleRegister}
              onShowDetails={handleShowDetails}
              setMessage={setMessage}
              setMessageType={setMessageType}
              navigateToCreateEvent={() => navigate('/dashboard/create-event')}
            />
          )}
          {currentPath === '/dashboard/create-event' && (
            <CreateEventPage
              addEvent={addEvent}
              currentUserId={currentUserId}
              setMessage={setMessage}
              setMessageType={setMessageType}
            />
          )}
          {currentPath.startsWith('/dashboard/event-details/') && currentEvent && (
            <EventDetailPage
              event={currentEvent}
              onRegisterEvent={handleRegister}
              addFeedback={addFeedback}
              addQuery={addQuery}
              addAnswerToQuery={addAnswerToQuery}
              feedbacks={feedbacks}
              queries={queries}
              currentUserId={currentUserId}
            />
          )}
          {currentPath.startsWith('/dashboard/register/') && currentEvent && (
            <RegistrationFormPage
              event={currentEvent}
              onFinalizeRegistration={addRegistration}
              setMessage={setMessage}
              setMessageType={setMessageType}
            />
          )}
          {currentPath === '/dashboard/my-registrations' && (
            <MyRegistrationsPage
              registrations={registrations}
              currentUserId={currentUserId}
            />
          )}
          {!['/dashboard/events', '/dashboard/create-event', '/dashboard/my-registrations'].some(path => currentPath.startsWith(path)) &&
           !currentPath.startsWith('/dashboard/event-details/') &&
           !currentPath.startsWith('/dashboard/register/') && (
            <div className="text-center p-10 text-gray-600">
              <p className="text-2xl font-bold mb-4">Welcome!</p>
              <p className="text-lg">Select an option from the sidebar to get started.</p>
              <p className="text-sm mt-4">Current path not mapped to a specific page component in this demo.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}