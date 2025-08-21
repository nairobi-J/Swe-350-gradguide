// // app/components/ChatComponent.tsx

// 'use client';
// import { useEffect, useState } from 'react';
// import { socket } from '@/lib/socket';

// interface User {
//     id: string;
//     name: string;
// }

// interface Message {
//     user: string;
//     text: string;
//     chatId: string;
// }

// export default function ChatComponent({ currentUser, recipientUser }: { currentUser: string; recipientUser: User }) {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [messageInput, setMessageInput] = useState('');

//     if (!currentUser || !recipientUser?.id) {
//         return <div>Loading chat...</div>;
//     }
    
//     // Generate a consistent chat room ID for a private chat
//     const sortedUserIds = [currentUser, recipientUser.id].sort();
//     const chatId = `${sortedUserIds[0]}-${sortedUserIds[1]}`;

//     useEffect(() => {
//         // Join the specific chat room
//         socket.emit('join_room', { chatId });

//         // Listen for incoming messages
//         socket.on('receive_message', (data: Message) => {
//             setMessages((prevMessages) => [...prevMessages, data]);
//         });

//         return () => {
//             socket.off('receive_message');
//         };
//     }, [chatId]);

//     const sendMessage = () => {
//         if (messageInput.trim()) {
//             const messageData = {
//                 chatId,
//                 user: currentUser,
//                 text: messageInput
//             };
//             socket.emit('send_message', messageData);
//             setMessages((prevMessages) => [...prevMessages, messageData]);
//             setMessageInput('');
//         }
//     };

//     return (
//         <div>
//             <h2 style={{ fontSize: '1.25rem' }}>Chat with {recipientUser.name}</h2>
//             <div style={{ border: '1px solid #ccc', height: '400px', overflowY: 'scroll', padding: '1rem' }}>
//                 {messages.map((msg, index) => (
//                     <div key={index}><strong>{msg.user}:</strong> {msg.text}</div>
//                 ))}
//             </div>
//             <div style={{ marginTop: '1rem', display: 'flex' }}>
//                 <input 
//                     value={messageInput} 
//                     onChange={(e) => setMessageInput(e.target.value)} 
//                     onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                     style={{ flex: 1, padding: '0.5rem' }}
//                 />
//                 <button onClick={sendMessage} style={{ padding: '0.5rem 1rem' }}>Send</button>
//             </div>
//         </div>
//     );
// }