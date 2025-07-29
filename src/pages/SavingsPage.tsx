import React from 'react';
import { PiggyBank, TrendingUp, Target, Award } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';

const SavingsPage: React.FC = () => {
  // Mock data
  const savingsData = [
    { month: 'Jan', saved: 5000, spent: 15000 },
    { month: 'Feb', saved: 7500, spent: 12000 },
    { month: 'Mar', saved: 6000, spent: 14000 },
    { month: 'Apr', saved: 8500, spent: 11500 },
    { month: 'May', saved: 9000, spent: 11000 },
    { month: 'Jun', saved: 10500, spent: 9500 }
  ];

  const totalSavings = savingsData.reduce((sum, item) => sum + item.saved, 0);
  const avgMonthlySavings = totalSavings / savingsData.length;
  const savingsStreak = 45; // days

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f1f1f1]">Savings Summary</h1>
        <p className="text-[#a1a1aa]">Track your saving progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank size={16} className="text-[#00FFD1]" />
            <span className="text-sm text-[#a1a1aa]">Total Saved</span>
          </div>
          <p className="text-2xl font-bold text-[#f1f1f1]">₹{totalSavings.toLocaleString()}</p>
        </div>
        
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[#38bdf8]" />
            <span className="text-sm text-[#a1a1aa]">Monthly Avg</span>
          </div>
          <p className="text-2xl font-bold text-[#f1f1f1]">₹{Math.round(avgMonthlySavings).toLocaleString()}</p>
        </div>
        
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-[#f59e0b]" />
            <span className="text-sm text-[#a1a1aa]">Saving Streak</span>
          </div>
          <p className="text-2xl font-bold text-[#f1f1f1]">{savingsStreak} days</p>
        </div>
        
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-[#a855f7]" />
            <span className="text-sm text-[#a1a1aa]">Save Rate</span>
          </div>
          <p className="text-2xl font-bold text-[#f1f1f1]">32%</p>
        </div>
      </div>

      {/* Savings Trend */}
      <div className="glass-card p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">Savings Trend</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savingsData}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FFD1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00FFD1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="saved" 
                stroke="#00FFD1" 
                strokeWidth={3}
                fill="url(#savingsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spend vs Save */}
      <div className="glass-card p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">Spend vs Save Ratio</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={savingsData}>
              <Line 
                type="monotone" 
                dataKey="spent" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 3 }}
                name="Spent"
              />
              <Line 
                type="monotone" 
                dataKey="saved" 
                stroke="#00FFD1" 
                strokeWidth={2}
                dot={{ fill: '#00FFD1', r: 3 }}
                name="Saved"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ef4444] rounded-full"></div>
            <span className="text-sm text-[#a1a1aa]">Spent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00FFD1] rounded-full"></div>
            <span className="text-sm text-[#a1a1aa]">Saved</span>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="glass-card p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">Saving Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#00FFD1] rounded-full mt-2"></div>
            <div>
              <p className="text-[#f1f1f1] font-medium">Most saved by skipping coffee</p>
              <p className="text-sm text-[#a1a1aa]">You saved ₹2,400 this month by making coffee at home</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#38bdf8] rounded-full mt-2"></div>
            <div>
              <p className="text-[#f1f1f1] font-medium">Transportation savings</p>
              <p className="text-sm text-[#a1a1aa]">Walking and cycling saved you ₹1,800 last week</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#f59e0b] rounded-full mt-2"></div>
            <div>
              <p className="text-[#f1f1f1] font-medium">Best saving day</p>
              <p className="text-sm text-[#a1a1aa]">Sundays are your highest saving days - 65% save rate!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsPage;