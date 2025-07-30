import React from 'react';
import { BookOpen, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const StoryPage: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f1f1f1]">Your Finance Story</h1>
        <p className="text-[#a1a1aa]">AI-generated insights about your money habits</p>
      </div>

      {/* Story Card */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen size={24} className="text-[#00FFD1]" />
          <h2 className="text-xl font-semibold text-[#f1f1f1]">This Month's Story</h2>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-[#f1f1f1] leading-relaxed mb-4">
            This month has been quite the financial journey! You started strong with disciplined spending in the first week, 
            keeping your daily average around ₹800. Your biggest win? <span className="text-[#00FFD1] font-semibold">Cutting down on food delivery by 60%</span> - 
            that alone saved you ₹4,200!
          </p>
          
          <p className="text-[#f1f1f1] leading-relaxed mb-4">
            Mid-month brought some challenges though. That weekend shopping spree on the 15th? 
            <span className="text-[#ef4444] font-semibold">₹8,500 in one day</span> - mostly on clothes and gadgets. 
            But hey, we all have those moments! The good news is you bounced back quickly.
          </p>
          
          <p className="text-[#f1f1f1] leading-relaxed mb-6">
            Your fuel expenses show an interesting pattern - you're getting better mileage lately! 
            From 35 km/l to 42 km/l. Either you've mastered eco-driving or that bike service really paid off. 
            <span className="text-[#00FFD1] font-semibold">Environmental win AND wallet win!</span>
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid gap-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={20} className="text-[#00FFD1]" />
            <h3 className="font-semibold text-[#f1f1f1]">Spending Patterns</h3>
          </div>
          <ul className="space-y-2 text-sm text-[#a1a1aa]">
            <li>• Weekends: 40% higher spending than weekdays</li>
            <li>• Peak spending time: 7-9 PM (dinner rush!)</li>
            <li>• Most disciplined day: Tuesdays</li>
          </ul>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign size={20} className="text-[#38bdf8]" />
            <h3 className="font-semibold text-[#f1f1f1]">Category Champions</h3>
          </div>
          <ul className="space-y-2 text-sm text-[#a1a1aa]">
            <li>• Food: Reduced by 25% vs last month</li>
            <li>• Transport: Most consistent category</li>
            <li>• Entertainment: Slight increase (+15%)</li>
          </ul>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <TrendingDown size={20} className="text-[#f59e0b]" />
            <h3 className="font-semibold text-[#f1f1f1]">Money-Saving Moves</h3>
          </div>
          <ul className="space-y-2 text-sm text-[#a1a1aa]">
            <li>• Home cooking streak: 12 days (personal best!)</li>
            <li>• Public transport usage: Up 30%</li>
            <li>• Bulk buying saved ₹1,200 on groceries</li>
          </ul>
        </div>
      </div>

      {/* Future Predictions */}
      <div className="glass-card p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">Next Month Predictions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#26262a] rounded-lg">
            <span className="text-[#f1f1f1]">Projected Spending</span>
            <span className="text-[#00FFD1] font-semibold">₹18,500</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#26262a] rounded-lg">
            <span className="text-[#f1f1f1]">Savings Potential</span>
            <span className="text-[#00FFD1] font-semibold">₹3,200</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#26262a] rounded-lg">
            <span className="text-[#f1f1f1]">Confidence Level</span>
            <span className="text-[#f59e0b] font-semibold">87%</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="glass-card p-4 rounded-xl border border-[#00FFD1] border-opacity-30 bg-gradient-to-r from-[#00FFD1] to-[#38bdf8] bg-opacity-10">
        <h3 className="text-lg font-semibold text-[#00FFD1] mb-3">💡 Smart Tip for Next Month</h3>
        <p className="text-[#f1f1f1]">
          Based on your patterns, try the "50/30/20 rule" - 50% needs, 30% wants, 20% savings. 
          You're already close at 52/35/13. Just shift 7% from wants to savings!
        </p>
      </div>
    </div>
  );
};

export default StoryPage;