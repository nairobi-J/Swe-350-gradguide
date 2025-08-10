// app/chat/[chatId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

interface Message {
    user: string;
    text: string;
    chatId: string;
}

export default function ChatPage({ params }: { params: { chatId: string } }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');

    const { chatId } = params;

    useEffect(() => {
        // Join the specific chat room
        socket.emit('join_room', { chatId });

        // Listen for incoming messages
        socket.on('receive_message', (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Clean up the event listener on unmount
        return () => {
            socket.off('receive_message');
        };
    }, [chatId]);

    const sendMessage = () => {
        if (messageInput.trim()) {
            const messageData = {
                chatId,
                user: 'current-user-id', // Replace with the logged-in user's ID
                text: messageInput
            };

            // Emit the message to the server
            socket.emit('send_message', messageData);
            setMessages((prevMessages) => [...prevMessages, messageData]); // Optimistically add the message to the UI
            setMessageInput('');
        }
    };

    return (
        <div>
            {/* Your chat UI */}
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}