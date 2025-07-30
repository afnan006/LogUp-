import React from 'react';
import { X, Settings, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface WidgetManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WidgetManager: React.FC<WidgetManagerProps> = ({ isOpen, onClose }) => {
  const { dashboardWidgets, toggleWidget } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto animate-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#26262a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center">
              <Settings size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#f1f1f1]">Manage Widgets</h3>
              <p className="text-sm text-[#a1a1aa]">Customize your dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
          >
            <X size={20} className="text-[#a1a1aa]" />
          </button>
        </div>

        {/* Widget List */}
        <div className="p-6">
          <div className="space-y-3">
            {dashboardWidgets
              .sort((a, b) => a.order - b.order)
              .map((widget) => (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-4 glass rounded-xl hover:glass-card transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      widget.enabled ? 'bg-[#10b981]' : 'bg-[#6b7280]'
                    }`} />
                    <div>
                      <h4 className="font-medium text-[#f1f1f1]">{widget.title}</h4>
                      <p className="text-sm text-[#a1a1aa] capitalize">{widget.type.replace('-', ' ')}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleWidget(widget.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      widget.enabled
                        ? 'bg-[#10b981] bg-opacity-20 text-[#10b981] hover:bg-opacity-30'
                        : 'bg-[#6b7280] bg-opacity-20 text-[#6b7280] hover:bg-opacity-30'
                    }`}
                  >
                    {widget.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              ))}
          </div>
          
          <div className="mt-6 p-4 glass rounded-xl border border-[#00FFD1] border-opacity-30">
            <h4 className="font-semibold text-[#00FFD1] mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-[#a1a1aa]">
              Drag widgets on the dashboard to reorder them. Disabled widgets won't appear on your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetManager;