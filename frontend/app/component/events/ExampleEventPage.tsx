// Example usage of EventQueries component
import React, { useState, useEffect } from 'react';
import EventQueries from './EventQueries';
import { EventQuery } from '../types';

// Example component showing how to use EventQueries
const ExampleEventPage: React.FC = () => {
  const [queries, setQueries] = useState<EventQuery[]>([]);
  
  // Sample data based on your API format
  const sampleData: EventQuery[] = [
    {
      "id": 2,
      "event_id": 1,
      "user_id": 3,
      "question_text": "koba hoba?",
      "status": "open",
      "created_at": "2025-08-22T10:26:41.382Z",
      "updated_at": "2025-08-22T10:26:41.382Z",
      "replies": [
        {
          "id": 1,
          "query_id": 2,
          "user_id": 1,
          "reply_text": "keno hoba?",
          "created_at": "2025-08-22T10:26:59.431Z"
        }
      ]
    }
  ];

  useEffect(() => {
    // In real app, you would fetch this from your API
    setQueries(sampleData);
  }, []);

  const handleAddQuery = async (questionText: string) => {
    // Make API call to add new query
    console.log('Adding query:', questionText);
    // After successful API call, refresh the queries
  };

  const handleAddReply = async (queryId: number, replyText: string) => {
    // Make API call to add new reply
    console.log('Adding reply to query', queryId, ':', replyText);
    // After successful API call, refresh the queries
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Event Page Example</h1>
      
      <EventQueries
        queries={queries}
        eventId={1}
        onAddQuery={handleAddQuery}
        onAddReply={handleAddReply}
        currentUserId={123}
      />
    </div>
  );
};

export default ExampleEventPage;
