"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, PieChart, User } from 'lucide-react';

const BottomNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Calendar, label: 'Monthly', path: '/monthly' },
    { icon: PieChart, label: 'Stats', path: '#' },
    { icon: User, label: 'Profile', path: '#' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 p-2">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className={`flex flex-col items-center p-2 ${
              pathname === item.path ? 'text-blue-500' : 'text-white'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;