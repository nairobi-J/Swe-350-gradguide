// frontend/app/component/events/EventDetailPage.tsx
'use client';
import React, { useState } from 'react';
import { Info, DollarSign, MessageSquare, HelpCircle, Send, User } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Event, Feedback, Query, Answer } from '../types';
import axios from 'axios';
import { comment } from 'postcss';

interface EventDetailPageProps {
  event: Event | null; // Can be null initially while loading
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
  onRegisterEvent,
  addFeedback,
  addQuery,
  addAnswerToQuery,
  feedbacks,
  queries,
  currentUserId,
}) => {
  const [feedbackComment, setFeedbackComment] = useState('');
  const [queryText, setQueryText] = useState('');
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({}); // State for answers to specific queries

  if (!event) {
    return <LoadingSpinner />;
  }

  const eventFeedbacks = feedbacks.filter(f => f.eventId === event.id);
  const eventQueries = queries.filter(q => q.eventId === event.id);

  const handleSendFeedback = async(e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackComment.trim()) {
      await axios.post('http://localhost:5000/eventFeedback/', {
        eventId: 32,
        userId: 1,
        comment: feedbackComment
      },{
      headers:{
        "Content-Type": 'application/json',
      }
    })
      addFeedback(event.id, currentUserId, `User ${currentUserId.split('-')[1]}`, feedbackComment);
      setFeedbackComment('');
    }
  };

  const handleSendQuery = async(e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
       await axios.post('http://localhost:5000/eventQuery/query', {
        eventId: 32,
        userId: 1,
        queryText: queryText
      },{
      headers:{
        "Content-Type": 'application/json',
      }
    })
      addQuery(event.id, currentUserId, `User ${currentUserId.split('-')[1]}`, queryText);
      setQueryText('');
    }
  };

  const handleAnswerChange = (queryId: string, value: string) => {
    setAnswerText(prev => ({ ...prev, [queryId]: value }));
  };

  const handleSubmitAnswer = async(queryId: string) => {
    if (answerText[queryId] && answerText[queryId].trim()) {
      await axios.post('http://localhost:5000/eventQuery/reply', {
        queryId: 2,
        userId: 1,
        replyText: answerText[queryId]
      },{
      headers:{
        "Content-Type": 'application/json',
      }
    })
      addAnswerToQuery(queryId, currentUserId, "Event Host", answerText[queryId]); // Simulating a host reply
      setAnswerText(prev => ({ ...prev, [queryId]: '' }));
    }
  };

  return (
    <div className="p-6 bg-gray-50 text-black min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{event.name}</h1>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Info className="h-6 w-6 mr-2" /> Event Information</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">{event.description}</p>
            <p className="text-gray-600 text-md mb-2"><strong className="text-gray-800">Date:</strong> {event.date}</p>
            <p className="text-gray-600 text-md mb-2"><strong className="text-gray-800">Time:</strong> {event.time}</p>
            <p className="text-gray-600 text-md mb-2">
              <strong className="text-gray-800">Location:</strong>
              {event.type === 'online' ? (
                <span className="ml-1 text-red-600 font-semibold">Online (Link available after registration)</span>
              ) : (
                <span className="ml-1">{event.location}</span>
              )}
            </p>
            <p className="text-gray-600 text-md mb-2">
              <strong className="text-gray-800">Type:</strong> {event.type === 'online' ? 'Online Event' : 'Offline Event'}
            </p>
            <p className="text-gray-600 text-md mb-4">
              <strong className="text-gray-800">Price:</strong> {event.isPaid ? <span className="text-green-600 font-semibold">${event.price.toFixed(2)}</span> : 'Free'}
            </p>
            <button
              onClick={() => onRegisterEvent(event.id)}
              className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <User className="h-5 w-5" /> Register Now
            </button>
          </div>

          <div>
            {event.isPaid && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><DollarSign className="h-6 w-6 mr-2" /> Payment Information</h2>
                <p className="text-gray-700 mb-4">
                  This is a paid event. To register, you will need to pay the amount of <strong className="text-green-600">${event.price.toFixed(2)}</strong>.
                  Click the "Register Now" button above to proceed with registration and payment.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-8">
                  <p className="text-blue-800 font-medium">Payment Gateway Simulation:</p>
                  <p className="text-sm text-blue-700">Upon clicking register, you would typically be redirected to a secure payment portal (e.g., Stripe, PayPal).</p>
                </div>
              </>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><MessageSquare className="h-6 w-6 mr-2" /> Feedbacks</h2>
            <form onSubmit={handleSendFeedback} className="space-y-3 mb-6">
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Share your thoughts about this event..."
                rows={3}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
              >
                Submit Feedback
              </button>
            </form>
            {eventFeedbacks.length > 0 ? (
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {eventFeedbacks.map((f) => (
                  <div key={f.id} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">{f.username}</p>
                    <p className="text-gray-700 mt-1">{f.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(f.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No feedbacks yet. Be the first to share your thoughts!</p>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 flex items-center"><HelpCircle className="h-6 w-6 mr-2" /> Queries & Answers</h2>
            <form onSubmit={handleSendQuery} className="space-y-3 mb-6">
              <textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Have a question? Ask here..."
                rows={3}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
              >
                Submit Query
              </button>
            </form>
            {eventQueries.length > 0 ? (
              <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {eventQueries.map((query) => (
                  <div key={query.id} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <p className="text-sm text-gray-500 mb-1">
                      <span className="font-semibold">{query.username}</span> asked on {new Date(query.createdAt).toLocaleString()}
                    </p>
                    <p className="text-lg text-gray-800 font-medium mb-3">"{query.query}"</p>

                    {query.answers.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {query.answers.map(answer => (
                          <div key={answer.id} className="bg-indigo-100 p-3 rounded-md">
                            <p className="font-semibold text-indigo-800">{answer.username} (Answer):</p>
                            <p className="text-indigo-700 mt-1">{answer.answer}</p>
                            <p className="text-xs text-indigo-500 mt-1">{new Date(answer.createdAt).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Host Reply Section */}
                    <div className="mt-4 pt-4 border-t border-indigo-200">
                      <h3 className="text-md font-semibold text-gray-700 mb-2">Reply:</h3>
                      <textarea
                        value={answerText[query.id] || ''}
                        onChange={(e) => handleAnswerChange(query.id, e.target.value)}
                        placeholder="Type your answer here..."
                        rows={2}
                        className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      ></textarea>
                      <button
                        onClick={() => handleSubmitAnswer(query.id)}
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
                      >
                        <Send className="h-4 w-4" /> Submit Answer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No queries yet. Ask a question about this event!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;