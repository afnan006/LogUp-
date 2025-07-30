import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit3, Trash2, CheckCircle, Clock, AlertTriangle, X, Send, Copy, MessageSquare, Calculator } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Link } from 'react-router-dom';

const DebtsPage: React.FC = () => {
  const { debts, addDebt, updateDebt, markDebtAsPaid, deleteDebt, generateReminderMessage, showToast, friends } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState<string | null>(null);
  const [showFriendSelector, setShowFriendSelector] = useState(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [newDebt, setNewDebt] = useState({
    personName: '',
    phoneNumber: '',
    amount: '',
    type: 'lent' as const,
    description: '',
    dueDate: ''
  });

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(friendSearchQuery.toLowerCase()) ||
    friend.phoneNumber.includes(friendSearchQuery)
  );

  const selectFriend = (friend: any) => {
    setNewDebt({
      ...newDebt,
      personName: friend.name,
      phoneNumber: friend.phoneNumber
    });
    setShowFriendSelector(false);
    setFriendSearchQuery('');
    showToast(`Selected ${friend.name}`, 'success');
  };
  const handleAddDebt = () => {
    if (!newDebt.personName || !newDebt.amount || !newDebt.phoneNumber) return;

    addDebt({
      personName: newDebt.personName,
      phoneNumber: newDebt.phoneNumber,
      amount: parseFloat(newDebt.amount),
      type: newDebt.type,
      description: newDebt.description,
      dueDate: newDebt.dueDate,
      status: 'pending'
    });

    setNewDebt({
      personName: '',
      phoneNumber: '',
      amount: '',
      type: 'lent',
      description: '',
      dueDate: ''
    });
    setShowAddForm(false);
  };

  const getDaysUntilDue = (dueDate: string) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string, daysUntilDue: number | null) => {
    if (status === 'paid') return '#10b981';
    if (daysUntilDue !== null && daysUntilDue < 0) return '#ef4444';
    if (daysUntilDue !== null && daysUntilDue <= 3) return '#f59e0b';
    return '#667eea';
  };

  const lentDebts = debts.filter(debt => debt.type === 'lent');
  const borrowedDebts = debts.filter(debt => debt.type === 'borrowed');
  
  const totalLent = lentDebts.filter(d => d.status === 'pending').reduce((sum, debt) => sum + debt.amount, 0);
  const totalBorrowed = borrowedDebts.filter(d => d.status === 'pending').reduce((sum, debt) => sum + debt.amount, 0);
  const overdueCount = debts.filter(d => {
    const days = getDaysUntilDue(d.dueDate);
    return d.status === 'pending' && days !== null && days < 0;
  }).length;

  const handleCopyReminder = async (debt: any) => {
    const message = generateReminderMessage(debt);
    try {
      await navigator.clipboard.writeText(message);
      showToast('Reminder message copied to clipboard!', 'success');
      setShowReminderModal(null);
    } catch (error) {
      showToast('Failed to copy message', 'error');
    }
  };

  return (
    <div className="p-4 space-y-6 min-h-screen">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#f1f1f1] mb-2">Debt Tracker</h1>
            <p className="text-[#a1a1aa]">Keep track of money lent and borrowed</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-gradient p-3 rounded-xl text-white font-medium flex items-center gap-2 pulse-glow"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Entry</span>
            </button>
            <Link
              to="/split-expense"
              className="glass p-3 rounded-xl text-[#f1f1f1] font-medium flex items-center gap-2 hover:glass-card transition-all duration-300"
            >
              <Calculator size={20} />
              <span className="hidden sm:inline">Split Expense</span>
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass p-4 rounded-xl text-center">
            <Users size={24} className="text-[#10b981] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">₹{totalLent.toLocaleString()}</p>
            <p className="text-xs text-[#a1a1aa]">Money Owed to You</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <Users size={24} className="text-[#ef4444] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">₹{totalBorrowed.toLocaleString()}</p>
            <p className="text-xs text-[#a1a1aa]">Money You Owe</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <AlertTriangle size={24} className="text-[#f59e0b] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">{overdueCount}</p>
            <p className="text-xs text-[#a1a1aa]">Overdue</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <CheckCircle size={24} className="text-[#667eea] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">
              {debts.filter(d => d.status === 'paid').length}
            </p>
            <p className="text-xs text-[#a1a1aa]">Settled</p>
          </div>
        </div>
      </div>

      {/* Money Owed to You */}
      {lentDebts.length > 0 && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-[#f1f1f1] mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
            Money Owed to You
          </h3>
          <div className="space-y-3">
            {lentDebts.map((debt) => {
              const daysUntilDue = getDaysUntilDue(debt.dueDate);
              const statusColor = getStatusColor(debt.status, daysUntilDue);
              
              return (
                <div key={debt.id} className="glass p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: statusColor }}
                      >
                        {debt.personName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-[#f1f1f1] font-semibold">{debt.personName}</h4>
                        <p className="text-sm text-[#a1a1aa]">{debt.description}</p>
                        {debt.dueDate && (
                          <p className={`text-xs ${
                            daysUntilDue !== null && daysUntilDue < 0 ? 'text-[#ef4444]' :
                            daysUntilDue !== null && daysUntilDue <= 3 ? 'text-[#f59e0b]' : 'text-[#a1a1aa]'
                          }`}>
                            {daysUntilDue !== null && daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                             daysUntilDue !== null && daysUntilDue === 0 ? 'Due today' :
                             daysUntilDue !== null ? `Due in ${daysUntilDue} days` : 'No due date'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#10b981]">+₹{debt.amount.toLocaleString()}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          debt.status === 'paid' ? 'bg-[#10b981] bg-opacity-20 text-[#10b981]' :
                          debt.status === 'overdue' ? 'bg-[#ef4444] bg-opacity-20 text-[#ef4444]' :
                          'bg-[#f59e0b] bg-opacity-20 text-[#f59e0b]'
                        }`}>
                          {debt.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      
                      {debt.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowReminderModal(debt.id)}
                            className="p-2 rounded-lg glass hover:glass-card transition-all duration-300"
                            title="Send Reminder"
                          >
                            <Send size={16} className="text-[#667eea]" />
                          </button>
                          <button
                            onClick={() => markDebtAsPaid(debt.id)}
                            className="p-2 rounded-lg bg-[#10b981] bg-opacity-20 text-[#10b981] hover:bg-opacity-30 transition-colors"
                            title="Mark as Paid"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => deleteDebt(debt.id)}
                            className="p-2 rounded-lg bg-[#ef4444] bg-opacity-20 text-[#ef4444] hover:bg-opacity-30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Money You Owe */}
      {borrowedDebts.length > 0 && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-[#f1f1f1] mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ef4444] rounded-full"></div>
            Money You Owe
          </h3>
          <div className="space-y-3">
            {borrowedDebts.map((debt) => {
              const daysUntilDue = getDaysUntilDue(debt.dueDate);
              const statusColor = getStatusColor(debt.status, daysUntilDue);
              
              return (
                <div key={debt.id} className="glass p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: statusColor }}
                      >
                        {debt.personName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-[#f1f1f1] font-semibold">{debt.personName}</h4>
                        <p className="text-sm text-[#a1a1aa]">{debt.description}</p>
                        {debt.dueDate && (
                          <p className={`text-xs ${
                            daysUntilDue !== null && daysUntilDue < 0 ? 'text-[#ef4444]' :
                            daysUntilDue !== null && daysUntilDue <= 3 ? 'text-[#f59e0b]' : 'text-[#a1a1aa]'
                          }`}>
                            {daysUntilDue !== null && daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                             daysUntilDue !== null && daysUntilDue === 0 ? 'Due today' :
                             daysUntilDue !== null ? `Due in ${daysUntilDue} days` : 'No due date'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#ef4444]">-₹{debt.amount.toLocaleString()}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          debt.status === 'paid' ? 'bg-[#10b981] bg-opacity-20 text-[#10b981]' :
                          debt.status === 'overdue' ? 'bg-[#ef4444] bg-opacity-20 text-[#ef4444]' :
                          'bg-[#f59e0b] bg-opacity-20 text-[#f59e0b]'
                        }`}>
                          {debt.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      
                      {debt.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowReminderModal(debt.id)}
                            className="p-2 rounded-lg glass hover:glass-card transition-all duration-300"
                            title="Send Reminder"
                          >
                            <Send size={16} className="text-[#667eea]" />
                          </button>
                          <button
                            onClick={() => markDebtAsPaid(debt.id)}
                            className="p-2 rounded-lg bg-[#10b981] bg-opacity-20 text-[#10b981] hover:bg-opacity-30 transition-colors"
                            title="Mark as Paid"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => deleteDebt(debt.id)}
                            className="p-2 rounded-lg bg-[#ef4444] bg-opacity-20 text-[#ef4444] hover:bg-opacity-30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {debts.length === 0 && (
        <div className="glass-card p-8 rounded-2xl text-center">
          <Users size={48} className="text-[#a1a1aa] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#f1f1f1] mb-2">No Debts Tracked</h3>
          <p className="text-[#a1a1aa] mb-4">
            Start tracking money you've lent or borrowed to keep your finances organized.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-gradient py-3 px-6 rounded-xl font-medium text-white"
          >
            Add First Entry
          </button>
        </div>
      )}

      {/* Add Debt Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#f1f1f1]">Add Debt Entry</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
              >
                <X size={20} className="text-[#a1a1aa]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewDebt({...newDebt, type: 'lent'})}
                    className={`p-3 rounded-lg font-medium transition-all duration-300 ${
                      newDebt.type === 'lent'
                        ? 'bg-[#10b981] bg-opacity-20 text-[#10b981] border border-[#10b981]'
                        : 'glass text-[#a1a1aa] hover:text-[#f1f1f1]'
                    }`}
                  >
                    I Lent Money
                  </button>
                  <button
                    onClick={() => setNewDebt({...newDebt, type: 'borrowed'})}
                    className={`p-3 rounded-lg font-medium transition-all duration-300 ${
                      newDebt.type === 'borrowed'
                        ? 'bg-[#ef4444] bg-opacity-20 text-[#ef4444] border border-[#ef4444]'
                        : 'glass text-[#a1a1aa] hover:text-[#f1f1f1]'
                    }`}
                  >
                    I Borrowed Money
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Person Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., John, Sarah or select from friends"
                    value={newDebt.personName}
                    onChange={(e) => setNewDebt({...newDebt, personName: e.target.value})}
                    className="w-full p-3 pr-10 input-field"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFriendSelector(!showFriendSelector)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-[#26262a] transition-colors"
                  >
                    <Users size={16} className="text-[#00FFD1]" />
                  </button>
                  
                  {/* Friend Selector Dropdown */}
                  {showFriendSelector && (
                    <div className="absolute top-full left-0 right-0 mt-2 glass border border-[#3d3d42] rounded-xl p-3 z-20 max-h-64 overflow-y-auto">
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Search friends..."
                          value={friendSearchQuery}
                          onChange={(e) => setFriendSearchQuery(e.target.value)}
                          className="w-full p-2 input-field rounded-lg text-sm"
                        />
                      </div>
                      
                      {filteredFriends.length > 0 ? (
                        <div className="space-y-2">
                          {filteredFriends.map((friend) => (
                            <button
                              key={friend.id}
                              type="button"
                              onClick={() => selectFriend(friend)}
                              className="w-full flex items-center gap-3 p-2 hover:bg-[#26262a] rounded-lg transition-colors text-left"
                            >
                              {friend.avatar ? (
                                <img
                                  src={friend.avatar}
                                  alt={friend.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-xs">
                                    {friend.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#f1f1f1] truncate">{friend.name}</p>
                                <p className="text-xs text-[#a1a1aa] truncate">{friend.phoneNumber}</p>
                              </div>
                              {friend.isOnline && (
                                <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Users size={24} className="text-[#a1a1aa] mx-auto mb-2" />
                          <p className="text-sm text-[#a1a1aa]">
                            {friendSearchQuery ? 'No friends found' : 'No friends added yet'}
                          </p>
                          {!friendSearchQuery && (
                            <Link
                              to="/friends"
                              className="text-xs text-[#00FFD1] hover:text-[#667eea] transition-colors mt-1 inline-block"
                            >
                              Add friends first →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={newDebt.phoneNumber}
                  onChange={(e) => setNewDebt({...newDebt, phoneNumber: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newDebt.amount}
                  onChange={(e) => setNewDebt({...newDebt, amount: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Description</label>
                <input
                  type="text"
                  placeholder="e.g., Dinner split, Movie tickets"
                  value={newDebt.description}
                  onChange={(e) => setNewDebt({...newDebt, description: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Due Date (Optional)</label>
                <input
                  type="date"
                  value={newDebt.dueDate}
                  onChange={(e) => setNewDebt({...newDebt, dueDate: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <button
                onClick={handleAddDebt}
                disabled={!newDebt.personName || !newDebt.amount || !newDebt.phoneNumber}
                className="w-full btn-gradient py-3 rounded-xl font-medium text-white disabled:opacity-50"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-[#00FFD1]" />
                <h3 className="text-xl font-bold text-[#f1f1f1]">Send Reminder</h3>
              </div>
              <button
                onClick={() => setShowReminderModal(null)}
                className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
              >
                <X size={20} className="text-[#a1a1aa]" />
              </button>
            </div>

            {(() => {
              const debt = debts.find(d => d.id === showReminderModal);
              if (!debt) return null;
              
              const message = generateReminderMessage(debt);
              
              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
                      Reminder Message for {debt.personName}
                    </label>
                    <div className="p-4 glass rounded-xl">
                      <p className="text-[#f1f1f1] text-sm leading-relaxed whitespace-pre-wrap">
                        {message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="glass p-3 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#a1a1aa]">Send to:</span>
                      <span className="text-sm font-medium text-[#f1f1f1]">{debt.phoneNumber}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCopyReminder(debt)}
                      className="flex-1 btn-gradient py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2"
                    >
                      <Send size={16} />
                      Send Reminder
                    </button>
                    <button
                      onClick={() => setShowReminderModal(null)}
                      className="px-6 py-3 glass rounded-xl font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtsPage;