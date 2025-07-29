import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, MessageCircle, BarChart3, Users, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Plus, label: 'Quick Add' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/friends', icon: Users, label: 'Friends' },
    { to: '/account', icon: User, label: 'Account' }
  ];

  return (
    <nav className="bottom-nav md:hidden safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'text-[#00FFD1]' 
                  : 'text-[#a1a1aa] hover:text-[#f1f1f1]'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-[#00FFD1] bg-opacity-20' 
                  : 'hover:bg-[#26262a]'
              }`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;