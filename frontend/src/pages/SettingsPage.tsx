import React from 'react';
import { MessageSquareText, Smartphone, Info, Menu } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const SettingsPage: React.FC = () => {
  const { 
    smsPermissionGranted,
    setSmsPermissionGranted,
    addPendingSmsTransaction,
    setSidebarOpen
  } = useApp();

  return (
    <div className="p-4 space-y-6 min-h-screen">
      {/* Page Header */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f1f1f1] mb-2">
            Settings
          </h1>
          <p className="text-[#a1a1aa] text-sm sm:text-base">App configuration and system settings</p>
        </div>
      </div>

        {/* SMS Tracking Settings */}
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">SMS Tracking</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquareText size={20} className="text-[#00FFD1]" />
                <div>
                  <span className="text-[#f1f1f1] font-medium">Auto SMS Logging</span>
                  <p className="text-sm text-[#a1a1aa]">Automatically detect and log transactions from SMS</p>
                </div>
              </div>
              <button
                onClick={() => setSmsPermissionGranted(!smsPermissionGranted)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  smsPermissionGranted ? 'bg-gradient-to-r from-[#00FFD1] to-[#667eea]' : 'bg-[#3d3d42]'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  smsPermissionGranted ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            {smsPermissionGranted && (
              <div className="glass p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone size={16} className="text-[#00FFD1]" />
                  <span className="text-sm font-medium text-[#f1f1f1]">SMS Monitoring Active</span>
                </div>
                <p className="text-xs text-[#a1a1aa]">
                  Only transaction SMS from banks are processed. All data stays on your device.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">System Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#a1a1aa]">App Version</span>
              <span className="text-[#f1f1f1]">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a1a1aa]">Build</span>
              <span className="text-[#f1f1f1]">2025.01.21</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a1a1aa]">Environment</span>
              <span className="text-[#f1f1f1]">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a1a1aa]">Platform</span>
              <span className="text-[#f1f1f1]">Web</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a1a1aa]">Last Updated</span>
              <span className="text-[#f1f1f1]">Today</span>
            </div>
          </div>
        </div>

        {/* About LogUp */}
        <div className="glass-card p-4 sm:p-6 rounded-2xl border border-[#00FFD1] border-opacity-30">
          <div className="flex items-center gap-3 mb-3">
            <Info size={20} className="text-[#00FFD1]" />
            <h3 className="text-lg font-semibold text-[#00FFD1]">About LogUp</h3>
          </div>
          <p className="text-[#f1f1f1] text-sm leading-relaxed mb-4">
            LogUp helps you own your financial sh!t with AI-powered insights and real talk about your spending habits. 
            Built for mobile-first experience with true dark mode and no BS.
          </p>
          <div className="space-y-2 text-xs text-[#a1a1aa]">
            <p>• Smart expense tracking with natural language processing</p>
            <p>• Automated SMS transaction detection and categorization</p>
            <p>• AI-powered financial insights and personalized recommendations</p>
            <p>• Privacy-first design with local data processing</p>
            <p>• Modern, responsive interface optimized for mobile devices</p>
          </div>
        </div>

        {/* Legal & Support */}
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">Legal & Support</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 glass hover:glass-card text-[#f1f1f1] rounded-lg transition-all duration-300">
              <span>Privacy Policy</span>
              <span className="text-[#a1a1aa]">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 glass hover:glass-card text-[#f1f1f1] rounded-lg transition-all duration-300">
              <span>Terms of Service</span>
              <span className="text-[#a1a1aa]">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 glass hover:glass-card text-[#f1f1f1] rounded-lg transition-all duration-300">
              <span>Contact Support</span>
              <span className="text-[#a1a1aa]">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 glass hover:glass-card text-[#f1f1f1] rounded-lg transition-all duration-300">
              <span>Report a Bug</span>
              <span className="text-[#a1a1aa]">→</span>
            </button>
          </div>
        </div>
    </div>
  );
};

export default SettingsPage;