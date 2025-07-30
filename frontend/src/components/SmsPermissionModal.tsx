import React from 'react';
import { MessageSquareText, Shield, Eye, CheckCircle, X, Smartphone } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const SmsPermissionModal: React.FC = () => {
  const { 
    showSmsPermissionModal, 
    setShowSmsPermissionModal, 
    setSmsPermissionGranted 
  } = useApp();

  if (!showSmsPermissionModal) return null;

  const handleGrantPermission = () => {
    setSmsPermissionGranted(true);
    setShowSmsPermissionModal(false);
  };

  const handleContinueManually = () => {
    setSmsPermissionGranted(false);
    setShowSmsPermissionModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto animate-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-xl flex items-center justify-center pulse-glow">
              <MessageSquareText size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#f1f1f1]">Smart SMS Tracking</h3>
              <p className="text-sm text-[#a1a1aa]">Auto-log your expenses</p>
            </div>
          </div>
          <button
            onClick={() => setShowSmsPermissionModal(false)}
            className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
          >
            <X size={20} className="text-[#a1a1aa]" />
          </button>
        </div>

        {/* Benefits */}
        <div className="space-y-4 mb-6">
          <div className="glass p-4 rounded-xl">
            <h4 className="text-lg font-semibold text-[#f1f1f1] mb-3">Why Enable SMS Tracking?</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-[#00FFD1] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[#f1f1f1] font-medium">Automatic Expense Logging</p>
                  <p className="text-sm text-[#a1a1aa]">Never miss a transaction - we'll catch them all</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-[#00FFD1] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[#f1f1f1] font-medium">Smart Categorization</p>
                  <p className="text-sm text-[#a1a1aa]">AI-powered merchant recognition and categorization</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-[#00FFD1] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[#f1f1f1] font-medium">Real-time Insights</p>
                  <p className="text-sm text-[#a1a1aa]">Get instant spending alerts and patterns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="glass p-4 rounded-xl border border-[#00FFD1] border-opacity-30">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-[#00FFD1]" />
              <h4 className="text-lg font-semibold text-[#00FFD1]">Your Privacy Matters</h4>
            </div>
            <div className="space-y-2 text-sm text-[#a1a1aa]">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-[#00FFD1]" />
                <span>Only transaction SMS are processed</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone size={14} className="text-[#00FFD1]" />
                <span>Processing happens locally on your device</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-[#00FFD1]" />
                <span>You review and approve every transaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGrantPermission}
            className="w-full btn-gradient py-4 rounded-xl font-medium text-white flex items-center justify-center gap-3"
          >
            <MessageSquareText size={20} />
            Enable Smart Tracking
          </button>
          
          <button
            onClick={handleContinueManually}
            className="w-full glass p-4 rounded-xl font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300"
          >
            Continue with Manual Entry
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-[#a1a1aa] text-center mt-4">
          You can change this setting anytime in Settings → SMS Tracking
        </p>
      </div>
    </div>
  );
};

export default SmsPermissionModal;