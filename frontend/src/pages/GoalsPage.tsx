import React, { useState } from 'react';
import { Target, Plus, Edit3, Trash2, TrendingUp, Calendar, X, PlusCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const GoalsPage: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, addToGoal } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    dueDate: '',
    category: '',
    priority: 'medium' as const,
    color: '#00FFD1'
  });

  const categories = [
    'Savings',
    'Purchase',
    'Travel',
    'Education',
    'Investment',
    'Emergency Fund',
    'Debt Payment',
    'Other'
  ];

  const colors = [
    '#00FFD1', '#10b981', '#3b82f6', '#8b5cf6', 
    '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'
  ];

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.dueDate) return;

    addGoal({
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      dueDate: newGoal.dueDate,
      category: newGoal.category || 'Other',
      priority: newGoal.priority,
      color: newGoal.color
    });

    setNewGoal({
      name: '',
      targetAmount: '',
      dueDate: '',
      category: '',
      priority: 'medium',
      color: '#00FFD1'
    });
    setShowAddForm(false);
  };

  const handleContribute = (goalId: string) => {
    if (!contributionAmount) return;
    
    addToGoal(goalId, parseFloat(contributionAmount));
    setContributionAmount('');
    setShowContributeModal(null);
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (percentage: number, priority: string) => {
    if (percentage >= 100) return '#10b981';
    if (percentage >= 75) return '#00FFD1';
    if (percentage >= 50) return '#3b82f6';
    if (priority === 'high') return '#f59e0b';
    return '#6b7280';
  };

  const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;

  return (
    <div className="min-h-screen bg-[#0e0e10]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0e0e10]/95 backdrop-blur-sm border-b border-[#26262a]/50">
        <div className="p-4 sm:p-6 md:ml-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#00FFD1] to-[#667eea] bg-clip-text text-transparent mb-2">
              Financial Goals
            </h1>
            <p className="text-[#a1a1aa] text-sm sm:text-base">Track your progress towards financial milestones</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Add Goal Button - Mobile Floating */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-gradient p-3 sm:px-6 sm:py-3 rounded-xl text-white font-medium flex items-center gap-2 pulse-glow shadow-lg"
          >
            <Plus size={20} />
            <span className="sm:inline">Add Goal</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="glass p-3 sm:p-4 rounded-xl text-center">
              <Target size={20} className="text-[#00FFD1] mx-auto mb-2" />
              <p className="text-base sm:text-lg font-bold text-[#f1f1f1]">{goals.length}</p>
              <p className="text-xs text-[#a1a1aa]">Active Goals</p>
            </div>
            <div className="glass p-3 sm:p-4 rounded-xl text-center">
              <TrendingUp size={20} className="text-[#10b981] mx-auto mb-2" />
              <p className="text-base sm:text-lg font-bold text-[#f1f1f1]">₹{totalSaved.toLocaleString()}</p>
              <p className="text-xs text-[#a1a1aa]">Total Saved</p>
            </div>
            <div className="glass p-3 sm:p-4 rounded-xl text-center">
              <Calendar size={20} className="text-[#667eea] mx-auto mb-2" />
              <p className="text-base sm:text-lg font-bold text-[#f1f1f1]">₹{totalGoalAmount.toLocaleString()}</p>
              <p className="text-xs text-[#a1a1aa]">Target Amount</p>
            </div>
            <div className="glass p-3 sm:p-4 rounded-xl text-center">
              <PlusCircle size={20} className="text-[#f59e0b] mx-auto mb-2" />
              <p className="text-base sm:text-lg font-bold text-[#f1f1f1]">{completedGoals}</p>
              <p className="text-xs text-[#a1a1aa]">Completed</p>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        {goals.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {goals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100;
              const daysRemaining = getDaysRemaining(goal.dueDate);
              const progressColor = getProgressColor(percentage, goal.priority);
              const isCompleted = goal.currentAmount >= goal.targetAmount;
              
              return (
                <div key={goal.id} className="glass-card p-4 sm:p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: goal.color + '20', border: `2px solid ${goal.color}` }}
                      >
                        <Target size={18} style={{ color: goal.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-[#f1f1f1] truncate">{goal.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs sm:text-sm text-[#a1a1aa] truncate">{goal.category}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            goal.priority === 'high' ? 'bg-[#ef4444] bg-opacity-20 text-[#ef4444]' :
                            goal.priority === 'medium' ? 'bg-[#f59e0b] bg-opacity-20 text-[#f59e0b]' :
                            'bg-[#10b981] bg-opacity-20 text-[#10b981]'
                          }`}>
                            {goal.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                      <button
                        onClick={() => setShowContributeModal(goal.id)}
                        disabled={isCompleted}
                        className="p-2 rounded-lg btn-gradient text-white hover:opacity-80 transition-opacity disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 rounded-lg bg-[#ef4444] bg-opacity-20 text-[#ef4444] hover:bg-opacity-30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Progress Circle */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#26262a"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke={progressColor}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(percentage, 100) / 100)}`}
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-base sm:text-lg font-bold text-[#f1f1f1]">
                            {Math.min(percentage, 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xl sm:text-2xl font-bold text-[#f1f1f1]">
                        ₹{goal.currentAmount.toLocaleString()}
                      </p>
                      <p className="text-[#a1a1aa] text-sm">
                        of ₹{goal.targetAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#a1a1aa]">Remaining</span>
                        <span className="text-[#f1f1f1] font-medium">
                          ₹{Math.max(goal.targetAmount - goal.currentAmount, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#a1a1aa]">Due Date</span>
                        <span className={`font-medium ${
                          daysRemaining < 0 ? 'text-[#ef4444]' :
                          daysRemaining <= 30 ? 'text-[#f59e0b]' : 'text-[#f1f1f1]'
                        }`}>
                          {daysRemaining < 0 ? 'Overdue' : 
                           daysRemaining === 0 ? 'Due Today' :
                           `${daysRemaining} days`}
                        </span>
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="text-center p-3 bg-[#10b981] bg-opacity-20 text-[#10b981] rounded-lg">
                        🎉 Goal Completed!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-8 rounded-2xl text-center">
            <Target size={48} className="text-[#a1a1aa] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#f1f1f1] mb-2">No Goals Yet</h3>
            <p className="text-[#a1a1aa] mb-4">
              Start setting financial goals to track your progress and achieve your dreams.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-gradient py-3 px-6 rounded-xl font-medium text-white"
            >
              Create Your First Goal
            </button>
          </div>
        )}

        {/* Bottom padding for mobile navigation */}
        <div className="pb-20 md:pb-4" />
      </div>

      {/* Add Goal Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#f1f1f1]">Add New Goal</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
              >
                <X size={20} className="text-[#a1a1aa]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Emergency Fund, New Laptop"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Target Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Due Date</label>
                <input
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full p-3 input-field"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Priority</label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as any})}
                  className="w-full p-3 input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Color Theme</label>
                <div className="flex gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewGoal({...newGoal, color})}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newGoal.color === color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddGoal}
                disabled={!newGoal.name || !newGoal.targetAmount || !newGoal.dueDate}
                className="w-full btn-gradient py-3 rounded-xl font-medium text-white disabled:opacity-50"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-sm w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#f1f1f1]">Add to Goal</h3>
              <button
                onClick={() => setShowContributeModal(null)}
                className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
              >
                <X size={20} className="text-[#a1a1aa]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="w-full p-3 input-field"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleContribute(showContributeModal)}
                  disabled={!contributionAmount}
                  className="flex-1 btn-gradient py-3 rounded-xl font-medium text-white disabled:opacity-50"
                >
                  Add Amount
                </button>
                <button
                  onClick={() => setShowContributeModal(null)}
                  className="px-6 py-3 glass rounded-xl font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;