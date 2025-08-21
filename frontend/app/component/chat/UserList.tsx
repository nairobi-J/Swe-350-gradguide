// app/components/UserList.tsx

'use client';
import { useEffect, useState } from 'react';

interface User {
    id: string;
    first_name: string;
    last_name: string;
}
const AZURE_BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL
export default function UserList({ onSelectUser, selectedUser }: { onSelectUser: (user: User) => void; selectedUser: User | null }) {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${AZURE_BACKEND_URL}/auth/getUsers`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data: User[] = await res.json();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="w-half h-full p-4 overflow-y-auto bg-gray-50 border-r border-gray-200 shadow-md rounded-l-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Users</h2>
            <ul className="space-y-2">
                {users.map(user => (
                    <li 
                        key={user.id}
                        onClick={() => onSelectUser(user)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 
                            ${selectedUser?.id === user.id ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
                    >
                        <div className="w-10 h-10 bg-blue-500 text-white font-semibold rounded-full flex items-center justify-center mr-3">
                            {getInitials(user.first_name, user.last_name)}
                        </div>
                        <div className="flex-grow">
                            <p className="font-medium text-gray-900">{user.first_name}_{user.last_name}_{user.id}</p>
                            {/* You could add a last message snippet here */}
                            {/* <p className="text-sm text-gray-500 truncate">Last message...</p> */}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}