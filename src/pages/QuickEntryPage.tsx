import React, { useState, useEffect } from 'react';
import { Check, X, Plus, MapPin, Bookmark, Trash2, Save } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const QuickEntryPage: React.FC = () => {
  const { 
    addMessage, 
    showToast, 
    locationSuggestions,
    updateLocationSuggestions,
    quickEntryTemplates,
    addQuickEntryTemplate,
    deleteQuickEntryTemplate
  } = useApp();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<'amount' | 'description'>('amount');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Numpad buttons without backspace
  const numpadButtons = [
    '1', '2', '3',
    '4', '5', '6', 
    '7', '8', '9',
    '.', '0', '✓'
  ];

  const triggerVibration = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration
    }
  };
  
  const handleUseLocationSuggestion = (suggestion: any) => {
    triggerVibration();
    setAmount(suggestion.estimatedAmount.toString());
    setDescription(suggestion.merchantName);
    setStep('amount'); // Keep on amount step for editing
    showToast(`Pre-filled from ${suggestion.merchantName}`, 'success');
  };

  const handleUseTemplate = (template: any) => {
    triggerVibration();
    setAmount(template.amount.toString());
    setDescription(template.name);
    setStep('amount'); // Keep on amount step for editing
    showToast(`Using template: ${template.name}`, 'success');
  };

  const handleSaveAsTemplate = () => {
    if (!templateName.trim()) {
      showToast('Please enter a template name', 'error');
      return;
    }

    const newTemplate = {
      name: templateName.trim(),
      amount: parseFloat(amount),
      description: description.trim(),
      category: 'General'
    };

    addQuickEntryTemplate(newTemplate);
    showToast(`Template "${templateName}" saved!`, 'success');
    setShowSaveTemplate(false);
    setTemplateName('');
  };

  // Request location permission and get current location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setLocationPermission('granted');
          updateLocationSuggestions(latitude, longitude);
        },
        (error) => {
          // Only log error if it's not a user permission denial
          if (error.code !== error.PERMISSION_DENIED) {
            console.error('Geolocation error:', error);
          }
          setLocationPermission('denied');
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 300000 // 5 minutes
        }
      );
    }
  }, [updateLocationSuggestions]);

  const handleNumpadPress = (value: string) => {
    if (value === '✓') {
      if (step === 'amount') {
        handleAmountConfirm();
      } else {
        handleDescriptionSubmit();
      }
    } else if (value === '.' && amount.includes('.')) {
      return; // Don't allow multiple decimal points
    } else if (amount.length < 10) { // Limit to reasonable length
      setAmount(prev => prev + value);
    }
  };

  const handleBackspace = () => {
    triggerVibration();
    setAmount(prev => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    triggerVibration();
    setAmount('');
    setDescription('');
    setStep('amount');
    setIsProcessing(false);
    setShowSaveTemplate(false);
    setTemplateName('');
    showToast('Form cleared', 'info');
  };

  const handleAmountConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    triggerVibration();
    setStep('description');
  };

  const handleDescriptionSubmit = async () => {
    if (!description.trim()) {
      showToast('Please add a description', 'error');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const entryText = `Quick Entry: ₹${amount} for ${description}`;
      addMessage(entryText, true, {
        type: 'expense',
        amount: parseFloat(amount),
        description: description.trim(),
        category: 'Quick Entry',
        timestamp: new Date().toISOString()
      });

      showToast('Expense logged successfully!', 'success');
      
      // Reset form
      setAmount('');
      setDescription('');
      setStep('amount');
      setIsProcessing(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'amount') {
        handleAmountConfirm();
      } else {
        handleDescriptionSubmit();
      }
    }
  };

  return (
    <div className="min-h-full bg-[#0e0e10] flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col px-4 justify-center min-h-0 pb-24 md:pb-8 pt-8">
        
        {/* Consolidated Preview Area */}
        <div className="text-center flex-shrink-0 mb-6">
          <div className="relative">
            {/* Clear Button */}
            {(amount || description) && (
              <button
                onClick={handleClearAll}
                className="absolute top-0 left-4 p-2 rounded-lg bg-[#ef4444] bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
              >
                <X size={20} className="text-[#ef4444]" />
              </button>
            )}
            
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#f1f1f1] mb-4 min-h-[50px] sm:min-h-[60px] flex items-center justify-center px-4">
              ₹{amount || '0'}
            </div>
            
            {/* Backspace Button */}
            {amount && (
              <button
                onClick={handleBackspace}
                className="absolute top-0 right-4 p-2 rounded-lg bg-[#f59e0b] bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#f59e0b]">
                  <path d="M22 3H7c-.69 0-1.35.28-1.82.78L1 8l4.18 4.22c.47.5 1.13.78 1.82.78h15c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1z" stroke="currentColor" strokeWidth="2"/>
                  <path d="m16 8-4 4M12 8l4 4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            )}
          </div>
          
          {/* Description Input */}
          <div className="mt-4">
            <input
              type="text"
              placeholder={step === 'amount' ? "Description will appear here..." : "e.g., coffee, lunch, movie..."}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={step === 'amount'}
              className={`w-full p-3 text-base text-center rounded-2xl transition-all duration-300 ${
                step === 'amount' 
                  ? 'glass text-[#a1a1aa] cursor-not-allowed' 
                  : 'input-field text-[#f1f1f1]'
              }`}
              autoFocus={step === 'description'}
              maxLength={50}
            />
            {step === 'description' && (
              <p className="text-center text-[#a1a1aa] text-sm mt-2">
                {description.length}/50 characters
              </p>
            )}
            
            {/* Description Quick Tags - Integrated with Input */}
            {step === 'description' && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-2">
                  {['Food', 'Transport', 'Shopping', 'Coffee', 'Movie', 'Bills'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setDescription(suggestion)}
                      className="p-2 sm:p-3 glass rounded-lg text-[#f1f1f1] hover:glass-card transition-all duration-300 text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Numpad - Main Focus */}
        <div className="flex-shrink-0 mb-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xs mx-auto w-full">
            {numpadButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => handleNumpadPress(button)}
                className={`h-12 sm:h-14 md:h-16 rounded-xl font-bold text-lg sm:text-xl transition-all duration-200 ${
                  button === '✓'
                    ? 'btn-gradient text-white shadow-lg active:scale-95'
                    : 'glass hover:glass-card text-[#f1f1f1] hover:text-[#00FFD1] active:scale-95'
                }`}
              >
                {button}
              </button>
            ))}
          </div>
        </div>

        {/* Location Suggestions - Below Numpad, Only During Amount Step */}
        {locationSuggestions.length > 0 && step === 'amount' && (
          <div className="flex-shrink-0 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={12} className="text-[#00FFD1]" />
              <span className="text-xs font-medium text-[#f1f1f1]">Nearby</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {locationSuggestions.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleUseLocationSuggestion(suggestion)}
                  className="flex-shrink-0 glass p-2 rounded-lg hover:glass-card transition-all duration-300 min-w-[80px]"
                >
                  <div className="text-center">
                    <p className="text-xs font-medium text-[#f1f1f1] truncate">{suggestion.merchantName}</p>
                    <p className="text-xs text-[#00FFD1]">₹{suggestion.estimatedAmount}</p>
                    <p className="text-xs text-[#a1a1aa]">{suggestion.distance}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Quick Templates - Below Location Suggestions, Only During Amount Step */}
        {quickEntryTemplates.length > 0 && step === 'amount' && (
          <div className="flex-shrink-0 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Bookmark size={12} className="text-[#667eea]" />
              <span className="text-xs font-medium text-[#f1f1f1]">Templates</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickEntryTemplates.map((template) => (
                <div key={template.id} className="flex-shrink-0 relative group">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="glass p-2 rounded-lg hover:glass-card transition-all duration-300 min-w-[70px]"
                  >
                    <div className="text-center">
                      <p className="text-xs font-medium text-[#f1f1f1] truncate">{template.name}</p>
                      <p className="text-xs text-[#667eea]">₹{template.amount}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => deleteQuickEntryTemplate(template.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-[#ef4444] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons - Only visible in description step */}
        {step === 'description' && (
          <div className="flex-shrink-0">
            <div className="space-y-3">
              {!showSaveTemplate && (
                <button
                  onClick={() => setShowSaveTemplate(true)}
                  disabled={!description.trim()}
                  className="w-full glass py-3 rounded-2xl font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Save as Template
                </button>
              )}
              
              {showSaveTemplate && (
                <div className="glass p-4 rounded-2xl space-y-3">
                  <input
                    type="text"
                    placeholder="Template name (e.g., Morning Coffee)"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full p-3 input-field rounded-xl"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveAsTemplate}
                      disabled={!templateName.trim()}
                      className="flex-1 btn-gradient py-2 rounded-lg font-medium text-white disabled:opacity-50"
                    >
                      Save Template
                    </button>
                    <button
                      onClick={() => {
                        setShowSaveTemplate(false);
                        setTemplateName('');
                      }}
                      className="px-4 py-2 glass rounded-lg font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickEntryPage;