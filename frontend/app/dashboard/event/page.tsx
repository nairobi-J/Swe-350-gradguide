'use client'; // This directive is essential for client-side functionality

import React, { useState, useEffect, useCallback } from 'react';
import { Home, Bot, BookOpen, Briefcase, TrendingUp, CalendarDays, PlusCircle, User, LogOut, CheckCircle, XCircle, Info, DollarSign, MessageSquare, HelpCircle, Send } from 'lucide-react';

// --- Dummy Data ---
// In a real application, this data would come from a database like Firestore.
let DUMMY_EVENTS = [
    {
        id: 'e1',
        name: 'Introduction to Web Development',
        type: 'online',
        date: '2025-07-15',
        time: '10:00 AM',
        location: 'https://zoom.us/j/1234567890',
        description: 'Learn the basics of HTML, CSS, and JavaScript to build your first web pages. This workshop covers fundamental concepts, setting up your development environment, and building simple static websites. Perfect for beginners looking to start their journey in web development.',
        isPaid: false,
        price: 0,
        creatorId: 'dummy-creator-1',
        registrationFields: [
            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'experienceLevel', label: 'Experience Level', type: 'text', required: false },
        ],
        createdAt: new Date('2025-06-01T10:00:00Z'),
    },
    {
        id: 'e2',
        name: 'Local Community Cleanup Drive',
        type: 'offline',
        date: '2025-07-20',
        time: '09:00 AM',
        location: 'Central Park Main Entrance',
        description: 'Join us to help keep our park clean and green! All ages welcome. We will provide gloves and bags, just bring your enthusiasm and willingness to make a difference in our community.',
        isPaid: false,
        price: 0,
        creatorId: 'dummy-creator-2',
        registrationFields: [
            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'tShirtSize', label: 'T-Shirt Size (S, M, L, XL)', type: 'text', required: false },
        ],
        createdAt: new Date('2025-06-05T09:00:00Z'),
    },
    {
        id: 'e3',
        name: 'Advanced React Workshop',
        type: 'online',
        date: '2025-08-01',
        time: '02:00 PM',
        location: 'https://meet.google.com/xyz123abc',
        description: 'Deep dive into React hooks, context API, and performance optimization. This workshop is designed for developers already familiar with React basics who want to enhance their skills and build more efficient and scalable applications.',
        isPaid: true,
        price: 49.99,
        creatorId: 'dummy-creator-1',
        registrationFields: [
            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'companyName', label: 'Company Name', type: 'text', required: false },
            { name: 'linkedInProfile', label: 'LinkedIn Profile URL', type: 'text', required: false },
        ],
        createdAt: new Date('2025-06-10T14:00:00Z'),
    },
    {
        id: 'e4',
        name: 'Food Festival: Taste of the City',
        type: 'offline',
        date: '2025-08-10',
        time: '11:00 AM',
        location: 'Downtown Exhibition Center',
        description: 'Experience a culinary journey with diverse food stalls and live music. Sample various cuisines, enjoy live performances, and participate in cooking demonstrations. Fun for the whole family!',
        isPaid: true,
        price: 15.00,
        creatorId: 'dummy-creator-3',
        registrationFields: [
            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'dietaryRestrictions', label: 'Dietary Restrictions (e.g., Vegetarian, Vegan, Gluten-Free)', type: 'textarea', required: false },
        ],
        createdAt: new Date('2025-06-12T11:00:00Z'),
    },
];

let DUMMY_REGISTRATIONS = [];

let DUMMY_FEEDBACKS = [
    {
        id: 'f1',
        eventId: 'e1',
        userId: 'Jerin',
        username: 'Alice Smith',
        comment: 'Great introduction to web development! Very clear and concise.',
        createdAt: new Date('2025-07-16T10:00:00Z'),
    },
    {
        id: 'f2',
        eventId: 'e1',
        userId: 'user-456',
        username: 'Bob Johnson',
        comment: 'Enjoyed the session, but could use more examples for JavaScript.',
        createdAt: new Date('2025-07-16T11:30:00Z'),
    },
];

let DUMMY_QUERIES = [
    {
        id: 'q1',
        eventId: 'e3',
        userId: 'Jerin',
        username: 'Nusrat Jahan Jerin',
        query: 'Will the advanced React workshop include a section on server-side rendering?',
        createdAt: new Date('2025-07-25T09:00:00Z'),
        answers: [],
    },
    {
        id: 'q2',
        eventId: 'e4',
        userId: 'user-789',
        username: 'Charlie Brown',
        query: 'Are there vegetarian-friendly options available at the food festival?',
        createdAt: new Date('2025-08-01T14:00:00Z'),
        answers: [
            {
                id: 'a1',
                userId: 'admin-001',
                username: 'Event Admin',
                answer: 'Yes, there will be a wide variety of vegetarian and vegan options available from several vendors!',
                createdAt: new Date('2025-08-01T15:30:00Z'),
            }
        ],
    },
];


// --- Utility Components ---

// A generic modal component
const CustomModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h3>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    <XCircle className="h-6 w-6" />
                </button>
                <div className="max-h-[80vh] overflow-y-auto pr-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Loading Spinner
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

// Success/Error Message component
const MessageCard = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-blue-100 border-blue-400 text-blue-700';
    const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : Info;

    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg border-l-4 ${bgColor} z-[100]`}>
            <div className="flex items-center">
                <Icon className="h-6 w-6 mr-3" />
                <span className="font-medium">{message}</span>
                <button onClick={onClose} className="ml-auto text-current hover:opacity-80">
                    <XCircle className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

// --- Navigation Data (for the dummy app's internal navigation) ---
interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { href: '/dashboard/events', label: 'Events', icon: CalendarDays },
    { href: '/dashboard/my-registrations', label: 'My Registrations', icon: User },
];

const SideNavigation = ({ currentPath, navigate }) => {
    return (
        <nav className="flex flex-col bg-white gap-2 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 px-3">Event Hub</h2>
            {navItems.map((item) => (
                <a
                    key={item.href}
                    href="#"
                    onClick={() => navigate(item.href)}
                    className={`
                        flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gradient-to-r from-blue-200 to-purple-100
                        ${currentPath === item.href ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'}
                    `}
                >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                </a>
            ))}
        </nav>
    );
};

// --- Event Listing Page Component ---
const HomePage = ({ events, onRegister, onShowDetails, navigateToCreateEvent }) => {
    const [filteredEvents, setFilteredEvents] = useState(events);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const newFilteredEvents = events.filter(event =>
            event.name.toLowerCase().includes(lowercasedSearchTerm) ||
            event.description.toLowerCase().includes(lowercasedSearchTerm) ||
            (event.location && event.location.toLowerCase().includes(lowercasedSearchTerm))
        );
        setFilteredEvents(newFilteredEvents);
    }, [searchTerm, events]);

    return (
        <div className="p-6 bg-gray-50 text-black min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">Explore Events</h1>
                <button
                    onClick={navigateToCreateEvent}
                    className="bg-gradient-to-r from-blue-300 to-purple-100 text-black font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
                >
                    <PlusCircle className="h-5 w-5" />
                    Create New Event
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search events by name, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
            </div>

            {events.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No events found. Try creating one!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onViewDetails={() => onShowDetails(event.id)} // Pass event ID for details page
                            onRegister={() => onRegister(event.id)} // Pass event ID for registration page
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Event card for display in the feed
const EventCard = ({ event, onViewDetails, onRegister }) => {
    return (
        <div className="bg-gradient-to-r from-blue-200 to-purple-100 rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.name}</h3>
            <p className="text-sm text-gray-800 mb-3 flex items-center">
                <CalendarDays className="w-4 h-4 mr-1" /> {event.date} at {event.time}
            </p>
            <p className="text-gray-700 line-clamp-2 mb-4">{event.description}</p>
            <div className="flex justify-between items-center text-sm font-semibold text-green-800 mb-4">
                <span>{event.type === 'online' ? 'Online Event' : 'Offline Event'}</span>
                <span>{event.isPaid ? `$${event.price.toFixed(2)}` : 'Free'}</span>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onViewDetails}
                    className="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 hover:bg-blue-600 text-black font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                    Details
                </button>
                <button
                    onClick={onRegister}
                    className="flex-1 bg-gradient-to-r from-green-400 to-green-200 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                    Register Now
                </button>
            </div>
        </div>
    );
};

// --- Event Detail Page Component ---
const EventDetailPage = ({ event, onRegisterEvent, addFeedback, addQuery, addAnswerToQuery, feedbacks, queries, currentUserId }) => {
    const [feedbackComment, setFeedbackComment] = useState('');
    const [queryText, setQueryText] = useState('');
    const [answerText, setAnswerText] = useState({}); // State for answers to specific queries

    if (!event) {
        return <LoadingSpinner />;
    }

    const eventFeedbacks = feedbacks.filter(f => f.eventId === event.id);
    const eventQueries = queries.filter(q => q.eventId === event.id);

    const handleSendFeedback = (e) => {
        e.preventDefault();
        if (feedbackComment.trim()) {
            addFeedback(event.id, currentUserId, `User ${currentUserId.split('-')[1]}`, feedbackComment);
            setFeedbackComment('');
        }
    };

    const handleSendQuery = (e) => {
        e.preventDefault();
        if (queryText.trim()) {
            addQuery(event.id, currentUserId, `User ${currentUserId.split('-')[1]}`, queryText);
            setQueryText('');
        }
    };

    const handleAnswerChange = (queryId, value) => {
        setAnswerText(prev => ({ ...prev, [queryId]: value }));
    };

    const handleSubmitAnswer = (queryId) => {
        if (answerText[queryId] && answerText[queryId].trim()) {
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
                                rows="3"
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
                                rows="3"
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
                                                rows="2"
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


// --- Registration Form Page Component ---
const RegistrationFormPage = ({ event, onFinalizeRegistration, setMessage, setMessageType }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmationDetails, setConfirmationDetails] = useState(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    useEffect(() => {
        if (event) {
            const initialData = {};
            const initialErrors = {};
            event.registrationFields.forEach(field => {
                initialData[field.name] = '';
                if (field.required) {
                    initialErrors[field.name] = 'Required';
                }
            });
            setFormData(initialData);
            setErrors(initialErrors);
        }
    }, [event]);

    if (!event) {
        return <LoadingSpinner />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (event.registrationFields.find(f => f.name === name)?.required && !value) {
            setErrors(prev => ({ ...prev, [name]: 'Required' }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        event.registrationFields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = 'Required';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setMessage("Please fill in all required fields.", "error");
            setMessageType('error');
            return;
        }

        if (event.isPaid) {
            setIsPaymentModalOpen(true);
        } else {
            await finalizeRegistrationProcess(formData, null);
        }
    };

    const finalizeRegistrationProcess = async (data, paymentDetails) => {
        setIsLoading(true);
        const registrationId = `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`; // Dummy ID

        const registrationData = {
            id: registrationId,
            eventId: event.id,
            eventName: event.name,
            userId: 'user-123', // Assuming a logged-in user
            formData: JSON.stringify(data),
            status: event.isPaid ? 'paid' : 'confirmed',
            paymentDetails: paymentDetails || null,
            registeredAt: new Date(),
            confirmationData: { // Dummy confirmation data
                joinLink: event.location, // Meeting link explicitly provided here
                downloadContent: `
                    Registration Confirmed for: ${event.name}
                    Date: ${event.date}
                    Time: ${event.time}
                    ${event.type === 'online' ? 'Online Link: ' + event.location : 'Location: ' + event.location}
                    Your Registration ID: ${registrationId}

                    Submitted Details:
                    ${Object.entries(data).map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}

                    Thank you for your registration!
                `,
                downloadFileName: `registration_${event.name.replace(/\s/g, '_')}_${registrationId}.txt`,
            }
        };

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        onFinalizeRegistration(registrationData); // Add to dummy registrations
        setConfirmationDetails(registrationData.confirmationData);
        setIsPaymentModalOpen(false);
        setIsConfirmationModalOpen(true);
        setMessage("Registration successful!", 'success');
        setIsLoading(false);

        console.log("Simulating email to:", data.email);
        console.log("Email Content:\n", registrationData.confirmationData.downloadContent);
    };

    const handlePaymentSuccess = async (transactionId) => {
        await finalizeRegistrationProcess(formData, { amount: event.price, transactionId: transactionId });
    };

    return (
        <div className="p-6 bg-gray-50 text-black min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Register for: {event.name}</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6">
                <p className="text-gray-700 mb-4">Please fill out the details below to register for **{event.name}**.</p>
                {event.registrationFields.map((field) => (
                    <div key={field.name} className="flex flex-col">
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'textarea' ? (
                            <textarea
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                required={field.required}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="3"
                            />
                        ) : (
                            <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                required={field.required}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        )}
                        {errors[field.name] && (
                            <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                        )}
                    </div>
                ))}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors duration-200 ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                    }`}
                >
                    {isLoading ? 'Processing...' : event.isPaid ? `Proceed to Pay $${event.price.toFixed(2)}` : 'Confirm Registration'}
                </button>
            </form>

            {event && (
                <PaymentSimulationModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    event={event}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
            {confirmationDetails && (
                <ConfirmationModal
                    isOpen={isConfirmationModalOpen}
                    onClose={() => setIsConfirmationModalOpen(false)}
                    confirmationData={confirmationDetails}
                />
            )}
        </div>
    );
};


