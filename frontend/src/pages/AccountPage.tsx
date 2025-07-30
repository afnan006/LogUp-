import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Key, 
  Copy, 
  LogOut, 
  Trash2, 
  Check, 
  Shield, 
  Link as LinkIcon,
  Settings,
  Download,
  RotateCcw,
  Volume2,
  VolumeX,
  Code,
  Menu,
  Edit3,
  Save,
  X,
  Smartphone,
  Bell,
  Palette
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    showToast, 
    setSidebarOpen,
    botTone,
    setBotTone,
    developerMode,
    setDeveloperMode,
    addPendingSmsTransaction
  } = useApp();
  
  const [name, setName] = useState(user?.displayName || 'John Doe');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [notificationSound, setNotificationSound] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      showToast('Failed to copy', 'error');
    }
  };

  const handleSaveName = () => {
    setName(tempName);
    setIsEditingName(false);
    showToast('Profile updated!', 'success');
  };

  const handleCancelEdit = () => {
    setTempName(name);
    setIsEditingName(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteAccount = () => {
    console.log('Delete account requested');
    setShowDeleteConfirm(false);
    showToast('Account deletion requested', 'info');
  };

  const handleExportMemory = () => {
    const mockMemoryData = {
      expenses: [
        { id: 1, amount: 500, description: 'Coffee', timestamp: '2025-01-01T10:00:00Z' },
        { id: 2, amount: 1200, description: 'Lunch', timestamp: '2025-01-01T13:00:00Z' }
      ],
      savings: [
        { id: 1, amount: 2000, description: 'Emergency fund', timestamp: '2025-01-01T20:00:00Z' }
      ]
    };
    
    const dataStr = JSON.stringify(mockMemoryData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'logup-memory-export.json';
    link.click();
    showToast('Memory exported successfully!', 'success');
  };

  const handleResetEverything = () => {
    if (confirm('Are you sure? This will delete all your data permanently.')) {
      console.log('Resetting all data...');
      showToast('All data has been reset', 'info');
    }
  };

  const simulateNewSmsTransaction = () => {
    const mockTransactions = [
      {
        merchantName: 'Starbucks Coffee',
        amount: 450,
        date: new Date().toISOString(),
        category: 'Food & Dining',
        confidence: 'high' as const,
        originalSms: 'Your HDFC Bank Card ending 1234 has been used for Rs.450.00 at STARBUCKS COFFEE on 21-01-25. Available balance: Rs.15,550.00',
        bankName: 'HDFC Bank',
        transactionType: 'debit' as const,
        accountLast4: '1234'
      }
    ];

    const randomTransaction = mockTransactions[Math.floor(Math.random() * mockTransactions.length)];
    addPendingSmsTransaction(randomTransaction);
    showToast('SMS transaction simulated!', 'success');
  };

  return (
    <div className="p-4 space-y-6 min-h-screen">
      {/* Page Header */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f1f1f1] mb-2">
            Account Settings
          </h1>
          <p className="text-[#a1a1aa] text-sm sm:text-base">Manage your profile and app preferences</p>
        </div>
      </div>

        {/* Profile Section */}
        <div className="glass-card rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#f1f1f1]">Profile Information</h2>
              <p className="text-[#a1a1aa]">Manage your personal details</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Display Name</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="flex-1 p-3 input-field"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveName}
                        className="flex-1 sm:flex-none p-3 btn-gradient rounded-lg text-white"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 sm:flex-none p-3 glass rounded-lg hover:glass-card transition-all duration-300"
                      >
                        <X size={16} className="text-[#a1a1aa]" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 p-3 glass rounded-lg text-[#f1f1f1]">
                      {name}
                    </div>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="w-full sm:w-auto p-3 glass rounded-lg hover:glass-card transition-all duration-300"
                    >
                      <Edit3 size={16} className="text-[#a1a1aa]" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Email Address</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 glass rounded-lg text-[#f1f1f1] bg-opacity-50">
                  {user?.email || 'user@example.com'}
                </div>
                <Mail size={20} className="text-[#a1a1aa]" />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Phone Number</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 glass rounded-lg text-[#f1f1f1] bg-opacity-50">
                  {user?.phoneNumber || '+91 9876543210'}
                </div>
                <Phone size={20} className="text-[#a1a1aa]" />
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="glass-card rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={20} className="text-[#00FFD1]" />
            <h3 className="text-lg font-semibold text-[#f1f1f1]">Security</h3>
          </div>
          
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-3 glass rounded-lg hover:glass-card transition-all duration-300">
              <div className="flex items-center gap-3">
                <Key size={20} className="text-[#f59e0b]" />
                <span className="text-[#f1f1f1] font-medium">Change Password</span>
              </div>
              <span className="text-[#a1a1aa]">→</span>
            </button>
            
            <div className="flex items-center justify-between p-3 glass rounded-lg">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-[#10b981]" />
                <div>
                  <span className="text-[#f1f1f1] font-medium">Two-Factor Authentication</span>
                  <p className="text-sm text-[#a1a1aa]">Add an extra layer of security</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  twoFactorEnabled ? 'bg-gradient-to-r from-[#00FFD1] to-[#667eea]' : 'bg-[#3d3d42]'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="glass p-3 rounded-lg">
              <h4 className="font-medium text-[#f1f1f1] mb-2">Linked Accounts</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LinkIcon size={16} className="text-[#10b981]" />
                    <span className="text-sm text-[#f1f1f1]">Google</span>
                  </div>
                  <span className="text-xs text-[#10b981]">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LinkIcon size={16} className="text-[#a1a1aa]" />
                    <span className="text-sm text-[#f1f1f1]">Apple</span>
                  </div>
                  <span className="text-xs text-[#a1a1aa]">Not Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="glass-card rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Palette size={20} className="text-[#667eea]" />
            <h3 className="text-lg font-semibold text-[#f1f1f1]">App Preferences</h3>
          </div>
          
          <div className="space-y-4">
            {/* Bot Personality */}
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-3">Bot Personality</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {[
                  { key: 'chill', label: 'Chill', emoji: '😎', gradient: 'from-[#43e97b] to-[#38f9d7]' },
                  { key: 'nerdy', label: 'Nerdy', emoji: '🤓', gradient: 'from-[#667eea] to-[#764ba2]' },
                  { key: 'sarcastic', label: 'Sarcastic', emoji: '😏', gradient: 'from-[#f093fb] to-[#f5576c]' }
                ].map(({ key, label, emoji, gradient }) => (
                  <button
                    key={key}
                    onClick={() => setBotTone(key as any)}
                    className={`p-3 sm:p-4 rounded-xl text-center transition-all duration-300 ${
                      botTone === key
                        ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                        : 'glass hover:glass-card text-[#a1a1aa] hover:text-[#f1f1f1]'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl mb-1">{emoji}</div>
                    <div className="text-xs sm:text-sm font-medium">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Sound */}
            <div className="flex items-center justify-between p-3 glass rounded-lg">
              <div className="flex items-center gap-3">
                {notificationSound ? <Volume2 size={20} className="text-[#00FFD1]" /> : <VolumeX size={20} className="text-[#a1a1aa]" />}
                <div>
                  <span className="text-[#f1f1f1] font-medium">Notification Sound</span>
                  <p className="text-sm text-[#a1a1aa]">Play sound for notifications</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationSound(!notificationSound)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  notificationSound ? 'bg-gradient-to-r from-[#00FFD1] to-[#667eea]' : 'bg-[#3d3d42]'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  notificationSound ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Developer Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 glass rounded-lg">
                <div className="flex items-center gap-3">
                  <Code size={20} className="text-[#00FFD1]" />
                  <div>
                    <span className="text-[#f1f1f1] font-medium">Developer Mode</span>
                    <p className="text-sm text-[#a1a1aa]">Show debug information</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeveloperMode(!developerMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    developerMode ? 'bg-gradient-to-r from-[#00FFD1] to-[#667eea]' : 'bg-[#3d3d42]'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    developerMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              {developerMode && (
                <div className="glass p-3 rounded-lg">
                  <p className="text-sm text-[#a1a1aa] mb-3">
                    Developer mode enables memory JSON previews, prompt traces, and debug information in chat.
                  </p>
                  <button
                    onClick={simulateNewSmsTransaction}
                    className="w-full btn-gradient py-2 px-4 rounded-lg font-medium text-white"
                  >
                    Simulate SMS Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-card rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Settings size={20} className="text-[#f59e0b]" />
            <h3 className="text-lg font-semibold text-[#f1f1f1]">Data Management</h3>
          </div>
          
          <div className="space-y-3">
            {/* Account Identifiers */}
            <div className="glass p-4 rounded-xl">
              <h4 className="font-medium text-[#f1f1f1] mb-3">Account Identifiers</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Firebase UID</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-3 glass rounded-lg text-[#a1a1aa] text-sm font-mono">
                      {user?.uid || 'firebase-uid-12345'}
                    </div>
                    <button
                      onClick={() => copyToClipboard(user?.uid || 'firebase-uid-12345', 'uid')}
                      className="p-2 glass rounded-lg hover:glass-card transition-all duration-300"
                    >
                      {copiedField === 'uid' ? (
                        <Check size={16} className="text-[#10b981]" />
                      ) : (
                        <Copy size={16} className="text-[#a1a1aa]" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Backend UUID</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-3 glass rounded-lg text-[#a1a1aa] text-sm font-mono">
                      backend-uuid-67890
                    </div>
                    <button
                      onClick={() => copyToClipboard('backend-uuid-67890', 'backend')}
                      className="p-2 glass rounded-lg hover:glass-card transition-all duration-300"
                    >
                      {copiedField === 'backend' ? (
                        <Check size={16} className="text-[#10b981]" />
                      ) : (
                        <Copy size={16} className="text-[#a1a1aa]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportMemory}
              className="w-full flex items-center gap-3 p-3 glass hover:glass-card text-[#f1f1f1] rounded-lg transition-all duration-300"
            >
              <Download size={20} />
              <span>Export Memory as JSON</span>
            </button>
            
            <button
              onClick={handleResetEverything}
              className="w-full flex items-center gap-3 p-3 bg-[#ef4444] bg-opacity-20 hover:bg-opacity-30 text-[#ef4444] rounded-lg transition-colors border border-[#ef4444] border-opacity-30"
            >
              <RotateCcw size={20} />
              <span>Reset Everything</span>
            </button>
          </div>
        </div>

        {/* More Settings Link */}
        <div className="glass-card rounded-2xl">
          <Link
            to="/settings"
            className="flex items-center justify-between p-4 hover:glass-card transition-all duration-300 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-[#667eea]" />
              <div>
                <span className="text-[#f1f1f1] font-medium">More Settings</span>
                <p className="text-sm text-[#a1a1aa]">SMS tracking, system info, and more</p>
              </div>
            </div>
            <span className="text-[#a1a1aa]">→</span>
          </Link>
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 sm:p-4 glass hover:glass-card text-[#f1f1f1] rounded-xl transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-3 p-3 sm:p-4 bg-[#ef4444] bg-opacity-20 hover:bg-opacity-30 text-[#ef4444] rounded-xl transition-colors border border-[#ef4444] border-opacity-30"
          >
            <Trash2 size={20} />
            <span className="font-medium">Delete Account</span>
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-sm w-full animate-in">
              <h3 className="text-xl font-bold text-[#f1f1f1] mb-4">Delete Account</h3>
              <p className="text-[#a1a1aa] mb-6">
                Are you sure? This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 p-3 glass text-[#f1f1f1] rounded-lg hover:glass-card transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 p-3 bg-[#ef4444] text-white rounded-lg hover:bg-[#dc2626] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AccountPage;