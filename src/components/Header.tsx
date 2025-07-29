import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "LogUp", 
  subtitle = "Financial AI", 
  rightContent,
  onMenuClick 
}) => {
  return (
    <header className="flex items-center justify-between p-4 glass border-b border-[#26262a] safe-area-top backdrop-blur-20">
      {/* Left - Menu button or spacer */}
      <div className="w-12 flex justify-start">
        {onMenuClick ? (
          <button
            onClick={onMenuClick}
            className="p-3 rounded-xl hover:glass-card transition-all duration-300 group md:hidden"
          >
            <Menu size={24} className="text-[#f1f1f1] group-hover:text-[#00FFD1] transition-colors" />
          </button>
        ) : (
          <div className="w-12" /> // Spacer for balance
        )}
      </div>
      
      {/* Center - Title and subtitle */}
      <div className="flex-1 text-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#00FFD1] to-[#667eea] bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-xs text-[#a1a1aa] -mt-1">{subtitle}</p>
      </div>
      
      {/* Right - Content or spacer */}
      <div className="w-auto flex justify-end">
        {rightContent || <div className="w-12" />}
      </div>
    </header>
  );
};

export default Header;