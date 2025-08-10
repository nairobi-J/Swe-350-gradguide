/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
import { Info, DollarSign, Calendar, MapPin, Clock, HelpCircle, Send, User, MessageSquare, Banknote } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
<<<<<<< HEAD
import { Event, Feedback, Query, Answer, Registration } from '../types';
import RegistrationModal from './RegistrationFormPage';

=======
import axios from 'axios';
import { comment } from 'postcss';
import { Event, Feedback, Query, Answer, Registration } from '../types';
import RegistrationModal from './RegistrationFormPage';
const AZURE_BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL;
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19
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
  const [feedbackComment, setFeedbackComment] = useState('');
  const [queryText, setQueryText] = useState('');
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({});
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');

  const handleFinalizeRegistration = (registration: Registration) => {
    console.log('Registration completed:', registration);
    setMessage("Registration successful!");
    setMessageType('success');
    setIsRegistrationModalOpen(false);
  };

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const eventFeedbacks = feedbacks.filter(f => f.eventId === event.id);
  const eventQueries = queries.filter(q => q.eventId === event.id);

<<<<<<< HEAD
  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackComment.trim()) {
=======
  const handleSendFeedback = async(e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackComment.trim()) {
      await axios.post(`${AZURE_BACKEND_URL}/eventFeedback/`, {
        eventId: 32,
        userId: 1,
        comment: feedbackComment
      },{
      headers:{
        "Content-Type": 'application/json',
      }
    })
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19
      addFeedback(event.id, currentUserId, `User ${currentUserId.split('-')[1]}`, feedbackComment);
      setFeedbackComment('');
    }
  };

<<<<<<< HEAD
  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
=======
  const handleSendQuery = async(e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
       await axios.post(`${AZURE_BACKEND_URL}/eventQuery/query`, {
        eventId: 32,
        userId: 1,
        queryText: queryText
      },{
      headers:{
        "Content-Type": 'application/json',
      }
    })
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19
      addQuery(event.id, currentUserId, `User ${currentUserId.split('-')[1]}`, queryText);
      setQueryText('');
    }
  };

  const handleAnswerChange = (queryId: string, value: string) => {
    setAnswerText(prev => ({ ...prev, [queryId]: value }));
  };

<<<<<<< HEAD
  const handleSubmitAnswer = (queryId: string) => {
    if (answerText[queryId]?.trim()) {
      addAnswerToQuery(queryId, currentUserId, "Event Host", answerText[queryId]);
=======
  const handleSubmitAnswer = async(queryId: string) => {
    if (answerText[queryId] && answerText[queryId].trim()) {
      await axios.post(`${AZURE_BACKEND_URL}/eventQuery/reply`, {
        queryId: 2,
        userId: 1,
        replyText: answerText[queryId]
      },{
      headers:{
        "Content-Type": 'application/json',
      }
    })
      addAnswerToQuery(queryId, currentUserId, "Event Host", answerText[queryId]); // Simulating a host reply
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19
      setAnswerText(prev => ({ ...prev, [queryId]: '' }));
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
                {event.is_paid ? (
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-purple-500" /> Questions & Answers
            </h2>
            
            <form onSubmit={handleSendQuery} className="mb-6">
              <div className="mb-3">
                <textarea
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Have a question about this event?"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-200 hover:bg-purple-300 text-black font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200"
              >
                Ask Question
              </button>
            </form>

            {eventQueries.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {eventQueries.map((query) => (
                  <div key={query.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-start mb-2">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium">
                        {query.username.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{query.username}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(query.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-800 ml-13 mb-3">{query.query}</p>

                    {query.answers.map((answer) => (
                      <div key={answer.id} className="ml-13 pl-4 border-l-2 border-purple-200 mb-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs font-medium">
                            {answer.username.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{answer.username}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(answer.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-1">{answer.answer}</p>
                      </div>
                    ))}

                    <div className="ml-13 mt-3">
                      <textarea
                        value={answerText[query.id] || ''}
                        onChange={(e) => handleAnswerChange(query.id, e.target.value)}
                        placeholder="Write your answer..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleSubmitAnswer(query.id)}
                        className="mt-2 text-sm bg-blue-200 hover:bg-blue-300 text-white py-1 px-3 rounded-lg transition-colors duration-200 flex items-center gap-1"
                      >
                        <Send className="h-3 w-3" /> Post Answer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageSquare className="h-8 w-8 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">No questions yet. Be the first to ask!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        event={event}
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onFinalizeRegistration={handleFinalizeRegistration}
        setMessage={setMessage}
        setMessageType={setMessageType}
      />
    </div>
  );
};

export default EventDetailPage;