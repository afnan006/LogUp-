import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus,
  MessageCircle, 
  BarChart3,
  Target,
  User,
  Calculator,
  Users,
  X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Plus, label: 'Quick Add', gradient: 'from-[#00FFD1] to-[#667eea]' },
    { to: '/chat', icon: MessageCircle, label: 'Chat', gradient: 'from-[#667eea] to-[#764ba2]' },
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard', gradient: 'from-[#f093fb] to-[#f5576c]' },
    { to: '/goals', icon: Target, label: 'Goals', gradient: 'from-[#43e97b] to-[#38f9d7]' },
    { to: '/friends', icon: Users, label: 'Friends', gradient: 'from-[#667eea] to-[#764ba2]' },
    { to: '/split-expense', icon: Calculator, label: 'Split Expense', gradient: 'from-[#667eea] to-[#764ba2]' },
    { to: '/account', icon: User, label: 'Account', gradient: 'from-[#ffecd2] to-[#fcb69f]' }
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed left-0 top-0 h-full w-80 glass z-50 transform transition-transform duration-300 md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 safe-area-top flex justify-end">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
          >
            <X size={20} className="text-[#a1a1aa]" />
          </button>
        </div>
        
        <nav className="p-4 flex-1">
          <ul className="space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                      isActive 
                        ? 'glass-card text-[#f1f1f1] shadow-lg' 
                        : 'text-[#a1a1aa] hover:text-[#f1f1f1] hover:glass-card'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10`} />
                    )}
                    <div className={`relative z-10 p-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                        : 'group-hover:bg-[#26262a]'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <span className="font-medium relative z-10">{item.label}</span>
                    {isActive && (
                      <div className="absolute right-4 w-2 h-2 bg-[#00FFD1] rounded-full pulse-glow" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Desktop Sidebar - Always Visible */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-80 glass z-40 flex-col">
        <div className="p-4 safe-area-top">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#00FFD1] to-[#667eea] bg-clip-text text-transparent">
                LogUp
              </h1>
              <p className="text-xs text-[#a1a1aa]">Financial AI</p>
            </div>
          </div>
        </div>
        
        <nav className="px-4 flex-1">
          <ul className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                      isActive 
                        ? 'glass-card text-[#f1f1f1] shadow-lg' 
                        : 'text-[#a1a1aa] hover:text-[#f1f1f1] hover:glass-card'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10`} />
                    )}
                    <div className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                        : 'group-hover:bg-[#26262a]'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <span className="font-medium relative z-10 text-sm">{item.label}</span>
                    {isActive && (
                      <div className="absolute right-3 w-2 h-2 bg-[#00FFD1] rounded-full pulse-glow" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-[#26262a]">
          <div className="text-xs text-[#a1a1aa] text-center">
            <p>LogUp v1.0.0</p>
            <p>Own Your Financial Sh!t</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;