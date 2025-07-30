import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const SpendingPage: React.FC = () => {
  const { period } = useParams<{ period: string }>();
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');

  // Mock data
  const lineData = [
    { name: 'Mon', amount: 2400 },
    { name: 'Tue', amount: 1398 },
    { name: 'Wed', amount: 9800 },
    { name: 'Thu', amount: 3908 },
    { name: 'Fri', amount: 4800 },
    { name: 'Sat', amount: 3800 },
    { name: 'Sun', amount: 4300 }
  ];

  const categoryData = [
    { name: 'Food', value: 4000, color: '#00FFD1' },
    { name: 'Transport', value: 3000, color: '#38bdf8' },
    { name: 'Shopping', value: 2000, color: '#a855f7' },
    { name: 'Bills', value: 1500, color: '#f59e0b' },
    { name: 'Others', value: 1000, color: '#ef4444' }
  ];

  const getTitle = () => {
    switch (period) {
      case 'daily': return 'Daily Spending';
      case 'weekly': return 'Weekly Spending';
      case 'monthly': return 'Monthly Spending';
      default: return 'Spending Analysis';
    }
  };

  const totalSpent = lineData.reduce((sum, item) => sum + item.amount, 0);

  const renderLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  const chartTypeOptions = [
    { type: 'line' as const, icon: TrendingUp, label: 'Trend' },
    { type: 'bar' as const, icon: BarChart3, label: 'Bars' },
    { type: 'pie' as const, icon: PieChart, label: 'Categories' }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#f1f1f1]">{getTitle()}</h1>
            <p className="text-[#a1a1aa]">Track your spending patterns and trends</p>
          </div>
          <button className="p-3 glass rounded-xl hover:glass-card transition-all duration-300">
            <Calendar size={20} className="text-[#a1a1aa]" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-4 rounded-xl text-center">
            <TrendingUp size={24} className="text-[#00FFD1] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">₹{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-[#a1a1aa]">Total Spent</p>
          </div>
          
          <div className="glass p-4 rounded-xl text-center">
            <TrendingDown size={24} className="text-[#667eea] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#f1f1f1]">₹{Math.round(totalSpent / lineData.length).toLocaleString()}</p>
            <p className="text-xs text-[#a1a1aa]">Daily Average</p>
          </div>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex glass p-1 rounded-xl">
        {chartTypeOptions.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 ${
              chartType === type
                ? 'bg-gradient-to-r from-[#00FFD1] to-[#667eea] text-white shadow-lg'
                : 'text-[#a1a1aa] hover:text-[#f1f1f1] hover:bg-[#26262a]'
            }`}
          >
            <Icon size={16} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">
          {chartType === 'pie' ? 'Spending by Category' : 'Spending Trend'}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' && (
              <LineChart data={lineData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#00FFD1" 
                  strokeWidth={3}
                  dot={{ fill: '#00FFD1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#00FFD1' }}
                />
              </LineChart>
            )}
            
            {chartType === 'bar' && (
              <BarChart data={lineData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <Bar dataKey="amount" fill="#00FFD1" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
            
            {chartType === 'pie' && (
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderLabel}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Categories */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">Top Categories</h3>
        <div className="space-y-3">
          {categoryData.slice(0, 3).map((category, index) => (
            <div key={category.name} className="flex items-center justify-between p-3 glass rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#a1a1aa]">#{index + 1}</span>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
                <span className="text-[#f1f1f1] font-medium">{category.name}</span>
              </div>
              <span className="text-[#f1f1f1] font-semibold">₹{category.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingPage;