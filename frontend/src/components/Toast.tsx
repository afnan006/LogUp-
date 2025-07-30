import React, { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-[#10b981]" />;
      case 'error': return <X size={20} className="text-[#ef4444]" />;
      case 'warning': return <AlertCircle size={20} className="text-[#f59e0b]" />;
      case 'info': return <Info size={20} className="text-[#00FFD1]" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'border-l-[#10b981]';
      case 'error': return 'border-l-[#ef4444]';
      case 'warning': return 'border-l-[#f59e0b]';
      case 'info': return 'border-l-[#00FFD1]';
    }
  };

  return (
    <div className={`toast border-l-4 ${getBorderColor()}`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className="text-sm font-medium text-[#f1f1f1]">{message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[#26262a] transition-colors ml-auto"
        >
          <X size={16} className="text-[#a1a1aa]" />
        </button>
      </div>
    </div>
  );
};

export default Toast;