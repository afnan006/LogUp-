import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Plus, X, MessageCircle, Camera, Mic, AlertCircle, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import ReceiptScanner from '../components/ReceiptScanner';

const ChatPage: React.FC = () => {
  const { 
    messages, 
    addMessage, 
    manualEntryOpen, 
    setManualEntryOpen,
    receiptScannerOpen,
    setReceiptScannerOpen,
    botTone,
    developerMode,
    pendingSmsTransactions,
    smsPermissionGranted,
    setShowSmsPermissionModal,
    setSidebarOpen,
    sidebarOpen
  } = useApp();
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  // Voice recognition setup with proper cleanup
  useEffect(() => {
    if (!voiceActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      return;
    }
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      setVoiceActive(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInputText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setVoiceActive(false);
    };

    recognition.onend = () => {
      if (voiceActive && recognitionRef.current) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Failed to restart recognition:', error);
          setVoiceActive(false);
        }
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setVoiceActive(false);
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [voiceActive]);

  const generateBotResponse = useCallback((userMessage: string) => {
    // Enhanced responses with financial insights
    const responses = {
      chill: [
        `Logged that for you. ${userMessage.toLowerCase().includes('spent') ? "Pro tip: Setting a budget helps!" : "Keep tracking!"} 👍`,
        "Got it! " + (userMessage.includes('?') 
          ? "Check your spending analysis for details." 
          : "Your financial awareness is growing!"),
        "Done! " + (parseFloat(userMessage) > 500 
          ? "That's a significant amount - want to discuss budgeting?" 
          : "Every rupee tracked is progress!")
      ],
      nerdy: [
        `Transaction processed. ${userMessage.length > 20 ? "Natural language processing suggests categorization as 'Miscellaneous'." : "Minimal metadata detected."}`,
        "Data recorded. " + (userMessage.match(/\d+/g)?.length || 0 > 1 
          ? "Multiple numerical values detected - using first as primary amount." 
          : "Single transaction logged."),
        "Entry stored. " + (userMessage.includes('food') 
          ? "Your monthly food expenditure is 23% above average." 
          : "No categorical anomalies detected.")
      ],
      sarcastic: [
        `Another expense? ${userMessage.toLowerCase().includes('coffee') ? "Addiction much? ☕" : "How very unexpected... 🙄"}`,
        `Logged. ${parseFloat(userMessage) > 1000 ? "Big spender! Hope your wallet's crying as hard as you will later 💸" : "At least it's not rent... yet."}`,
        `Sure, "${userMessage.split(' ').slice(0,3).join(' ')}..." because that's so descriptive. 😏`
      ]
    };
    
    const toneResponses = responses[botTone];
    return toneResponses[Math.floor(Math.random() * toneResponses.length)];
  }, [botTone]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    addMessage(userMessage, true);
    setInputText('');
    setVoiceActive(false);
    setIsTyping(true);

    // Simulate API processing
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage);
      const mockMemory = {
        type: 'expense',
        amount: Math.floor(Math.random() * 1000) + 50,
        description: userMessage,
        category: userMessage.includes('food') ? 'Food' : 
                 userMessage.includes('movie') ? 'Entertainment' : 'Other',
        timestamp: new Date().toISOString()
      };
      
      addMessage(botResponse, false, mockMemory);
      setIsTyping(false);
    }, 1000 + Math.random() * 500); // Variable delay for realism
  };

  const handleAddTransaction = (type: 'manual' | 'receipt' | 'sms' | 'voice') => {
    setShowAddOptions(false);
    switch (type) {
      case 'manual':
        setManualEntryOpen(true);
        break;
      case 'receipt':
        setReceiptScannerOpen(true);
        break;
      case 'voice':
        toggleVoiceInput();
        break;
      case 'sms':
        // Navigate to SMS review
        break;
    }
  };

  const toggleVoiceInput = () => {
    setVoiceActive(!voiceActive);
    if (!voiceActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0c] relative overflow-hidden">
      {/* Fixed Header - ChatGPT Style */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-sm border-b border-[#26262a]/50">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto md:ml-80">
          {/* Left - Hamburger Menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#26262a] transition-colors md:hidden"
          >
            <Menu size={24} className="text-[#f1f1f1]" />
          </button>
          
          {/* Center - Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-lg flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <h1 className="text-lg font-semibold text-[#f1f1f1]">LogUp Assistant</h1>
          </div>
          
          {/* Right - Notifications */}
          <div className="w-10 h-10 flex items-center justify-center">
            {pendingSmsTransactions.length > 0 && (
              <Link 
                to="/sms-review"
                className="relative p-2 rounded-lg hover:bg-[#26262a] transition-colors"
              >
                <AlertCircle size={20} className="text-[#f59e0b]" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ef4444] rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{pendingSmsTransactions.length}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-[#00FFD1]/10 blur-xl rounded-full"></div>
                <MessageCircle size={48} className="relative text-[#00FFD1] z-10" />
              </div>
              <h3 className="text-xl font-bold text-[#f1f1f1] mb-2">Your Financial Assistant</h3>
              <p className="text-[#a1a1aa] max-w-md mb-6">
                Ask about spending, set budgets, or log expenses. I'm here to help you manage your finances.
              </p>
              <div className="space-y-2 text-sm text-[#a1a1aa]">
                <div className="bg-[#26262a] rounded-lg p-3 font-mono">
                  "Spent ₹800 on movie tickets"
                </div>
                <div className="bg-[#26262a] rounded-lg p-3 font-mono">
                  "How much did I spend on food?"
                </div>
                <div className="bg-[#26262a] rounded-lg p-3 font-mono">
                  "Create a ₹5000 vacation budget"
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.isUser ? 'ml-12' : 'mr-12'}`}>
                    <div className={`vintage-message ${message.isUser ? 'user' : 'assistant'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      
                      {developerMode && message.memory && (
                        <div className="mt-2 p-2 bg-black/20 rounded text-xs font-mono border border-[#00FFD1]/20">
                          <span className="text-[#00FFD1]">Memory: </span>
                          {JSON.stringify(message.memory, null, 2)}
                        </div>
                      )}
                    </div>
                    
                    <div className={`flex items-center mt-1 text-xs text-[#a1a1aa] ${
                      message.isUser ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] mr-12">
                <div className="vintage-message assistant">
                  <div className="flex items-center gap-2">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="text-xs text-[#a1a1aa]">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Transaction Options Panel */}
      <AnimatePresence>
        {showAddOptions && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-4 right-4 z-40 max-w-4xl mx-auto"
          >
            <div className="bg-[#26262a] rounded-xl border border-[#3d3d42] p-3">
              <div className="grid grid-cols-4 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddTransaction('manual')}
                  className="flex flex-col items-center gap-2 p-3 bg-[#00FFD1]/10 rounded-lg hover:bg-[#00FFD1]/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#00FFD1]/20 flex items-center justify-center">
                    <Plus size={20} className="text-[#00FFD1]" />
                  </div>
                  <span className="text-xs text-[#00FFD1] font-medium">Manual</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddTransaction('receipt')}
                  className="flex flex-col items-center gap-2 p-3 bg-[#667eea]/10 rounded-lg hover:bg-[#667eea]/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#667eea]/20 flex items-center justify-center">
                    <Camera size={20} className="text-[#667eea]" />
                  </div>
                  <span className="text-xs text-[#667eea] font-medium">Receipt</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddTransaction('voice')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                    voiceActive 
                      ? 'bg-[#ef4444]/20 hover:bg-[#ef4444]/30' 
                      : 'bg-[#10b981]/10 hover:bg-[#10b981]/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    voiceActive 
                      ? 'bg-[#ef4444]/20' 
                      : 'bg-[#10b981]/20'
                  }`}>
                    <Mic size={20} className={voiceActive ? 'text-[#ef4444]' : 'text-[#10b981]'} />
                  </div>
                  <span className={`text-xs font-medium ${
                    voiceActive ? 'text-[#ef4444]' : 'text-[#10b981]'
                  }`}>
                    {voiceActive ? 'Stop' : 'Voice'}
                  </span>
                </motion.button>
                
                <Link
                  to="/sms-review"
                  className="flex flex-col items-center gap-2 p-3 bg-[#f59e0b]/10 rounded-lg hover:bg-[#f59e0b]/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#f59e0b]/20 flex items-center justify-center">
                    <MessageCircle size={20} className="text-[#f59e0b]" />
                  </div>
                  <span className="text-xs text-[#f59e0b] font-medium">SMS</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Scanner Overlay */}
      {receiptScannerOpen && <ReceiptScanner />}

      {/* Fixed Input Bar - ChatGPT Style */}
      <div className="fixed bottom-0 left-0 right-0 md:left-80 z-30 bg-[#0a0a0c]/95 backdrop-blur-sm border-t border-[#26262a]/50">
        <div className="max-w-4xl mx-auto p-4">
          <div className={`flex items-end gap-3 bg-[#26262a] rounded-2xl p-3 transition-all duration-300 ${
            inputFocused ? 'ring-2 ring-[#00FFD1]/50' : ''
          }`}>
            {/* Plus Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddOptions(!showAddOptions)}
              className="p-2 rounded-lg bg-[#3d3d42] hover:bg-[#4d4d52] transition-colors flex-shrink-0"
            >
              <Plus size={20} className="text-[#f1f1f1]" />
            </motion.button>
            
            {/* Text Input */}
            <div className="flex-1 min-h-[40px] max-h-[120px]">
              <textarea
                ref={textareaRef}
                placeholder={voiceActive ? "Listening... (click mic to stop)" : "Message LogUp Assistant..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="w-full bg-transparent border-none resize-none focus:outline-none text-[#f1f1f1] placeholder-[#a1a1aa] text-sm leading-5 py-2"
                disabled={voiceActive}
                rows={1}
                style={{ minHeight: '24px' }}
              />
            </div>
            
            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                inputText.trim() 
                  ? 'bg-[#00FFD1] hover:bg-[#00FFD1]/80 text-white' 
                  : 'bg-[#3d3d42] text-[#a1a1aa] cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;