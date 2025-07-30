import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Trash2, Users, DollarSign, Percent, X, Check, Copy, ArrowRight, AlertTriangle, User, CreditCard, Receipt, CheckCircle2, ArrowDown, UserPlus, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Participant {
  id: string;
  name: string;
  phoneNumber: string;
  amountPaid: number;
  shareAmount: number;
  percentage?: number;
  color: string;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
  fromColor: string;
  toColor: string;
}

const SplitExpensePage: React.FC = () => {
  const { addSplitExpense, showToast, friends, getFriendById } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedFriendId = searchParams.get('friend');
  
  // Core state
  const [currentStep, setCurrentStep] = useState(1);
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom' | 'percentage'>('equal');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'You', phoneNumber: '', amountPaid: 0, shareAmount: 0, color: '#00FFD1' },
    { id: '2', name: '', phoneNumber: '', amountPaid: 0, shareAmount: 0, color: '#667eea' }
  ]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [showFriendSelector, setShowFriendSelector] = useState<string | null>(null);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');

  // Pre-populate friend if coming from chat
  useEffect(() => {
    if (preSelectedFriendId && participants.length >= 2) {
      const friend = getFriendById(preSelectedFriendId);
      if (friend) {
        setParticipants(prev => 
          prev.map((p, index) => 
            index === 1 ? { ...p, name: friend.name, phoneNumber: friend.phoneNumber } : p
          )
        );
        showToast(`Added ${friend.name} to split`, 'success');
      }
    }
  }, [preSelectedFriendId, getFriendById, showToast]);

  // Available colors for participants
  const participantColors = [
    '#00FFD1', '#667eea', '#f093fb', '#fbbf24', '#10b981', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f59e0b', '#ec4899', '#6366f1'
  ];

  // Steps configuration
  const steps = [
    { number: 1, title: 'Expense Details', desc: 'What and how much?' },
    { number: 2, title: 'Who Paid', desc: 'Who put money in?' },
    { number: 3, title: 'How to Split', desc: 'How to divide the cost?' },
    { number: 4, title: 'Review & Create', desc: 'Finalize the split' }
  ];

  // Real-time share calculation
  useEffect(() => {
    if (!totalAmount || parseFloat(totalAmount) <= 0) return;
    
    const total = parseFloat(totalAmount);
    let updatedParticipants = [...participants];

    switch (splitType) {
      case 'equal':
        const equalShare = total / participants.length;
        updatedParticipants = participants.map(p => ({
          ...p,
          shareAmount: equalShare
        }));
        break;

      case 'percentage':
        updatedParticipants = participants.map(p => ({
          ...p,
          shareAmount: (total * (p.percentage || 0)) / 100
        }));
        break;

      case 'custom':
        // Custom amounts are set manually by user
        break;
    }

    setParticipants(updatedParticipants);
  }, [totalAmount, splitType, participants.length]);

  const addParticipant = () => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: '',
      phoneNumber: '',
      amountPaid: 0,
      shareAmount: 0,
      percentage: splitType === 'percentage' ? 0 : undefined,
      color: participantColors[participants.length % participantColors.length]
    };
    setParticipants([...participants, newParticipant]);
  };

  const removeParticipant = (id: string) => {
    if (participants.length > 2) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const updateParticipant = (id: string, field: keyof Participant, value: string | number) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };
  
  const selectFriendForParticipant = (participantId: string, friend: any) => {
    setParticipants(participants.map(p => 
      p.id === participantId 
        ? { ...p, name: friend.name, phoneNumber: friend.phoneNumber }
        : p
    ));
    setShowFriendSelector(null);
    setFriendSearchQuery('');
    showToast(`Added ${friend.name} to split`, 'success');
  };
  
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(friendSearchQuery.toLowerCase()) ||
    friend.phoneNumber.includes(friendSearchQuery)
  );

  const calculateSettlements = (): Settlement[] => {
    // Calculate net balance for each participant (shareAmount - amountPaid)
    const balances = participants.map(p => ({
      name: p.name,
      balance: p.shareAmount - p.amountPaid,
      color: p.color
    }));

    // Separate creditors (negative balance - they overpaid) and debtors (positive balance - they underpaid)
    const creditors = balances.filter(b => b.balance < -0.01).sort((a, b) => a.balance - b.balance);
    const debtors = balances.filter(b => b.balance > 0.01).sort((a, b) => b.balance - a.balance);

    const settlements: Settlement[] = [];
    let i = 0, j = 0;

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      
      const amount = Math.min(Math.abs(creditor.balance), debtor.balance);
      
      if (amount > 0.01) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(amount * 100) / 100,
          fromColor: debtor.color,
          toColor: creditor.color
        });
      }

      creditor.balance += amount;
      debtor.balance -= amount;

      if (Math.abs(creditor.balance) < 0.01) i++;
      if (Math.abs(debtor.balance) < 0.01) j++;
    }

    return settlements;
  };

  const validateCurrentStep = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    switch (currentStep) {
      case 1:
        if (!description.trim()) errors.push('Description is required');
        if (!totalAmount || parseFloat(totalAmount) <= 0) errors.push('Valid total amount is required');
        break;
        
      case 2:
        const emptyNames = participants.filter(p => !p.name.trim());
        if (emptyNames.length > 0) errors.push('All participant names are required');
        
        const emptyPhones = participants.filter(p => !p.phoneNumber.trim());
        if (emptyPhones.length > 0) errors.push('All participant phone numbers are required');
        
        const totalPaid = getTotalPaid();
        const total = parseFloat(totalAmount);
        if (Math.abs(totalPaid - total) > 0.01) {
          errors.push(`Total paid (₹${totalPaid.toFixed(2)}) must equal expense amount (₹${total.toFixed(2)})`);
        }
        break;
        
      case 3:
        if (splitType === 'percentage') {
          const totalPercentage = getTotalPercentage();
          if (Math.abs(totalPercentage - 100) > 0.01) {
            errors.push(`Percentages must add up to 100% (currently ${totalPercentage.toFixed(1)}%)`);
          }
        }
        
        if (splitType === 'custom') {
          const totalShares = getTotalShares();
          const total = parseFloat(totalAmount);
          if (Math.abs(totalShares - total) > 0.01) {
            errors.push(`Share amounts must equal total expense (₹${totalShares.toFixed(2)} ≠ ₹${total.toFixed(2)})`);
          }
        }
        break;
    }

    return { isValid: errors.length === 0, errors };
  };

  const nextStep = () => {
    const validation = validateCurrentStep();
    if (!validation.isValid) {
      validation.errors.forEach(error => showToast(error, 'error'));
      return;
    }
    
    if (currentStep === 4) {
      handleCreateDebts();
    } else if (currentStep === 3) {
      const calculatedSettlements = calculateSettlements();
      setSettlements(calculatedSettlements);
      setCurrentStep(4);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateDebts = () => {
    addSplitExpense({
      description: description.trim(),
      totalAmount: parseFloat(totalAmount),
      participants,
      splitType
    });

    navigate('/debts');
  };

  const getTotalPaid = () => {
    return participants.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
  };

  const getTotalPercentage = () => {
    return participants.reduce((sum, p) => sum + (p.percentage || 0), 0);
  };

  const getTotalShares = () => {
    return participants.reduce((sum, p) => sum + (p.shareAmount || 0), 0);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setDescription('');
    setTotalAmount('');
    setSplitType('equal');
    setParticipants([
      { id: '1', name: 'You', phoneNumber: '', amountPaid: 0, shareAmount: 0, color: '#00FFD1' },
      { id: '2', name: '', phoneNumber: '', amountPaid: 0, shareAmount: 0, color: '#667eea' }
    ]);
    setSettlements([]);
  };

  const assignTotalToFirstParticipant = () => {
    if (totalAmount && participants.length > 0) {
      updateParticipant(participants[0].id, 'amountPaid', parseFloat(totalAmount));
      showToast('Total amount assigned to first participant', 'success');
    }
  };

  const splitTypeOptions = [
    { 
      key: 'equal', 
      label: 'Equal Split', 
      icon: Users, 
      desc: 'Everyone pays the same amount',
      gradient: 'from-[#00FFD1] to-[#667eea]'
    },
    { 
      key: 'percentage', 
      label: 'By Percentage', 
      icon: Percent, 
      desc: 'Split by custom percentages',
      gradient: 'from-[#667eea] to-[#764ba2]'
    },
    { 
      key: 'custom', 
      label: 'Custom Amounts', 
      icon: DollarSign, 
      desc: 'Enter specific amounts for each person',
      gradient: 'from-[#f093fb] to-[#f5576c]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e10] p-4 space-y-6">
      {/* Header with Progress */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center">
              <Calculator size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#f1f1f1]">Split Expense</h1>
              <p className="text-sm text-[#a1a1aa]">Divide expenses fairly among friends</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetForm}
              className="p-2 sm:p-3 glass rounded-lg hover:glass-card transition-all duration-300"
              title="Reset Form"
            >
              <X size={16} className="text-[#a1a1aa]" />
            </button>
            <button
              onClick={() => navigate('/debts')}
              className="p-2 sm:p-3 glass rounded-lg hover:glass-card transition-all duration-300"
              title="Back to Debts"
            >
              <ArrowRight size={16} className="text-[#a1a1aa]" />
            </button>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-r from-[#00FFD1] to-[#667eea] text-white shadow-lg'
                    : 'glass text-[#a1a1aa]'
                }`}>
                  {currentStep > step.number ? <Check size={16} /> : step.number}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-xs sm:text-sm font-medium ${
                    currentStep >= step.number ? 'text-[#f1f1f1]' : 'text-[#a1a1aa]'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-[#a1a1aa] hidden sm:block">{step.desc}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-all duration-300 ${
                  currentStep > step.number ? 'bg-gradient-to-r from-[#00FFD1] to-[#667eea]' : 'bg-[#3d3d42]'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Expense Details */}
      {currentStep === 1 && (
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Receipt size={24} className="text-[#00FFD1]" />
            <h3 className="text-xl font-semibold text-[#f1f1f1]">Expense Details</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-3">What was this expense for?</label>
              <input
                type="text"
                placeholder="e.g., Dinner at The Grand, Weekend Trip to Goa, Movie Night"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 input-field rounded-xl text-lg"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-3">Total Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a1a1aa] text-lg font-semibold">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 input-field rounded-xl text-lg font-semibold"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Who Paid */}
      {currentStep === 2 && (
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CreditCard size={24} className="text-[#667eea]" />
              <div>
                <h3 className="text-xl font-semibold text-[#f1f1f1]">Who Paid the Bill?</h3>
                <p className="text-sm text-[#a1a1aa]">Enter who actually paid money towards this ₹{parseFloat(totalAmount || '0').toLocaleString()} expense</p>
              </div>
            </div>
            <button
              onClick={addParticipant}
              className="btn-gradient p-2 sm:p-3 rounded-lg text-white flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Person</span>
            </button>
          </div>

          {/* Quick Action */}
          <div className="mb-6 p-4 glass rounded-xl border border-[#00FFD1] border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#00FFD1]">💡 Quick Action</p>
                <p className="text-xs text-[#a1a1aa]">One person paid the entire bill?</p>
              </div>
              <button
                onClick={assignTotalToFirstParticipant}
                className="text-sm btn-gradient py-2 px-4 rounded-lg text-white"
              >
                Assign to "{participants[0]?.name || 'First Person'}"
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={participant.id} className="glass p-4 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: participant.color }}
                    >
                      {participant.name.charAt(0).toUpperCase() || (index + 1)}
                    </div>
                    <h4 className="font-medium text-[#f1f1f1]">Person {index + 1}</h4>
                  </div>
                  {participants.length > 2 && (
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="p-2 rounded-lg bg-[#ef4444] bg-opacity-20 text-[#ef4444] hover:bg-opacity-30 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#a1a1aa] mb-2">Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={index === 0 ? "You" : "Enter name or select friend"}
                        value={participant.name}
                        onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                        className="w-full p-3 pr-10 input-field rounded-lg"
                        disabled={index === 0}
                      />
                      {index > 0 && (
                        <button
                          onClick={() => setShowFriendSelector(showFriendSelector === participant.id ? null : participant.id)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-[#26262a] transition-colors"
                        >
                          <UserPlus size={16} className="text-[#00FFD1]" />
                        </button>
                      )}
                      
                      {/* Friend Selector Dropdown */}
                      {showFriendSelector === participant.id && (
                        <div className="absolute top-full left-0 right-0 mt-2 glass border border-[#3d3d42] rounded-xl p-3 z-10 max-h-64 overflow-y-auto">
                          <div className="mb-3">
                            <div className="relative">
                              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a1a1aa]" />
                              <input
                                type="text"
                                placeholder="Search friends..."
                                value={friendSearchQuery}
                                onChange={(e) => setFriendSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 input-field rounded-lg text-sm"
                              />
                            </div>
                          </div>
                          
                          {filteredFriends.length > 0 ? (
                            <div className="space-y-2">
                              {filteredFriends.map((friend) => (
                                <button
                                  key={friend.id}
                                  onClick={() => selectFriendForParticipant(participant.id, friend)}
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
                                <button
                                  onClick={() => {
                                    navigate('/friends');
                                  }}
                                  className="text-xs text-[#00FFD1] hover:text-[#667eea] transition-colors mt-1"
                                >
                                  Add friends first →
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[#a1a1aa] mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={participant.phoneNumber}
                      onChange={(e) => updateParticipant(participant.id, 'phoneNumber', e.target.value)}
                      className="w-full p-3 input-field rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[#a1a1aa] mb-2">Amount Paid (₹) *</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={participant.amountPaid || ''}
                      onChange={(e) => updateParticipant(participant.id, 'amountPaid', parseFloat(e.target.value) || 0)}
                      className="w-full p-3 input-field rounded-lg"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="mt-6 p-4 glass rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#a1a1aa]">Total Paid by Everyone:</span>
              <div className="text-right">
                <span className={`text-lg font-bold ${
                  Math.abs(getTotalPaid() - parseFloat(totalAmount || '0')) < 0.01 
                    ? 'text-[#10b981]' 
                    : 'text-[#ef4444]'
                }`}>
                  ₹{getTotalPaid().toFixed(2)}
                </span>
                <p className="text-xs text-[#a1a1aa]">
                  Should be ₹{parseFloat(totalAmount || '0').toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: How to Split */}
      {currentStep === 3 && (
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Users size={24} className="text-[#f093fb]" />
            <div>
              <h3 className="text-xl font-semibold text-[#f1f1f1]">How Should We Split This?</h3>
              <p className="text-sm text-[#a1a1aa]">Choose how to divide the ₹{parseFloat(totalAmount || '0').toLocaleString()} expense</p>
            </div>
          </div>

          {/* Split Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {splitTypeOptions.map(({ key, label, icon: Icon, desc, gradient }) => (
              <button
                key={key}
                onClick={() => setSplitType(key as any)}
                className={`p-4 rounded-xl text-center transition-all duration-300 border-2 ${
                  splitType === key
                    ? `bg-gradient-to-r ${gradient} text-white shadow-lg border-transparent transform scale-105`
                    : 'glass hover:glass-card text-[#a1a1aa] hover:text-[#f1f1f1] border-transparent hover:border-[#3d3d42]'
                }`}
              >
                <Icon size={24} className="mx-auto mb-2" />
                <div className="text-sm font-medium mb-1">{label}</div>
                <div className="text-xs opacity-80">{desc}</div>
              </button>
            ))}
          </div>

          {/* Participant Shares */}
          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={participant.id} className="glass p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: participant.color }}
                  >
                    {participant.name.charAt(0).toUpperCase() || (index + 1)}
                  </div>
                  <h4 className="font-medium text-[#f1f1f1]">{participant.name}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {splitType === 'percentage' && (
                    <div>
                      <label className="block text-xs text-[#a1a1aa] mb-2">Percentage (%)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={participant.percentage || ''}
                        onChange={(e) => updateParticipant(participant.id, 'percentage', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 input-field rounded-lg"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                    </div>
                  )}
                  
                  {splitType === 'custom' && (
                    <div>
                      <label className="block text-xs text-[#a1a1aa] mb-2">Share Amount (₹)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={participant.shareAmount || ''}
                        onChange={(e) => updateParticipant(participant.id, 'shareAmount', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 input-field rounded-lg"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs text-[#a1a1aa] mb-2">Their Share</label>
                    <div className="w-full p-3 glass rounded-lg">
                      <span className="font-bold text-[#00FFD1]">₹{participant.shareAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Split Summary */}
          <div className="mt-6 space-y-3">
            {splitType === 'percentage' && (
              <div className={`p-4 glass rounded-xl flex items-center justify-between ${
                Math.abs(getTotalPercentage() - 100) < 0.01 ? 'border border-[#10b981]' : 'border border-[#ef4444]'
              }`}>
                <span className="text-sm text-[#a1a1aa]">Total Percentage:</span>
                <span className={`font-bold ${
                  Math.abs(getTotalPercentage() - 100) < 0.01 ? 'text-[#10b981]' : 'text-[#ef4444]'
                }`}>
                  {getTotalPercentage().toFixed(1)}%
                </span>
              </div>
            )}
            
            <div className={`p-4 glass rounded-xl flex items-center justify-between ${
              Math.abs(getTotalShares() - parseFloat(totalAmount || '0')) < 0.01 ? 'border border-[#10b981]' : 'border border-[#ef4444]'
            }`}>
              <span className="text-sm text-[#a1a1aa]">Total Shares:</span>
              <div className="text-right">
                <span className={`font-bold ${
                  Math.abs(getTotalShares() - parseFloat(totalAmount || '0')) < 0.01 ? 'text-[#10b981]' : 'text-[#ef4444]'
                }`}>
                  ₹{getTotalShares().toFixed(2)}
                </span>
                <p className="text-xs text-[#a1a1aa]">
                  Should be ₹{parseFloat(totalAmount || '0').toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review & Settlement */}
      {currentStep === 4 && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="glass-card p-4 sm:p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 size={24} className="text-[#10b981]" />
              <h3 className="text-xl font-semibold text-[#f1f1f1]">Expense Summary</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass p-4 rounded-xl text-center">
                <p className="text-sm text-[#a1a1aa]">Total Expense</p>
                <p className="text-xl font-bold text-[#f1f1f1]">₹{parseFloat(totalAmount).toFixed(2)}</p>
              </div>
              <div className="glass p-4 rounded-xl text-center">
                <p className="text-sm text-[#a1a1aa]">Participants</p>
                <p className="text-xl font-bold text-[#f1f1f1]">{participants.length}</p>
              </div>
              <div className="glass p-4 rounded-xl text-center">
                <p className="text-sm text-[#a1a1aa]">Split Method</p>
                <p className="text-xl font-bold text-[#f1f1f1] capitalize">{splitType}</p>
              </div>
              <div className="glass p-4 rounded-xl text-center">
                <p className="text-sm text-[#a1a1aa]">Transfers Needed</p>
                <p className="text-xl font-bold text-[#f1f1f1]">{settlements.length}</p>
              </div>
            </div>

            <div className="glass p-4 rounded-xl">
              <h4 className="font-semibold text-[#f1f1f1] mb-3">"{description}"</h4>
              <div className="text-sm text-[#a1a1aa]">
                Split {splitType === 'equal' ? 'equally' : `by ${splitType}`} among {participants.length} people
              </div>
            </div>
          </div>

          {/* Settlement Details */}
          <div className="glass-card p-4 sm:p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">💸 Who Pays Whom</h3>
            
            {settlements.length === 0 ? (
              <div className="text-center p-8 bg-[#10b981] bg-opacity-10 rounded-xl border border-[#10b981] border-opacity-30">
                <CheckCircle2 size={48} className="text-[#10b981] mx-auto mb-4" />
                <h4 className="text-xl font-bold text-[#10b981] mb-2">Perfect Balance! 🎉</h4>
                <p className="text-[#a1a1aa]">Everyone paid exactly what they owe. No transfers needed!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {settlements.map((settlement, index) => (
                  <div key={index} className="flex items-center justify-between p-4 glass rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: settlement.fromColor }}
                        >
                          {settlement.from.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#f1f1f1]">{settlement.from}</span>
                      </div>
                      
                      <ArrowRight size={20} className="text-[#a1a1aa]" />
                      
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: settlement.toColor }}
                        >
                          {settlement.to.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#f1f1f1]">{settlement.to}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#00FFD1]">₹{settlement.amount.toFixed(2)}</p>
                      <p className="text-xs text-[#a1a1aa]">to be paid</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pb-6">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="flex-1 glass py-4 rounded-xl font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300"
          >
            ← Previous
          </button>
        )}
        
        <button
          onClick={nextStep}
          className="flex-1 btn-gradient py-4 rounded-xl font-medium text-white flex items-center justify-center gap-2"
        >
          {currentStep === 4 ? (
            <>
              <Check size={20} />
              Create Debts & Finish
            </>
          ) : currentStep === 3 ? (
            <>
              <Calculator size={20} />
              Calculate Settlement
            </>
          ) : (
            <>
              Next →
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SplitExpensePage;