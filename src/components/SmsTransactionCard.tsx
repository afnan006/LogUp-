import React, { useState } from 'react';
import { 
  CheckCircle, 
  Edit3, 
  X, 
  AlertTriangle, 
  CreditCard, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Flag
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface SmsTransaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  originalSms: string;
  bankName: string;
  transactionType: 'debit' | 'credit';
  accountLast4: string;
}

interface SmsTransactionCardProps {
  transaction: SmsTransaction;
}

const SmsTransactionCard: React.FC<SmsTransactionCardProps> = ({ transaction }) => {
  const { confirmSmsTransaction, editSmsTransaction, ignoreSmsTransaction } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState(transaction);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'from-[#10b981] to-[#34d399]';
      case 'medium': return 'from-[#f59e0b] to-[#fbbf24]';
      case 'low': return 'from-[#ef4444] to-[#f87171]';
      default: return 'from-[#6b7280] to-[#9ca3af]';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return <CheckCircle size={16} />;
      case 'medium': return <AlertTriangle size={16} />;
      case 'low': return <Flag size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const handleSaveEdit = () => {
    editSmsTransaction(transaction.id, editedTransaction);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTransaction(transaction);
    setIsEditing(false);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Confidence Indicator Bar */}
      <div className={`h-1 bg-gradient-to-r ${getConfidenceColor(transaction.confidence)}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-white" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTransaction.merchantName}
                  onChange={(e) => setEditedTransaction({...editedTransaction, merchantName: e.target.value})}
                  className="text-lg font-semibold bg-transparent border-b border-[#00FFD1] text-[#f1f1f1] focus:outline-none"
                />
              ) : (
                <h3 className="text-lg font-semibold text-[#f1f1f1]">{transaction.merchantName}</h3>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-[#a1a1aa]">{transaction.bankName}</span>
                <span className="text-xs text-[#a1a1aa]">•••• {transaction.accountLast4}</span>
              </div>
            </div>
          </div>
          
          {/* Confidence Badge */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${getConfidenceColor(transaction.confidence)} bg-opacity-20`}>
            <div className={`text-gradient-to-r ${getConfidenceColor(transaction.confidence)}`}>
              {getConfidenceIcon(transaction.confidence)}
            </div>
            <span className="text-xs font-medium text-[#f1f1f1] capitalize">
              {transaction.confidence}
            </span>
          </div>
        </div>

        {/* Amount and Date */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {isEditing ? (
              <input
                type="number"
                value={editedTransaction.amount}
                onChange={(e) => setEditedTransaction({...editedTransaction, amount: parseFloat(e.target.value)})}
                className="text-2xl font-bold bg-transparent border-b border-[#00FFD1] text-[#f1f1f1] focus:outline-none w-32"
              />
            ) : (
              <span className={`text-2xl font-bold ${
                transaction.transactionType === 'debit' ? 'text-[#ef4444]' : 'text-[#10b981]'
              }`}>
                {transaction.transactionType === 'debit' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[#a1a1aa]">
            <Calendar size={16} />
            <span className="text-sm">{new Date(transaction.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-xs text-[#a1a1aa] mb-1">Category</label>
          {isEditing ? (
            <select
              value={editedTransaction.category}
              onChange={(e) => setEditedTransaction({...editedTransaction, category: e.target.value})}
              className="w-full p-2 bg-[#26262a] border border-[#3d3d42] rounded-lg text-[#f1f1f1] text-sm"
            >
              <option value="Food & Dining">Food & Dining</option>
              <option value="Shopping">Shopping</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills & Utilities">Bills & Utilities</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <span className="inline-block px-3 py-1 bg-[#00FFD1] bg-opacity-20 text-[#00FFD1] rounded-full text-sm font-medium">
              {transaction.category}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-gradient-to-r from-[#10b981] to-[#34d399] text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 glass py-2 px-4 rounded-lg font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => confirmSmsTransaction(transaction.id)}
                className="flex-1 btn-gradient py-2 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                Confirm
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 glass rounded-lg hover:glass-card transition-all duration-300"
              >
                <Edit3 size={16} className="text-[#f1f1f1]" />
              </button>
              <button
                onClick={() => ignoreSmsTransaction(transaction.id)}
                className="px-4 py-2 bg-[#ef4444] bg-opacity-20 text-[#ef4444] rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <X size={16} />
              </button>
            </>
          )}
        </div>

        {/* Expandable SMS Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-2 glass rounded-lg hover:glass-card transition-all duration-300"
        >
          <span className="text-sm text-[#a1a1aa]">Original SMS</span>
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showDetails && (
          <div className="mt-3 p-3 bg-[#26262a] rounded-lg">
            <p className="text-xs text-[#a1a1aa] font-mono leading-relaxed">
              {transaction.originalSms}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmsTransactionCard;