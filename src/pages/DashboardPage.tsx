import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  CreditCard, 
  PiggyBank, 
  Users, 
  AlertCircle,
  Plus,
  ArrowRight,
  Calendar,
  DollarSign,
  MessageSquareText,
  Camera,
  X,
  Bell,
  Settings,
  TrendingDown,
  Activity
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SortableWidget from '../components/SortableWidget';
import WidgetManager from '../components/WidgetManager';
import InlineQuickEntry from '../components/InlineQuickEntry';

const DashboardPage: React.FC = () => {
  const { 
    budgets, 
    goals, 
    debts, 
    activeNudges, 
    dismissNudge,
    pendingSmsTransactions,
    pendingReceiptTransactions,
    dashboardWidgets,
    updateWidgetOrder,
    showWidgetManager,
    setShowWidgetManager,
    incomeEntries,
    messages
  } = useApp();

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mock data for charts
  const weeklySpending = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 800 },
    { day: 'Wed', amount: 1500 },
    { day: 'Thu', amount: 900 },
    { day: 'Fri', amount: 2100 },
    { day: 'Sat', amount: 1800 },
    { day: 'Sun', amount: 1100 }
  ];

  const categorySpending = [
    { name: 'Food', value: 4500, color: '#00FFD1' },
    { name: 'Transport', value: 2800, color: '#667eea' },
    { name: 'Shopping', value: 3200, color: '#f093fb' },
    { name: 'Bills', value: 1800, color: '#fbbf24' }
  ];

  const totalBudgetSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalBudgetLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalGoalProgress = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalDebtAmount = debts.filter(d => d.status === 'pending').reduce((sum, debt) => sum + debt.amount, 0);
  
  // Calculate cash flow
  const currentMonthIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const currentMonthExpenses = totalBudgetSpent;
  const netCashFlow = currentMonthIncome - currentMonthExpenses;
  
  // Calculate spending trend (mock calculation)
  const lastMonthSpending = 18500; // Mock data
  const spendingChange = ((currentMonthExpenses - lastMonthSpending) / lastMonthSpending) * 100;

  const recentTransactions = messages
    .filter(m => m.memory?.type === 'expense')
    .slice(-5)
    .reverse();

  const enabledWidgets = dashboardWidgets
    .filter(w => w.enabled)
    .sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = enabledWidgets.findIndex(widget => widget.id === active.id);
      const newIndex = enabledWidgets.findIndex(widget => widget.id === over.id);
      
      const reorderedWidgets = arrayMove(enabledWidgets, oldIndex, newIndex);
      const updatedWidgets = reorderedWidgets.map((widget, index) => ({
        ...widget,
        order: index + 1
      }));
      
      // Update all widgets with new order
      const allWidgets = dashboardWidgets.map(widget => {
        const updatedWidget = updatedWidgets.find(w => w.id === widget.id);
        return updatedWidget || widget;
      });
      
      updateWidgetOrder(allWidgets);
    }
  };

  const renderWidget = (widget: any) => {
    switch (widget.type) {
      case 'recent-transactions':
        return (
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#f1f1f1]">Recent Transactions</h3>
              <Link to="/chat" className="text-[#00FFD1] hover:text-[#667eea] transition-colors">
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                    <div>
                      <p className="text-[#f1f1f1] font-medium">{transaction.memory.description}</p>
                      <p className="text-sm text-[#a1a1aa]">{transaction.memory.category || 'Uncategorized'}</p>
                    </div>
                    <span className="text-[#ef4444] font-semibold">-₹{transaction.memory.amount}</span>
                  </div>
                ))
              ) : (
                <p className="text-[#a1a1aa] text-center py-4">No recent transactions</p>
              )}
            </div>
          </div>
        );

      case 'cash-flow-summary':
        return (
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#f1f1f1]">Cash Flow Summary</h3>
              <Activity size={20} className="text-[#00FFD1]" />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-[#a1a1aa] mb-1">Income</p>
                  <p className="text-xl font-bold text-[#10b981]">+₹{currentMonthIncome.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-[#a1a1aa] mb-1">Expenses</p>
                  <p className="text-xl font-bold text-[#ef4444]">-₹{currentMonthExpenses.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-center p-3 glass rounded-lg">
                <p className="text-sm text-[#a1a1aa] mb-1">Net Cash Flow</p>
                <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                  {netCashFlow >= 0 ? '+' : ''}₹{netCashFlow.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );

      case 'budget-overview':
        return (
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#f1f1f1]">Budget Overview</h3>
              <Link to="/budgets" className="text-[#00FFD1] hover:text-[#667eea] transition-colors">
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-2xl font-bold text-[#f1f1f1]">₹{totalBudgetSpent.toLocaleString()}</p>
                <p className="text-sm text-[#a1a1aa]">of ₹{totalBudgetLimit.toLocaleString()} budgeted</p>
              </div>
              {budgets.slice(0, 3).map(budget => {
                const percentage = (budget.spent / budget.limit) * 100;
                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#f1f1f1]">{budget.category}</span>
                      <span className="text-[#a1a1aa]">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[#26262a] rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: percentage > 100 ? '#ef4444' : percentage > 80 ? '#f59e0b' : budget.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'goal-progress':
        return (
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#f1f1f1]">Goal Progress</h3>
              <Link to="/goals" className="text-[#00FFD1] hover:text-[#667eea] transition-colors">
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-2xl font-bold text-[#f1f1f1]">₹{totalGoalProgress.toLocaleString()}</p>
                <p className="text-sm text-[#a1a1aa]">of ₹{totalGoalTarget.toLocaleString()} target</p>
              </div>
              {goals.slice(0, 2).map(goal => {
                const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#f1f1f1]">{goal.name}</span>
                      <span className="text-[#a1a1aa]">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[#26262a] rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: goal.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'spending-summary':
        return (
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#f1f1f1]">Weekly Spending</h3>
              <Link to="/spend/weekly" className="text-[#00FFD1] hover:text-[#667eea] transition-colors">
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklySpending}>
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#00FFD1" 
                    strokeWidth={2}
                    dot={{ fill: '#00FFD1', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-[#f1f1f1]">₹9,300</p>
                <p className="text-xs text-[#a1a1aa]">This Week</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#00FFD1]">-12%</p>
                <p className="text-xs text-[#a1a1aa]">vs Last Week</p>
              </div>
            </div>
          </div>
        );

      case 'spending-trends':
        return (
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#f1f1f1]">Spending Trends</h3>
              <TrendingDown size={20} className={spendingChange < 0 ? 'text-[#10b981]' : 'text-[#ef4444]'} />
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <p className={`text-3xl font-bold ${spendingChange < 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                  {spendingChange > 0 ? '+' : ''}{spendingChange.toFixed(1)}%
                </p>
                <p className="text-sm text-[#a1a1aa]">vs Last Month</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="glass p-3 rounded-lg">
                  <p className="text-sm text-[#a1a1aa]">This Month</p>
                  <p className="font-bold text-[#f1f1f1]">₹{currentMonthExpenses.toLocaleString()}</p>
                </div>
                <div className="glass p-3 rounded-lg">
                  <p className="text-sm text-[#a1a1aa]">Last Month</p>
                  <p className="font-bold text-[#f1f1f1]">₹{lastMonthSpending.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-center p-3 bg-[#00FFD1] bg-opacity-10 rounded-lg">
                <p className="text-sm text-[#00FFD1]">
                  {spendingChange < 0 ? '🎉 Great job saving money!' : '💡 Consider reviewing your budget'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'debt-summary':
        return (
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#f1f1f1]">Debt Summary</h3>
              <Link to="/debts" className="text-[#00FFD1] hover:text-[#667eea] transition-colors">
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-[#10b981]">
                    ₹{debts.filter(d => d.type === 'lent' && d.status === 'pending').reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-[#a1a1aa]">Money Owed to You</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[#ef4444]">
                    ₹{debts.filter(d => d.type === 'borrowed' && d.status === 'pending').reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-[#a1a1aa]">Money You Owe</p>
                </div>
              </div>
              {debts.filter(d => d.status === 'pending').slice(0, 2).map(debt => (
                <div key={debt.id} className="flex items-center justify-between p-3 glass rounded-lg">
                  <div>
                    <p className="text-[#f1f1f1] font-medium">{debt.personName}</p>
                    <p className="text-sm text-[#a1a1aa]">{debt.description}</p>
                  </div>
                  <span className={`font-semibold ${debt.type === 'lent' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                    {debt.type === 'lent' ? '+' : '-'}₹{debt.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-6 min-h-screen">
      {/* Inline Quick Entry */}
      <InlineQuickEntry />

      {/* Quick Stats */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#f1f1f1]">Financial Overview</h2>
          <button
            onClick={() => setShowWidgetManager(true)}
            className="p-2 glass rounded-lg hover:glass-card transition-all duration-300"
            title="Manage Widgets"
          >
            <Settings size={20} className="text-[#a1a1aa]" />
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass p-4 rounded-xl text-center">
            <TrendingUp size={24} className="text-[#00FFD1] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">₹{totalBudgetSpent.toLocaleString()}</p>
            <p className="text-xs text-[#a1a1aa]">Spent This Month</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <Target size={24} className="text-[#667eea] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">₹{totalGoalProgress.toLocaleString()}</p>
            <p className="text-xs text-[#a1a1aa]">Goals Progress</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <PiggyBank size={24} className="text-[#10b981] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">₹{(totalBudgetLimit - totalBudgetSpent).toLocaleString()}</p>
            <p className="text-xs text-[#a1a1aa]">Budget Remaining</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <Users size={24} className="text-[#f59e0b] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">₹{totalDebtAmount.toLocaleString()}</p>
            <p className="text-xs text-[#a1a1aa]">Active Debts</p>
          </div>
        </div>
      </div>

      {/* Active Nudges */}
      {activeNudges.length > 0 && (
        <div className="space-y-3">
          {activeNudges.slice(0, 3).map(nudge => (
            <div key={nudge.id} className={`glass-card p-4 rounded-xl border-l-4 ${
              nudge.priority === 'high' ? 'border-[#ef4444]' : 
              nudge.priority === 'medium' ? 'border-[#f59e0b]' : 'border-[#00FFD1]'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className={
                    nudge.priority === 'high' ? 'text-[#ef4444]' : 
                    nudge.priority === 'medium' ? 'text-[#f59e0b]' : 'text-[#00FFD1]'
                  } />
                  <div>
                    <p className="text-[#f1f1f1] font-medium">{nudge.message}</p>
                    {nudge.actionLink && (
                      <Link 
                        to={nudge.actionLink} 
                        className="text-sm text-[#00FFD1] hover:text-[#667eea] transition-colors"
                      >
                        Take Action →
                      </Link>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => dismissNudge(nudge.id)}
                  className="p-1 rounded-lg hover:bg-[#26262a] transition-colors"
                >
                  <X size={16} className="text-[#a1a1aa]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Reviews */}
      {(pendingSmsTransactions.length > 0 || pendingReceiptTransactions.length > 0) && (
        <div className="glass-card p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">Pending Reviews</h3>
          <div className="grid gap-3">
            {pendingSmsTransactions.length > 0 && (
              <Link
                to="/sms-review"
                className="flex items-center justify-between p-3 glass rounded-lg hover:glass-card transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <MessageSquareText size={20} className="text-[#00FFD1]" />
                  <div>
                    <p className="text-[#f1f1f1] font-medium">SMS Transactions</p>
                    <p className="text-sm text-[#a1a1aa]">{pendingSmsTransactions.length} pending</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-[#a1a1aa]" />
              </Link>
            )}
            {pendingReceiptTransactions.length > 0 && (
              <Link
                to="/receipt-review"
                className="flex items-center justify-between p-3 glass rounded-lg hover:glass-card transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Camera size={20} className="text-[#667eea]" />
                  <div>
                    <p className="text-[#f1f1f1] font-medium">Receipt Scans</p>
                    <p className="text-sm text-[#a1a1aa]">{pendingReceiptTransactions.length} pending</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-[#a1a1aa]" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/"
            className="flex flex-col items-center gap-2 p-4 glass rounded-xl hover:glass-card transition-all duration-300"
          >
            <Plus size={24} className="text-[#00FFD1]" />
            <span className="text-sm font-medium text-[#f1f1f1]">Quick Add</span>
          </Link>
          <Link
            to="/budgets"
            className="flex flex-col items-center gap-2 p-4 glass rounded-xl hover:glass-card transition-all duration-300"
          >
            <Target size={24} className="text-[#667eea]" />
            <span className="text-sm font-medium text-[#f1f1f1]">Set Budget</span>
          </Link>
          <Link
            to="/goals"
            className="flex flex-col items-center gap-2 p-4 glass rounded-xl hover:glass-card transition-all duration-300"
          >
            <PiggyBank size={24} className="text-[#10b981]" />
            <span className="text-sm font-medium text-[#f1f1f1]">Add Goal</span>
          </Link>
          <Link
            to="/debts"
            className="flex flex-col items-center gap-2 p-4 glass rounded-xl hover:glass-card transition-all duration-300"
          >
            <Users size={24} className="text-[#f59e0b]" />
            <span className="text-sm font-medium text-[#f1f1f1]">Track Debt</span>
          </Link>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={enabledWidgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
          <div className="responsive-grid">
            {enabledWidgets.map(widget => (
              <SortableWidget key={widget.id} id={widget.id}>
                {renderWidget(widget)}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {/* Widget Manager Modal */}
      <WidgetManager 
        isOpen={showWidgetManager} 
        onClose={() => setShowWidgetManager(false)} 
      />
    </div>
  );
};

export default DashboardPage;