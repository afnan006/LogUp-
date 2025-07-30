import React from 'react';
import { MessageSquareText, CheckCircle, X, AlertCircle, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import SmsTransactionCard from '../components/SmsTransactionCard';

const SmsReviewPage: React.FC = () => {
  const { 
    pendingSmsTransactions, 
    confirmSmsTransaction, 
    ignoreSmsTransaction,
    smsPermissionGranted 
  } = useApp();

  const handleConfirmAll = () => {
    pendingSmsTransactions.forEach(transaction => {
      confirmSmsTransaction(transaction.id);
    });
  };

  const handleIgnoreAll = () => {
    pendingSmsTransactions.forEach(transaction => {
      ignoreSmsTransaction(transaction.id);
    });
  };

  if (!smsPermissionGranted) {
    return (
      <div className="p-4 min-h-screen flex items-center justify-center">
        <div className="glass-card max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center">
            <Smartphone size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#f1f1f1] mb-2">SMS Tracking Disabled</h2>
          <p className="text-[#a1a1aa] mb-4">
            Enable SMS tracking in Settings to automatically log your transactions.
          </p>
          <Link 
            to="/settings"
            className="btn-gradient py-3 px-6 rounded-xl font-medium text-white inline-flex items-center gap-2"
          >
            Go to Settings
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 min-h-screen">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-xl flex items-center justify-center">
              <MessageSquareText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#f1f1f1]">SMS Review</h1>
              <p className="text-[#a1a1aa]">
                {pendingSmsTransactions.length} transaction{pendingSmsTransactions.length !== 1 ? 's' : ''} pending review
              </p>
            </div>
          </div>
          
          {pendingSmsTransactions.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleConfirmAll}
                className="btn-gradient py-2 px-4 rounded-lg font-medium text-white flex items-center gap-2"
              >
                <CheckCircle size={16} />
                <span className="hidden sm:inline">Confirm All</span>
              </button>
              <button
                onClick={handleIgnoreAll}
                className="bg-[#ef4444] bg-opacity-20 text-[#ef4444] py-2 px-4 rounded-lg font-medium hover:bg-opacity-30 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                <span className="hidden sm:inline">Ignore All</span>
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        {pendingSmsTransactions.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="glass p-3 rounded-xl text-center">
              <div className="text-lg font-bold text-[#10b981]">
                {pendingSmsTransactions.filter(t => t.confidence === 'high').length}
              </div>
              <div className="text-xs text-[#a1a1aa]">High Confidence</div>
            </div>
            <div className="glass p-3 rounded-xl text-center">
              <div className="text-lg font-bold text-[#f59e0b]">
                {pendingSmsTransactions.filter(t => t.confidence === 'medium').length}
              </div>
              <div className="text-xs text-[#a1a1aa]">Medium Confidence</div>
            </div>
            <div className="glass p-3 rounded-xl text-center">
              <div className="text-lg font-bold text-[#ef4444]">
                {pendingSmsTransactions.filter(t => t.confidence === 'low').length}
              </div>
              <div className="text-xs text-[#a1a1aa]">Low Confidence</div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions List */}
      {pendingSmsTransactions.length > 0 ? (
        <div className="space-y-4">
          {pendingSmsTransactions.map((transaction) => (
            <SmsTransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-2xl flex items-center justify-center">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#f1f1f1] mb-2">All Caught Up!</h3>
          <p className="text-[#a1a1aa] mb-4">
            No pending SMS transactions to review. New transactions will appear here automatically.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[#00FFD1]">
            <AlertCircle size={16} />
            <span>SMS monitoring is active</span>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="glass-card p-4 rounded-xl border border-[#00FFD1] border-opacity-30">
        <h4 className="font-semibold text-[#00FFD1] mb-2">How SMS Review Works</h4>
        <div className="space-y-2 text-sm text-[#a1a1aa]">
          <p>• <strong className="text-[#10b981]">High Confidence:</strong> Transaction details are clearly identified</p>
          <p>• <strong className="text-[#f59e0b]">Medium Confidence:</strong> Most details are correct, review recommended</p>
          <p>• <strong className="text-[#ef4444]">Low Confidence:</strong> Please verify and edit transaction details</p>
        </div>
      </div>
    </div>
  );
};

export default SmsReviewPage;