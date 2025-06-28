// frontend/app/component/navigation/SideNavigation.tsx
'use client';
import React from 'react';
import { CalendarDays, User } from 'lucide-react';
import { NavItem } from '../types'; // Import NavItem interface

interface SideNavigationProps {
  currentPath: string;
  navigate: (path: string) => void;
}

const navItems: NavItem[] = [
  { href: '/dashboard/events', label: 'Events', icon: CalendarDays },
  { href: '/dashboard/my-registrations', label: 'My Registrations', icon: User },
  // Add other navigation items here if needed for your app
];

const SideNavigation: React.FC<SideNavigationProps> = ({ currentPath, navigate }) => {
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

export default SideNavigation;