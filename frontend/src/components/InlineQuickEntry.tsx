import React, { useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const InlineQuickEntry: React.FC = () => {
  const { addMessage, showToast } = useApp();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (!amount || !description.trim()) {
      showToast('Please enter both amount and description', 'error');
      return;
    }

    const entryText = `Quick Entry: ₹${amount} for ${description}`;
    addMessage(entryText, true, {
      type: 'expense',
      amount: parseFloat(amount),
      description: description.trim(),
      category: 'Quick Entry',
      timestamp: new Date().toISOString()
    });

    // Reset form
    setAmount('');
    setDescription('');
    setIsExpanded(false);
    showToast('Expense logged successfully!', 'success');
  };

  if (!isExpanded) {
    return (
      <div className="glass-card p-4 rounded-xl">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center gap-3 p-3 glass rounded-lg hover:glass-card transition-all duration-300 text-[#f1f1f1]"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-lg flex items-center justify-center">
            <Plus size={16} className="text-white" />
          </div>
          <span className="font-medium">Quick Log Expense</span>
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign size={20} className="text-[#00FFD1]" />
        <h3 className="font-semibold text-[#f1f1f1]">Quick Log Expense</h3>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 input-field rounded-lg"
            autoFocus
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 input-field rounded-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={!amount || !description.trim()}
            className="flex-1 btn-gradient py-2 rounded-lg font-medium text-white disabled:opacity-50"
          >
            Log Expense
          </button>
          <button
            onClick={() => {
              setIsExpanded(false);
              setAmount('');
              setDescription('');
            }}
            className="px-4 py-2 glass rounded-lg font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InlineQuickEntry;