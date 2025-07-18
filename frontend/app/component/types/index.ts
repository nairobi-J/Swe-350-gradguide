// frontend/app/component/types/index.ts

// NavItem
export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType; // For Lucide icons
}

// Event related interfaces
export interface RegistrationField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea';
  required: boolean;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'online' | 'offline';
  isPaid: boolean;
  price: number;
  creatorId: string;
  registrationFields: RegistrationField[];
  createdAt: Date;
}

// Registration related interfaces
export interface Registration {
  id: string;
  eventId: string;
  eventName: string;
  userId: string;
  formData: string; // JSON.stringify(data)
  status: 'paid' | 'confirmed' | 'pending';
  paymentDetails: { amount: number; transactionId: string } | null;
  registeredAt: Date;
  confirmationData: {
    joinLink: string;
    downloadContent: string;
    downloadFileName: string;
  };
}

// Feedback related interfaces
export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  username: string;
  comment: string;
  createdAt: Date;
}

// Query related interfaces
export interface Answer {
  id: string;
  userId: string;
  username: string;
  answer: string;
  createdAt: Date;
}

export interface Query {
  id: string;
  eventId: string;
  userId: string;
  username: string;
  query: string;
  createdAt: Date;
  answers: Answer[];
}