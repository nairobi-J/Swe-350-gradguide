'use client';
import React, { useState } from 'react';
import { MessageCircle, Reply, Clock, User } from 'lucide-react';
import { EventQuery, QueryReply } from '../types';

interface EventQueriesProps {
  queries: EventQuery[];
  eventId: number;
  onAddQuery?: (questionText: string) => void;
  onAddReply?: (queryId: number, replyText: string) => void;
  currentUserId?: number;
}

const EventQueries: React.FC<EventQueriesProps> = ({
  queries,
  eventId,
  onAddQuery,
  onAddReply,
  currentUserId
}) => {
  const [newQuery, setNewQuery] = useState('');
  const [replyTexts, setReplyTexts] = useState<{ [key: number]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: number]: boolean }>({});

  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuery.trim() && onAddQuery) {
      onAddQuery(newQuery.trim());
      setNewQuery('');
    }
  };

  const handleSubmitReply = (queryId: number) => {
    const replyText = replyTexts[queryId];
    if (replyText?.trim() && onAddReply) {
      onAddReply(queryId, replyText.trim());
      setReplyTexts(prev => ({ ...prev, [queryId]: '' }));
      setShowReplyForm(prev => ({ ...prev, [queryId]: false }));
    }
  };

  const toggleReplyForm = (queryId: number) => {
    setShowReplyForm(prev => ({ ...prev, [queryId]: !prev[queryId] }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Questions & Answers</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
          {queries.length}
        </span>
      </div>

      {/* Add New Query Form */}
      {onAddQuery && (
        <form onSubmit={handleSubmitQuery} className="bg-gray-50 p-4 rounded-lg">
          <label htmlFor="newQuery" className="block text-sm font-medium text-gray-700 mb-2">
            Ask a Question
          </label>
          <textarea
            id="newQuery"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            placeholder="Type your question here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            required
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={!newQuery.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Post Question
            </button>
          </div>
        </form>
      )}

      {/* Queries List */}
      <div className="space-y-4">
        {queries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          queries.map((query) => (
            <div key={query.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              {/* Query Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">User {query.user_id}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    query.status === 'open' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {query.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatDate(query.created_at)}
                </div>
              </div>

              {/* Query Text */}
              <p className="text-gray-800 mb-4">{query.question_text}</p>

              {/* Replies */}
              {query.replies.length > 0 && (
                <div className="space-y-3 mb-4">
                  <div className="border-l-2 border-gray-200 pl-4">
                    {query.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 p-3 rounded-lg mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Reply className="w-3 h-3 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700">User {reply.user_id}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(reply.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800">{reply.reply_text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <div className="border-t border-gray-100 pt-3">
                {!showReplyForm[query.id] ? (
                  <button
                    onClick={() => toggleReplyForm(query.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Reply className="w-3 h-3" />
                    Reply
                  </button>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={replyTexts[query.id] || ''}
                      onChange={(e) => setReplyTexts(prev => ({ ...prev, [query.id]: e.target.value }))}
                      placeholder="Type your reply..."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSubmitReply(query.id)}
                        disabled={!replyTexts[query.id]?.trim()}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post Reply
                      </button>
                      <button
                        onClick={() => toggleReplyForm(query.id)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventQueries;
