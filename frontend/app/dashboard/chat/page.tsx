// app/page.tsx

'use client';
import { useState } from 'react';
import UserList from '@/app/component/chat/UserList';
//import ChatComponent from '@/app/component/chat/ChatComponent';

interface User {
    id: string;
    name: string;
}

export default function HomePage() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // This is a placeholder for the logged-in user's ID
    const currentUser = "current_user_id";

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <UserList onSelectUser={setSelectedUser} />
            {/* <div style={{ flex: 1, padding: '1rem' }}>
                {selectedUser ? (
                    <ChatComponent currentUser={currentUser} recipientUser={selectedUser} />
                ) : (
                    <p>Select a user to start chatting.</p>
                )}
            </div> */}
        </div>
    );
}