// Payment simulation modal
const PaymentSimulationModal = ({ isOpen, onClose, event, onPaymentSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const simulatePayment = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const transactionId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            onPaymentSuccess(transactionId);
            onClose();
        }, 2000);
    };

    return (
        <CustomModal isOpen={isOpen} onClose={onClose} title={`Simulate Payment for ${event.name}`}>
            <div className="text-center p-4">
                <p className="text-lg text-gray-800 mb-4">
                    You are about to pay <span className="font-bold">${event.price.toFixed(2)}</span> for {event.name}.
                </p>
                <p className="text-gray-600 mb-6">
                    This is a simulation of a payment gateway. In a real application, you would be redirected.
                </p>
                <button
                    onClick={simulatePayment}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors duration-200 ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-lg'
                    }`}
                >
                    {isLoading ? 'Processing Payment...' : `Simulate Pay $${event.price.toFixed(2)}`}
                </button>
            </div>
        </CustomModal>
    );
};

// Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, confirmationData }) => {
    const handleDownload = () => {
        if (confirmationData?.downloadContent) {
            const element = document.createElement('a');
            const file = new Blob([confirmationData.downloadContent], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = confirmationData.downloadFileName || 'registration_confirmation.txt';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };

    return (
        <CustomModal isOpen={isOpen} onClose={onClose} title="Registration Confirmed!">
            <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-900 mb-2">
                    Thank you for registering!
                </p>
                {confirmationData?.joinLink && (
                    <p className="text-gray-700 mb-3">
                        Join Link: <a href={confirmationData.joinLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{confirmationData.joinLink}</a>
                    </p>
                )}
                {confirmationData?.registrationId && (
                    <p className="text-gray-700 mb-3">
                        Your Registration ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{confirmationData.registrationId}</span>
                    </p>
                )}
                <p className="text-gray-600 mb-4">
                    A confirmation email has been sent to your registered email address.
                </p>
                {confirmationData?.downloadContent && (
                    <button
                        onClick={handleDownload}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                    >
                        Download Confirmation
                    </button>
                )}
            </div>
        </CustomModal>
    );
};

// --- Create Event Page Component ---
const CreateEventPage = ({ addEvent, currentUserId, setMessage, setMessageType }) => {
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('online');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [eventPrice, setEventPrice] = useState(0);
    const [registrationFields, setRegistrationFields] = useState([
        { name: 'fullName', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
    ]);
    const [loading, setLoading] = useState(false);

    const addField = () => {
        setRegistrationFields([...registrationFields, { name: '', label: '', type: 'text', required: false }]);
    };

    const updateField = (index, key, value) => {
        const newFields = [...registrationFields];
        newFields[index][key] = value;
        setRegistrationFields(newFields);
    };

    const removeField = (index) => {
        const newFields = registrationFields.filter((_, i) => i !== index);
        setRegistrationFields(newFields);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const parsedPrice = parseFloat(eventPrice);
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

        const newEvent = {
            id: `e${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, // Simple unique ID
            name: eventName,
            type: eventType,
            date: eventDate,
            time: eventTime,
            location: eventLocation,
            description: eventDescription,
            isPaid: isPaid,
            price: isPaid ? parsedPrice : 0,
            creatorId: currentUserId, // Or a dummy creator ID
            registrationFields: registrationFields,
            createdAt: new Date(),
        };

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
                            onChange={(e) => setEventType(e.target.value)}
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
                        rows="4"
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
                                onChange={(e) => setEventPrice(e.target.value)}
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
                                        onChange={(e) => updateField(index, 'type', e.target.value)}
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
                                {index > 1 && (
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

// --- My Registrations Page Component ---
const MyRegistrationsPage = ({ registrations, currentUserId }) => {
    const handleDownloadConfirmation = (registration) => {
        const formData = JSON.parse(registration.formData);
        const confirmationText = `
            Registration Confirmed for: ${registration.eventName}
            Registration ID: ${registration.id}
            Status: ${registration.status}
            Registered At: ${new Date(registration.registeredAt).toLocaleString()}

            Submitted Details:
            ${Object.entries(formData).map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}

            ${registration.confirmationData?.joinLink ? 'Join Link: ' + registration.confirmationData.joinLink : ''}

            Thank you!
        `;

        const element = document.createElement('a');
        const file = new Blob([confirmationText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `registration_${registration.eventName.replace(/\s/g, '_')}_${registration.id}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const userRegistrations = registrations.filter(reg => reg.userId === currentUserId);

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">My Event Registrations</h1>

            {userRegistrations.length === 0 ? (
                <p className="text-center text-lg text-gray-500">You haven't registered for any events yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {userRegistrations.map((reg) => (
                        <div key={reg.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h3 className="text-2xl font-bold mb-2">{reg.eventName}</h3>
                            <p className="text-sm text-gray-600 mb-2">Registration ID: <span className="font-mono">{reg.id}</span></p>
                            <p className="text-sm text-gray-600 mb-2">Status: <span className={`font-semibold ${reg.status === 'confirmed' || reg.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{reg.status.toUpperCase()}</span></p>
                            {reg.registeredAt && (
                                <p className="text-sm text-gray-600 mb-4">
                                    Registered On: {new Date(reg.registeredAt).toLocaleString()}
                                </p>
                            )}
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Your Details:</h4>
                            <ul className="list-disc list-inside text-gray-700 mb-4">
                                {reg.formData && Object.entries(JSON.parse(reg.formData)).map(([key, value]) => (
                                    <li key={key}><strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}</li>
                                ))}
                            </ul>
                            {reg.status === 'confirmed' || reg.status === 'paid' ? (
                                <button
                                    onClick={() => handleDownloadConfirmation(reg)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                                >
                                    Download Confirmation
                                </button>
                            ) : (
                                <p className="text-yellow-600 font-medium">Payment pending or awaiting confirmation.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Main Page Component ---
export default function Page() {
    const [currentPath, setCurrentPath] = useState('/dashboard/events'); // Default to events page
    const [events, setEvents] = useState(DUMMY_EVENTS);
    const [registrations, setRegistrations] = useState(DUMMY_REGISTRATIONS);
    const [feedbacks, setFeedbacks] = useState(DUMMY_FEEDBACKS);
    const [queries, setQueries] = useState(DUMMY_QUERIES);
    const [currentUserId, setCurrentUserId] = useState('user-123'); // Simulate a user ID
    const [message, setMessage] = useState(null); // For success/error messages
    const [messageType, setMessageType] = useState('');
    const [selectedEventId, setSelectedEventId] = useState(null); // State to hold the ID of the event being viewed/registered

    // Function to add a new event to our dummy data
    const addEvent = (newEvent) => {
        setEvents(prevEvents => [...prevEvents, newEvent]);
    };

    // Function to add a new registration to our dummy data
    const addRegistration = (newRegistration) => {
        setRegistrations(prevRegistrations => [...prevRegistrations, newRegistration]);
    };

    // Function to add new feedback
    const addFeedback = (eventId, userId, username, comment) => {
        const newFeedback = {
            id: `f${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            eventId,
            userId,
            username,
            comment,
            createdAt: new Date(),
        };
        setFeedbacks(prev => [...prev, newFeedback]);
        setMessage("Feedback submitted successfully!", 'success');
        setMessageType('success');
    };

    // Function to add new query
    const addQuery = (eventId, userId, username, queryText) => {
        const newQuery = {
            id: `q${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            eventId,
            userId,
            username,
            query: queryText,
            createdAt: new Date(),
            answers: [],
        };
        setQueries(prev => [...prev, newQuery]);
        setMessage("Query submitted successfully!", 'success');
        setMessageType('success');
    };

    // Function to add answer to a query
    const addAnswerToQuery = (queryId, userId, username, answerText) => {
        setQueries(prevQueries => prevQueries.map(q =>
            q.id === queryId
                ? {
                    ...q,
                    answers: [...q.answers, {
                        id: `a${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        userId,
                        username,
                        answer: answerText,
                        createdAt: new Date(),
                    }]
                }
                : q
        ));
        setMessage("Answer submitted successfully!", 'success');
        setMessageType('success');
    };


    // Simple client-side routing logic
    const navigate = useCallback((path, eventId = null) => {
        setCurrentPath(path);
        setSelectedEventId(eventId);
        // In a real Next.js app, you'd use router.push(path)
    }, []);

    const handleShowDetails = useCallback((eventId) => {
        navigate(`/dashboard/event-details/${eventId}`, eventId);
    }, [navigate]);

    const handleRegister = useCallback((eventId) => {
        navigate(`/dashboard/register/${eventId}`, eventId);
    }, [navigate]);

    const currentEvent = selectedEventId ? events.find(event => event.id === selectedEventId) : null;

    return (
        <div className="flex min-h-screen w-full text-gray-900 font-sans antialiased">
            {message && <MessageCard message={message} type={messageType} onClose={() => setMessage(null)} />}

            {/* Sidebar */}
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

            {/* Main Content Area */}
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
                    {/* Fallback for unmapped paths */}
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