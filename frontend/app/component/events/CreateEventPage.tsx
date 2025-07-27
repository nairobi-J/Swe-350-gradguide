// frontend/app/component/events/CreateEventPage.tsx
'use client';
import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import { Event, RegistrationField } from '../types'; // Import types
import axios from 'axios';

interface CreateEventPageProps {
  addEvent: (event: Event) => void;
  currentUserId: string;
  setMessage: (message: string | null) => void;
  setMessageType: (type: 'success' | 'error' | 'info') => void;
}

const CreateEventPage: React.FC<CreateEventPageProps> = ({ addEvent, currentUserId, setMessage, setMessageType }) => {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState<'online' | 'offline'>('online');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [eventPrice, setEventPrice] = useState(0);
  const [registrationFields, setRegistrationFields] = useState<RegistrationField[]>([
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
  ]);
  const [loading, setLoading] = useState(false);

  const addField = () => {
    setRegistrationFields([...registrationFields, { name: '', label: '', type: 'text', required: false }]);
  };

  const updateField = (index: number, key: keyof RegistrationField, value: any) => {
    const newFields = [...registrationFields];
    (newFields[index] as any)[key] = value; // Type assertion for flexibility
    setRegistrationFields(newFields);
  };

  const removeField = (index: number) => {
    const newFields = registrationFields.filter((_, i) => i !== index);
    setRegistrationFields(newFields);
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const parsedPrice = parseFloat(eventPrice.toString()); // Ensure it's parsed correctly
    if (isPaid && (isNaN(parsedPrice) || parsedPrice <= 0)) {
      setMessage("Please enter a valid price for paid events.", 'error');
      setMessageType('error');
      setLoading(false);
      return;
    }

    const invalidFields = registrationFields.some(field => !field.name || !field.label);
    if (invalidFields) {
      setMessage("All custom field names and labels are required.", 'error');
      setMessageType('error');
      setLoading(false);
      return;
    }

    const newEvent: Event = { // Type the new event
      id: `e${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: eventName,
      type: eventType,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      description: eventDescription,
      isPaid: isPaid,
      price: isPaid ? parsedPrice : 0,
      creatorId: currentUserId,
      registrationFields: registrationFields,
      createdAt: new Date(),
    };

    const token = localStorage.getItem('token');
    
    const response = await axios.post('http://localhost:5000/event/create', {
      eventName: newEvent.name,
      eventType: newEvent.type,
      eventDate: newEvent.date,
      eventTime: newEvent.time,
      eventLocation: newEvent.location,
      eventDescription: newEvent.description,
      isPaid: newEvent.isPaid,
      eventPrice: newEvent.price,
      registrationFields: newEvent.registrationFields
    },{
      headers:{
        Authorization: `Bearer ${token}`, 
        "Content-Type": 'application/json',
      },
    })

    console.log(response)

    addEvent(newEvent);
    setMessage("Event created successfully!", 'success');
    setMessageType('success');

    // Clear form
    setEventName('');
    setEventType('online');
    setEventDate('');
    setEventTime('');
    setEventLocation('');
    setEventDescription('');
    setIsPaid(false);
    setEventPrice(0);
    setRegistrationFields([
      { name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
    ]);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Event</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6">
        <div>
          <label htmlFor="eventName" className="block text-lg font-medium text-gray-900 mb-2">Event Name</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="eventType" className="block text-lg font-medium text-gray-900 mb-2">Event Type</label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as 'online' | 'offline')} // Cast for type safety
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div>
            <label htmlFor="eventLocation" className="block text-lg font-medium text-gray-900 mb-2">
              {eventType === 'online' ? 'Online Link (e.g., Zoom URL)' : 'Physical Address'}
            </label>
            <input
              type="text"
              id="eventLocation"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="eventDate" className="block text-lg font-medium text-gray-900 mb-2">Date</label>
            <input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="eventTime" className="block text-lg font-medium text-gray-900 mb-2">Time</label>
            <input
              type="time"
              id="eventTime"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="eventDescription" className="block text-lg font-medium text-gray-900 mb-2">Description</label>
          <textarea
            id="eventDescription"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            rows={4}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            id="isPaid"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isPaid" className="text-lg font-medium text-gray-900">Paid Event?</label>
          {isPaid && (
            <div className="flex-1 ml-4">
              <label htmlFor="eventPrice" className="sr-only">Price</label>
              <input
                type="number"
                id="eventPrice"
                value={eventPrice}
                onChange={(e) => setEventPrice(parseFloat(e.target.value))}
                placeholder="Price"
                step="0.01"
                min="0"
                required={isPaid}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Customize Registration Form</h2>
          <p className="text-gray-600 mb-4">Define the fields attendees will fill out during registration.</p>
          {registrationFields.map((field, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-3 items-end mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Field Name (Internal)</label>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(index, 'name', e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Label (Visible to User)</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(index, 'label', e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={field.type}
                    onChange={(e) => updateField(index, 'type', e.target.value as RegistrationField['type'])}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="textarea">Text Area</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(index, 'required', e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Required</label>
                {index > 1 && ( // Allow removing fields beyond the initial two
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="ml-auto p-2 text-red-500 hover:text-red-700 transition-colors duration-200 rounded-full hover:bg-red-100"
                    title="Remove Field"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addField}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
          >
            Add Custom Field
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors duration-200 ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
          }`}
        >
          {loading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;