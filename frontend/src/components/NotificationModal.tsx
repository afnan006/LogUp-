import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, MessageSquareText, Camera, Bell, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Link } from 'react-router-dom';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const {
    activeNudges,
    dismissNudge,
    pendingSmsTransactions,
    pendingReceiptTransactions,
    confirmSmsTransaction,
    ignoreSmsTransaction,
    confirmReceiptTransaction,
    ignoreReceiptTransaction,
    totalNotifications
  } = useApp();

  const [ignoreReasons, setIgnoreReasons] = useState<{ [key: string]: string }>({});
  const [showReasonInput, setShowReasonInput] = useState<{ [key: string]: boolean }>({});

  if (!isOpen) return null;

  const handleIgnoreWithReason = (id: string, type: 'sms' | 'receipt') => {
    const reason = ignoreReasons[id] || 'No reason provided';
    
    if (type === 'sms') {
      ignoreSmsTransaction(id);
    } else {
      ignoreReceiptTransaction(id);
    }
    
    // Clear the reason and hide input
    setIgnoreReasons(prev => ({ ...prev, [id]: '' }));
    setShowReasonInput(prev => ({ ...prev, [id]: false }));
  };

  const toggleReasonInput = (id: string) => {
    setShowReasonInput(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#26262a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-xl flex items-center justify-center">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#f1f1f1]">Notifications</h3>
              <p className="text-sm text-[#a1a1aa]">
                {totalNotifications} notification{totalNotifications !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
          >
            <X size={20} className="text-[#a1a1aa]" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh]">
          {totalNotifications === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-2xl flex items-center justify-center">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h4 className="text-lg font-semibold text-[#f1f1f1] mb-2">All Caught Up!</h4>
              <p className="text-[#a1a1aa]">No new notifications at the moment.</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* SMS Transactions */}
              {pendingSmsTransactions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareText size={16} className="text-[#00FFD1]" />
                    <h4 className="font-semibold text-[#f1f1f1]">SMS Transactions ({pendingSmsTransactions.length})</h4>
                  </div>
                  <div className="space-y-3">
                    {pendingSmsTransactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="glass p-4 rounded-xl">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-medium text-[#f1f1f1]">{transaction.merchantName}</h5>
                            <p className="text-sm text-[#a1a1aa]">₹{transaction.amount.toLocaleString()}</p>
                            <p className="text-xs text-[#a1a1aa]">{transaction.bankName}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.confidence === 'high' ? 'bg-[#10b981] bg-opacity-20 text-[#10b981]' :
                            transaction.confidence === 'medium' ? 'bg-[#f59e0b] bg-opacity-20 text-[#f59e0b]' :
                            'bg-[#ef4444] bg-opacity-20 text-[#ef4444]'
                          }`}>
                            {transaction.confidence} confidence
                          </span>
                        </div>
                        
                        {showReasonInput[transaction.id] ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Enter reason for ignoring..."
                              value={ignoreReasons[transaction.id] || ''}
                              onChange={(e) => setIgnoreReasons(prev => ({ ...prev, [transaction.id]: e.target.value }))}
                              className="w-full p-2 input-field text-sm"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleIgnoreWithReason(transaction.id, 'sms')}
                                className="flex-1 bg-[#ef4444] bg-opacity-20 text-[#ef4444] py-2 px-3 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors"
                              >
                                Confirm Ignore
                              </button>
                              <button
                                onClick={() => toggleReasonInput(transaction.id)}
                                className="px-3 py-2 glass rounded-lg text-sm font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => confirmSmsTransaction(transaction.id)}
                              className="flex-1 btn-gradient py-2 px-3 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-1"
                            >
                              <CheckCircle size={14} />
                              Confirm
                            </button>
                            <button
                              onClick={() => toggleReasonInput(transaction.id)}
                              className="flex-1 bg-[#ef4444] bg-opacity-20 text-[#ef4444] py-2 px-3 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors flex items-center justify-center gap-1"
                            >
                              <X size={14} />
                              Ignore
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {pendingSmsTransactions.length > 3 && (
                      <Link
                        to="/sms-review"
                        onClick={onClose}
                        className="block text-center p-3 glass rounded-lg hover:glass-card transition-all duration-300 text-[#00FFD1] font-medium"
                      >
                        View All {pendingSmsTransactions.length} SMS Transactions →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Receipt Transactions */}
              {pendingReceiptTransactions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Camera size={16} className="text-[#667eea]" />
                    <h4 className="font-semibold text-[#f1f1f1]">Receipt Scans ({pendingReceiptTransactions.length})</h4>
                  </div>
                  <div className="space-y-3">
                    {pendingReceiptTransactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="glass p-4 rounded-xl">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-medium text-[#f1f1f1]">{transaction.merchantName}</h5>
                            <p className="text-sm text-[#a1a1aa]">₹{transaction.amount.toLocaleString()}</p>
                            <p className="text-xs text-[#a1a1aa]">{transaction.category}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.confidence === 'high' ? 'bg-[#10b981] bg-opacity-20 text-[#10b981]' :
                            transaction.confidence === 'medium' ? 'bg-[#f59e0b] bg-opacity-20 text-[#f59e0b]' :
                            'bg-[#ef4444] bg-opacity-20 text-[#ef4444]'
                          }`}>
                            {transaction.confidence} confidence
                          </span>
                        </div>
                        
                        {showReasonInput[transaction.id] ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Enter reason for ignoring..."
                              value={ignoreReasons[transaction.id] || ''}
                              onChange={(e) => setIgnoreReasons(prev => ({ ...prev, [transaction.id]: e.target.value }))}
                              className="w-full p-2 input-field text-sm"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleIgnoreWithReason(transaction.id, 'receipt')}
                                className="flex-1 bg-[#ef4444] bg-opacity-20 text-[#ef4444] py-2 px-3 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors"
                              >
                                Confirm Ignore
                              </button>
                              <button
                                onClick={() => toggleReasonInput(transaction.id)}
                                className="px-3 py-2 glass rounded-lg text-sm font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => confirmReceiptTransaction(transaction.id)}
                              className="flex-1 btn-gradient py-2 px-3 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-1"
                            >
                              <CheckCircle size={14} />
                              Confirm
                            </button>
                            <button
                              onClick={() => toggleReasonInput(transaction.id)}
                              className="flex-1 bg-[#ef4444] bg-opacity-20 text-[#ef4444] py-2 px-3 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors flex items-center justify-center gap-1"
                            >
                              <X size={14} />
                              Ignore
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Nudges */}
              {activeNudges.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={16} className="text-[#f59e0b]" />
                    <h4 className="font-semibold text-[#f1f1f1]">Smart Insights ({activeNudges.length})</h4>
                  </div>
                  <div className="space-y-3">
                    {activeNudges.map((nudge) => (
                      <div key={nudge.id} className={`glass p-4 rounded-xl border-l-4 ${
                        nudge.priority === 'high' ? 'border-[#ef4444]' : 
                        nudge.priority === 'medium' ? 'border-[#f59e0b]' : 'border-[#00FFD1]'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-[#f1f1f1] font-medium mb-2">{nudge.message}</p>
                            <div className="flex gap-2">
                              {nudge.actionLink && (
                                <Link
                                  to={nudge.actionLink}
                                  onClick={onClose}
                                  className="text-sm text-[#00FFD1] hover:text-[#667eea] transition-colors font-medium"
                                >
                                  Take Action →
                                </Link>
                              )}
                              <button
                                onClick={() => dismissNudge(nudge.id)}
                                className="text-sm text-[#a1a1aa] hover:text-[#f1f1f1] transition-colors"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                            nudge.priority === 'high' ? 'bg-[#ef4444]' : 
                            nudge.priority === 'medium' ? 'bg-[#f59e0b]' : 'bg-[#00FFD1]'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;