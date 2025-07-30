import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import Toast from './Toast';
import NotificationModal from './NotificationModal';
import SmsPermissionModal from './SmsPermissionModal';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen, setSidebarOpen, toasts, removeToast, totalNotifications } = useApp();
  const location = useLocation();
  const isQuickEntryPage = location.pathname === '/';
  const isChatPage = location.pathname === '/chat';
  const isDashboardPage = location.pathname === '/dashboard';
  const isGoalsPage = location.pathname === '/goals';
  
  const [showNotificationsModal, setShowNotificationsModal] = React.useState(false);
  
  // Format combined date and time as "Wed, 9 Jul 01:31 PM"
  const formatDateTime = () => {
    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    const time = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${weekday}, ${day} ${month} ${time}`;
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] relative md:pl-80">
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        {!isQuickEntryPage && !isChatPage && !isGoalsPage && (
          isDashboardPage ? (
            <Header 
              title="Dashboard"
              subtitle="Your complete financial overview"
              rightContent={
                <div className="flex items-center gap-4">
                  {/* Notifications Bell - Properly positioned on the left */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotificationsModal(true)}
                      className="p-3 glass rounded-xl hover:glass-card transition-all duration-300"
                    >
                      <Bell size={20} className={totalNotifications > 0 ? "text-[#f59e0b]" : "text-[#a1a1aa]"} />
                    </button>
                    {totalNotifications > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ef4444] rounded-full flex items-center justify-center pulse-glow">
                        <span className="text-xs font-bold text-white">{totalNotifications}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Single, concise date/time display */}
                  <div className="text-right">
                    <p className="text-sm text-[#a1a1aa]">Today</p>
                    <p className="text-sm font-semibold text-[#f1f1f1]">{formatDateTime()}</p>
                  </div>
                </div>
              }
            />
          ) : (
            <Header 
              onMenuClick={() => setSidebarOpen(true)}
              rightContent={
                <div className="md:hidden">
                  {/* Mobile menu button is handled in Header component */}
                </div>
              }
            />
          )
        )}
        <main className={`flex-1 ${!isQuickEntryPage && !isChatPage && !isGoalsPage ? 'pb-20 md:pb-4' : ''}`}>
          {children}
        </main>
      </div>
      
      {/* Bottom Navigation for Mobile */}
      {!isChatPage && <BottomNavigation />}
      
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
      
      {/* Notification Modal */}
      <NotificationModal 
        isOpen={showNotificationsModal} 
        onClose={() => setShowNotificationsModal(false)} 
      />
      
      {/* SMS Permission Modal */}
      <SmsPermissionModal />
    </div>
  );
};

export default Layout;