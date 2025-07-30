import React, { useState } from 'react';
import { Target, Plus, Edit3, Trash2, TrendingUp, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const BudgetsPage: React.FC = () => {
  const { budgets, addBudget, updateBudget, deleteBudget } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    period: 'monthly' as const,
    color: '#00FFD1'
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other'
  ];

  const colors = [
    '#00FFD1', '#667eea', '#f093fb', '#fbbf24', 
    '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'
  ];

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.limit) return;

    addBudget({
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      period: newBudget.period,
      color: newBudget.color
    });

    setNewBudget({
      category: '',
      limit: '',
      period: 'monthly',
      color: '#00FFD1'
    });
    setShowAddForm(false);
  };

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { status: 'over', color: '#ef4444', text: 'Over Budget' };
    if (percentage >= 80) return { status: 'warning', color: '#f59e0b', text: 'Near Limit' };
    return { status: 'good', color: '#10b981', text: 'On Track' };
  };

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  return (
    <div className="p-4 space-y-6 min-h-screen">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#f1f1f1] mb-2">Budgets</h1>
            <p className="text-[#a1a1aa]">Track and manage your spending limits</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-gradient p-3 rounded-xl text-white font-medium flex items-center gap-2 pulse-glow"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Budget</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="glass p-4 rounded-xl text-center">
            <Target size={24} className="text-[#00FFD1] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">₹{totalBudgeted.toLocaleString()}</p>
            <p className="text-xs text-[#a1a1aa]">Total Budgeted</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <TrendingUp size={24} className="text-[#ef4444] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">₹{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-[#a1a1aa]">Total Spent</p>
          </div>
          <div className="glass p-4 rounded-xl text-center md:col-span-1 col-span-2">
            <AlertTriangle size={24} className="text-[#f59e0b] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">
              {budgets.filter(b => (b.spent / b.limit) >= 0.8).length}
            </p>
            <p className="text-xs text-[#a1a1aa]">Near/Over Limit</p>
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="responsive-grid">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const status = getBudgetStatus(budget.spent, budget.limit);
          
          return (
            <div key={budget.id} className="glass-card p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: budget.color + '20', border: `2px solid ${budget.color}` }}
                  >
                    <Target size={20} style={{ color: budget.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f1f1f1]">{budget.category}</h3>
                    <p className="text-sm text-[#a1a1aa] capitalize">{budget.period}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingBudget(budget.id)}
                    className="p-2 rounded-lg glass hover:glass-card transition-all duration-300"
                  >
                    <Edit3 size={16} className="text-[#f1f1f1]" />
                  </button>
                  <button
                    onClick={() => deleteBudget(budget.id)}
                    className="p-2 rounded-lg bg-[#ef4444] bg-opacity-20 text-[#ef4444] hover:bg-opacity-30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#f1f1f1]">
                    ₹{budget.spent.toLocaleString()}
                  </span>
                  <span className="text-[#a1a1aa]">
                    of ₹{budget.limit.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: status.color }}>{status.text}</span>
                    <span className="text-[#a1a1aa]">{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-[#26262a] rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: status.color
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm text-[#a1a1aa]">
                  <span>Remaining: ₹{Math.max(budget.limit - budget.spent, 0).toLocaleString()}</span>
                  <span>{Math.max(30 - Math.floor(percentage * 30 / 100), 0)} days left</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Budget Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#f1f1f1]">Add New Budget</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
              >
                <X size={20} className="text-[#a1a1aa]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Category</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                  className="w-full p-3 input-field"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Budget Limit (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget({...newBudget, limit: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Period</label>
                <select
                  value={newBudget.period}
                  onChange={(e) => setNewBudget({...newBudget, period: e.target.value as any})}
                  className="w-full p-3 input-field"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Color Theme</label>
                <div className="flex gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewBudget({...newBudget, color})}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newBudget.color === color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddBudget}
                disabled={!newBudget.category || !newBudget.limit}
                className="w-full btn-gradient py-3 rounded-xl font-medium text-white disabled:opacity-50"
              >
                Create Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetsPage;