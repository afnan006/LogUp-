import React, { useState } from 'react';
import { CreditCard, Plus, Calendar, DollarSign, Trash2, Edit3, Play, Pause, X } from 'lucide-react';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextDueDate: string;
  category: string;
  status: 'active' | 'paused' | 'cancelled';
  color: string;
}

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      name: 'Netflix',
      amount: 649,
      billingCycle: 'monthly',
      nextDueDate: '2025-02-15',
      category: 'Entertainment',
      status: 'active',
      color: '#E50914'
    },
    {
      id: '2',
      name: 'Spotify Premium',
      amount: 119,
      billingCycle: 'monthly',
      nextDueDate: '2025-02-10',
      category: 'Entertainment',
      status: 'active',
      color: '#1DB954'
    },
    {
      id: '3',
      name: 'Adobe Creative Cloud',
      amount: 1675,
      billingCycle: 'monthly',
      nextDueDate: '2025-02-20',
      category: 'Software',
      status: 'active',
      color: '#FF0000'
    },
    {
      id: '4',
      name: 'Gym Membership',
      amount: 2500,
      billingCycle: 'monthly',
      nextDueDate: '2025-02-05',
      category: 'Health',
      status: 'paused',
      color: '#FF6B35'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    amount: '',
    billingCycle: 'monthly' as const,
    nextDueDate: '',
    category: '',
    color: '#667eea'
  });

  const totalMonthlySpend = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => {
      switch (sub.billingCycle) {
        case 'monthly': return total + sub.amount;
        case 'yearly': return total + (sub.amount / 12);
        case 'weekly': return total + (sub.amount * 4.33);
        default: return total;
      }
    }, 0);

  const totalYearlySpend = totalMonthlySpend * 12;

  const handleAddSubscription = () => {
    if (!newSubscription.name || !newSubscription.amount) return;

    const subscription: Subscription = {
      id: Date.now().toString(),
      name: newSubscription.name,
      amount: parseFloat(newSubscription.amount),
      billingCycle: newSubscription.billingCycle,
      nextDueDate: newSubscription.nextDueDate,
      category: newSubscription.category || 'Other',
      status: 'active',
      color: newSubscription.color
    };

    setSubscriptions([...subscriptions, subscription]);
    setNewSubscription({
      name: '',
      amount: '',
      billingCycle: 'monthly',
      nextDueDate: '',
      category: '',
      color: '#667eea'
    });
    setShowAddForm(false);
  };

  const toggleSubscriptionStatus = (id: string) => {
    setSubscriptions(subs => 
      subs.map(sub => 
        sub.id === id 
          ? { ...sub, status: sub.status === 'active' ? 'paused' : 'active' }
          : sub
      )
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(subs => subs.filter(sub => sub.id !== id));
  };

  const getBillingCycleText = (cycle: string) => {
    switch (cycle) {
      case 'monthly': return '/month';
      case 'yearly': return '/year';
      case 'weekly': return '/week';
      default: return '';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-4 space-y-6 min-h-screen">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#f1f1f1] mb-2">Subscriptions</h1>
            <p className="text-[#a1a1aa]">Manage your recurring payments</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-gradient p-3 rounded-xl text-white font-medium flex items-center gap-2 pulse-glow"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add New</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-[#00FFD1]" />
              <span className="text-sm text-[#a1a1aa]">Monthly Total</span>
            </div>
            <p className="text-2xl font-bold text-[#f1f1f1]">₹{Math.round(totalMonthlySpend).toLocaleString()}</p>
          </div>
          
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-[#667eea]" />
              <span className="text-sm text-[#a1a1aa]">Yearly Total</span>
            </div>
            <p className="text-2xl font-bold text-[#f1f1f1]">₹{Math.round(totalYearlySpend).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="responsive-grid">
        {subscriptions.map((subscription) => {
          const daysUntilDue = getDaysUntilDue(subscription.nextDueDate);
          
          return (
            <div key={subscription.id} className="glass-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: subscription.color + '20', border: `2px solid ${subscription.color}` }}
                  >
                    <CreditCard size={20} style={{ color: subscription.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f1f1f1]">{subscription.name}</h3>
                    <p className="text-sm text-[#a1a1aa]">{subscription.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSubscriptionStatus(subscription.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      subscription.status === 'active' 
                        ? 'bg-[#f59e0b] bg-opacity-20 text-[#f59e0b] hover:bg-opacity-30' 
                        : 'bg-[#00FFD1] bg-opacity-20 text-[#00FFD1] hover:bg-opacity-30'
                    }`}
                  >
                    {subscription.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={() => deleteSubscription(subscription.id)}
                    className="p-2 rounded-lg bg-[#ef4444] bg-opacity-20 text-[#ef4444] hover:bg-opacity-30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#a1a1aa]">Amount</span>
                  <span className="text-xl font-bold text-[#f1f1f1]">
                    ₹{subscription.amount.toLocaleString()}{getBillingCycleText(subscription.billingCycle)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#a1a1aa]">Next Due</span>
                  <div className="text-right">
                    <p className="text-[#f1f1f1] font-medium">
                      {new Date(subscription.nextDueDate).toLocaleDateString()}
                    </p>
                    <p className={`text-xs ${
                      daysUntilDue <= 3 ? 'text-[#ef4444]' : 
                      daysUntilDue <= 7 ? 'text-[#f59e0b]' : 'text-[#a1a1aa]'
                    }`}>
                      {daysUntilDue > 0 ? `${daysUntilDue} days` : 'Due today'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#a1a1aa]">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    subscription.status === 'active' ? 'status-active' :
                    subscription.status === 'paused' ? 'status-paused' : 'status-cancelled'
                  }`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subscription Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#f1f1f1]">Add New Subscription</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
              >
                <X size={20} className="text-[#a1a1aa]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Service Name</label>
                <input
                  type="text"
                  placeholder="e.g., Netflix, Spotify"
                  value={newSubscription.name}
                  onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newSubscription.amount}
                  onChange={(e) => setNewSubscription({...newSubscription, amount: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Billing Cycle</label>
                <select
                  value={newSubscription.billingCycle}
                  onChange={(e) => setNewSubscription({...newSubscription, billingCycle: e.target.value as any})}
                  className="w-full p-3 input-field"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Next Due Date</label>
                <input
                  type="date"
                  value={newSubscription.nextDueDate}
                  onChange={(e) => setNewSubscription({...newSubscription, nextDueDate: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Entertainment, Software"
                  value={newSubscription.category}
                  onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                  className="w-full p-3 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Color Theme</label>
                <div className="flex gap-3">
                  {['#667eea', '#E50914', '#1DB954', '#FF6B35', '#f59e0b', '#a855f7'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewSubscription({...newSubscription, color})}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newSubscription.color === color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddSubscription}
                disabled={!newSubscription.name || !newSubscription.amount}
                className="w-full btn-gradient py-3 rounded-xl font-medium text-white disabled:opacity-50"
              >
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;