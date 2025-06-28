// E:\projects\GradGuide\frontend\app\component\types\DummyData.ts
import { Event, Feedback, Query, Registration } from './index'; // Import interfaces

export const DUMMY_EVENTS: Event[] = [
  {
    id: 'e1',
    name: 'Tech Career Fair',
    date: '2025-07-15',
    time: '10:00 AM',
    location: 'University Auditorium',
    description: 'Connect with leading tech companies and explore job opportunities in software development, data science, and AI.',
    type: 'offline',
    isPaid: false,
    price: 0,
    creatorId: 'org-101',
    registrationFields: [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'major', label: 'Major', type: 'text', required: false },
    ],
    createdAt: new Date('2025-06-01T10:00:00Z'),
  },
  {
    id: 'e2',
    name: 'Sustainable Energy Summit',
    date: '2025-08-20',
    time: '09:00 AM',
    location: 'https://zoom.us/j/1234567890', // Example online link
    description: 'A virtual summit on the latest innovations in sustainable energy, renewable technologies, and climate solutions.',
    type: 'online',
    isPaid: true,
    price: 25.00,
    creatorId: 'org-102',
    registrationFields: [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'organization', label: 'Organization', type: 'text', required: false },
    ],
    createdAt: new Date('2025-06-10T14:30:00Z'),
  },
  {
    id: 'e3',
    name: 'AI Ethics Workshop',
    date: '2025-09-05',
    time: '02:00 PM',
    location: 'Conference Room 3B, City Library',
    description: 'An interactive workshop exploring the ethical considerations in artificial intelligence development and deployment.',
    type: 'offline',
    isPaid: false,
    price: 0,
    creatorId: 'org-103',
    registrationFields: [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
    ],
    createdAt: new Date('2025-06-15T09:00:00Z'),
  },
];

export let DUMMY_REGISTRATIONS: Registration[] = []; // Initialize as empty or with some dummy data

export const DUMMY_FEEDBACKS: Feedback[] = [
  {
    id: 'f1',
    eventId: 'e1',
    userId: 'user-123',
    username: 'Alice Wonderland',
    comment: 'Great event! Very insightful and well-organized.',
    createdAt: new Date('2025-07-16T11:00:00Z'),
  },
  {
    id: 'f2',
    eventId: 'e1',
    userId: 'user-456',
    username: 'Bob The Builder',
    comment: 'Met many interesting companies. The booths were engaging.',
    createdAt: new Date('2025-07-16T14:00:00Z'),
  },
];

export const DUMMY_QUERIES: Query[] = [
  {
    id: 'q1',
    eventId: 'e2',
    userId: 'user-123',
    username: 'Alice Wonderland',
    query: 'Will the Sustainable Energy Summit sessions be recorded and available for later viewing?',
    createdAt: new Date('2025-08-01T09:00:00Z'),
    answers: [
      {
        id: 'a1',
        userId: 'org-102',
        username: 'Event Host',
        answer: 'Yes, all sessions will be recorded and shared with registered attendees within 48 hours after the summit concludes.',
        createdAt: new Date('2025-08-01T10:00:00Z'),
      },
    ],
  },
  {
    id: 'q2',
    eventId: 'e3',
    userId: 'user-789',
    username: 'Charlie Chaplin',
    query: 'Is there any prerequisite knowledge required for the AI Ethics Workshop?',
    createdAt: new Date('2025-08-25T15:30:00Z'),
    answers: [],
  },
];