import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Smile,
  Paperclip,
  Mic,
  Check,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';

const FriendChatPage: React.FC = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();
  const { 
    getFriendById, 
    getFriendMessages, 
    addFriendMessage, 
    markMessagesAsRead,
    isTyping
  } = useApp();
  
  const [inputText, setInputText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const friend = friendId ? getFriendById(friendId) : null;
  const messages = friendId ? getFriendMessages(friendId) : [];
  const friendTyping = friendId ? isTyping.get(friendId) || false : false;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, friendTyping]);

  // Mark messages as read when component mounts
  useEffect(() => {
    if (friendId) {
      markMessagesAsRead(friendId);
    }
  }, [friendId, markMessagesAsRead]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !friendId) return;

    addFriendMessage(friendId, inputText.trim(), true);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatusIcon = (status: string, isUser: boolean) => {
    if (!isUser) return null;
    
    switch (status) {
      case 'sent':
        return <Check size={14} className="text-[#a1a1aa]" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-[#a1a1aa]" />;
      case 'read':
        return <CheckCheck size={14} className="text-[#00FFD1]" />;
      default:
        return null;
    }
  };

  if (!friend) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl text-center">
          <h2 className="text-xl font-bold text-[#f1f1f1] mb-2">Friend Not Found</h2>
          <p className="text-[#a1a1aa] mb-4">This friend doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/friends')}
            className="btn-gradient py-3 px-6 rounded-xl font-medium text-white"
          >
            Back to Friends
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0c] relative overflow-hidden">
      {/* Chat Header - ChatGPT Style */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-sm border-b border-[#26262a]/50">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto md:ml-80">
          {/* Left - Back Button & Friend Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/friends')}
              className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
            >
              <ArrowLeft size={24} className="text-[#f1f1f1]" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                {friend.avatar ? (
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {friend.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {friend.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10b981] border-2 border-[#0a0a0c] rounded-full"></div>
                )}
              </div>
              
              <div>
                <h1 className="text-lg font-semibold text-[#f1f1f1]">{friend.name}</h1>
                <p className="text-sm text-[#a1a1aa]">
                  {friend.isOnline ? 'Online' : friend.lastSeen || 'Last seen recently'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Right - Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-[#26262a] transition-colors">
              <Phone size={20} className="text-[#a1a1aa]" />
            </button>
            <button className="p-2 rounded-lg hover:bg-[#26262a] transition-colors">
              <Video size={20} className="text-[#a1a1aa]" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
              >
                <MoreVertical size={20} className="text-[#a1a1aa]" />
              </button>
              
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 top-12 glass border border-[#3d3d42] rounded-xl p-2 min-w-[160px] z-20"
                >
                  <Link
                    to={`/split-expense?friend=${friendId}`}
                    className="w-full flex items-center gap-3 p-2 text-[#f1f1f1] hover:bg-[#26262a] rounded-lg transition-colors"
                  >
                    <Info size={16} />
                    <span>Split Expense</span>
                  </Link>
                  <Link
                    to={`/debts?friend=${friendId}`}
                    className="w-full flex items-center gap-3 p-2 text-[#f1f1f1] hover:bg-[#26262a] rounded-lg transition-colors"
                  >
                    <Info size={16} />
                    <span>View Debts</span>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto pt-20 pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-[#00FFD1]/10 blur-xl rounded-full"></div>
                {friend.avatar ? (
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="relative w-16 h-16 rounded-full object-cover z-10"
                  />
                ) : (
                  <div className="relative w-16 h-16 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-full flex items-center justify-center z-10">
                    <span className="text-white font-bold text-xl">
                      {friend.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-[#f1f1f1] mb-2">Start a conversation with {friend.name}</h3>
              <p className="text-[#a1a1aa] max-w-md mb-6">
                Send a message to start chatting. You can also split expenses or manage debts together.
              </p>
              <div className="space-y-2 text-sm text-[#a1a1aa]">
                <div className="bg-[#26262a] rounded-lg p-3 font-mono">
                  "Hey! How are you doing?"
                </div>
                <div className="bg-[#26262a] rounded-lg p-3 font-mono">
                  "Want to split the dinner bill?"
                </div>
                <div className="bg-[#26262a] rounded-lg p-3 font-mono">
                  "Let's catch up soon!"
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
                    <div className={`relative p-4 rounded-2xl ${
                      message.isUser 
                        ? 'bg-gradient-to-r from-[#00FFD1] to-[#667eea] text-white ml-auto' 
                        : 'bg-[#26262a] text-[#f1f1f1]'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      
                      {/* Message Status */}
                      <div className={`flex items-center justify-end gap-1 mt-2 ${
                        message.isUser ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className={`text-xs ${
                          message.isUser ? 'text-white/70' : 'text-[#a1a1aa]'
                        }`}>
                          {formatTime(message.timestamp)}
                        </span>
                        {getMessageStatusIcon(message.status, message.isUser)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
          
          {/* Typing Indicator */}
          {friendTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] mr-12">
                <div className="bg-[#26262a] p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="text-xs text-[#a1a1aa]">{friend.name} is typing...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar - ChatGPT Style */}
      <div className="fixed bottom-0 left-0 right-0 md:left-80 z-30 bg-[#0a0a0c]/95 backdrop-blur-sm border-t border-[#26262a]/50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-end gap-3 bg-[#26262a] rounded-2xl p-3">
            {/* Attachment Button */}
            <button className="p-2 rounded-lg hover:bg-[#3d3d42] transition-colors flex-shrink-0">
              <Paperclip size={20} className="text-[#a1a1aa]" />
            </button>
            
            {/* Text Input */}
            <div className="flex-1 min-h-[40px] max-h-[120px]">
              <textarea
                ref={textareaRef}
                placeholder={`Message ${friend.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full bg-transparent border-none resize-none focus:outline-none text-[#f1f1f1] placeholder-[#a1a1aa] text-sm leading-5 py-2"
                rows={1}
                style={{ minHeight: '24px' }}
              />
            </div>
            
            {/* Emoji Button */}
            <button className="p-2 rounded-lg hover:bg-[#3d3d42] transition-colors flex-shrink-0">
              <Smile size={20} className="text-[#a1a1aa]" />
            </button>
            
            {/* Voice/Send Button */}
            {inputText.trim() ? (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleSendMessage}
                className="p-2 rounded-lg bg-[#00FFD1] hover:bg-[#00FFD1]/80 transition-colors flex-shrink-0"
              >
                <Send size={20} className="text-white" />
              </motion.button>
            ) : (
              <button className="p-2 rounded-lg hover:bg-[#3d3d42] transition-colors flex-shrink-0">
                <Mic size={20} className="text-[#a1a1aa]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendChatPage;