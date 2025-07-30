import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, UserPlus, Check, X, MoreVertical, MessageCircle, Phone, UserMinus, Shield, Clock, Star, Globe, UserCheck, Send, Loader, Contact as Contacts, Smartphone, Crown, Zap, Heart, Gift, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    friends,
    pendingFriendRequests,
    sentFriendRequests,
    searchResults,
    contacts,
    contactsPermissionGranted,
    getUnreadMessageCount,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    removeFriend,
    blockUser,
    syncContacts,
    requestContactsPermission,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'find' | 'contacts'>('friends');
  const [showFriendOptions, setShowFriendOptions] = useState<string | null>(null);
  const [isSyncingContacts, setIsSyncingContacts] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      await searchUsers(searchQuery);
    } catch (error) {
      showToast('Search failed. Please try again.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (user: any) => {
    try {
      await sendFriendRequest(user.id, user.name, user.phoneNumber);
    } catch (error) {
      showToast('Failed to send friend request', 'error');
    }
  };

  const handleSyncContacts = async () => {
    setIsSyncingContacts(true);
    try {
      if (!contactsPermissionGranted) {
        await requestContactsPermission();
      } else {
        await syncContacts();
        showToast('Contacts refreshed!', 'success');
      }
    } catch (error) {
      showToast('Failed to sync contacts', 'error');
    } finally {
      setIsSyncingContacts(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const tabs = [
    { key: 'friends', label: 'Friends', count: friends.length, icon: Users, gradient: 'from-[#00FFD1] to-[#667eea]' },
    { key: 'requests', label: 'Requests', count: pendingFriendRequests.length, icon: UserCheck, gradient: 'from-[#f093fb] to-[#f5576c]' },
    { key: 'find', label: 'Discover', count: 0, icon: Search, gradient: 'from-[#43e97b] to-[#38f9d7]' },
    { key: 'contacts', label: 'Contacts', count: contacts.filter(c => c.isOnApp && c.friendStatus === 'none').length, icon: Contacts, gradient: 'from-[#667eea] to-[#764ba2]' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#0e0e10] to-[#1a1a1d] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00FFD1] to-[#667eea] rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-4 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-2xl blur-lg opacity-50"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-2xl flex items-center justify-center shadow-2xl">
                <Users size={32} className="text-white drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00FFD1] via-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                My Network
              </h1>
              <p className="text-[#a1a1aa] text-lg">Connect with friends to split expenses easily</p>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="relative">
            <div className="flex glass rounded-2xl p-2 border border-white/10">
              {tabs.map(({ key, label, count, icon: Icon, gradient }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`relative flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-500 group ${
                    activeTab === key
                      ? 'text-white shadow-2xl transform scale-105'
                      : 'text-[#a1a1aa] hover:text-[#f1f1f1] hover:bg-white/5'
                  }`}
                >
                  {activeTab === key && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl shadow-2xl`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      activeTab === key ? 'bg-white/20' : 'group-hover:bg-white/10'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-sm">{label}</span>
                      {count > 0 && (
                        <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                          activeTab === key ? 'bg-white/20 text-white' : 'bg-[#00FFD1] text-white'
                        }`}>
                          {count}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* My Friends Tab */}
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {friends.length > 0 ? (
                <div className="grid gap-4">
                  {friends.map((friend, index) => (
                    <motion.div 
                      key={friend.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 border border-white/10 backdrop-blur-xl group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {friend.avatar ? (
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">
                                  {friend.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            {friend.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#10b981] border-3 border-[#0e0e10] rounded-full shadow-lg pulse-glow"></div>
                            )}
                            {friend.mutualFriends && friend.mutualFriends > 10 && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] rounded-full flex items-center justify-center">
                                <Crown size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-bold text-[#f1f1f1] group-hover:text-[#00FFD1] transition-colors">
                                {friend.name}
                              </h3>
                              {friend.mutualFriends && friend.mutualFriends > 0 && (
                                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#00FFD1] to-[#667eea] bg-opacity-20 text-[#00FFD1] rounded-full">
                                  <Star size={12} />
                                  <span className="text-xs font-bold">{friend.mutualFriends} mutual</span>
                                </div>
                              )}
                            </div>
                            <p className="text-[#a1a1aa] mb-2 font-medium">{friend.phoneNumber}</p>
                            <div className="flex items-center gap-4">
                              {friend.isOnline ? (
                                <div className="flex items-center gap-2 text-[#10b981]">
                                  <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                                  <span className="text-sm font-medium">Online now</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-[#a1a1aa]">
                                  <Clock size={14} />
                                  <span className="text-sm">{friend.lastSeen || 'Last seen recently'}</span>
                                </div>
                              )}
                              {friend.joinedDate && (
                                <div className="flex items-center gap-2 text-[#a1a1aa]">
                                  <Globe size={14} />
                                  <span className="text-sm">Since {new Date(friend.joinedDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => navigate(`/chat/friend/${friend.id}`)}
                            className="p-3 glass rounded-xl hover:glass-card transition-all duration-300 group/btn border border-white/10"
                          >
                            <MessageCircle size={18} className="text-[#00FFD1] group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setShowFriendOptions(showFriendOptions === friend.id ? null : friend.id)}
                              className="p-3 glass rounded-xl hover:glass-card transition-all duration-300 border border-white/10"
                            >
                              <MoreVertical size={18} className="text-[#a1a1aa]" />
                            </button>
                            
                            {showFriendOptions === friend.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="absolute right-0 top-16 glass border border-white/20 rounded-2xl p-3 min-w-[180px] z-20 backdrop-blur-xl"
                              >
                                <button
                                  onClick={() => {
                                    removeFriend(friend.id);
                                    setShowFriendOptions(null);
                                  }}
                                  className="w-full flex items-center gap-3 p-3 text-[#ef4444] hover:bg-[#ef4444] hover:bg-opacity-20 rounded-xl transition-all duration-300"
                                >
                                  <UserMinus size={16} />
                                  <span className="font-medium">Remove Friend</span>
                                </button>
                                <button
                                  onClick={() => {
                                    blockUser(friend.id);
                                    setShowFriendOptions(null);
                                  }}
                                  className="w-full flex items-center gap-3 p-3 text-[#ef4444] hover:bg-[#ef4444] hover:bg-opacity-20 rounded-xl transition-all duration-300"
                                >
                                  <Shield size={16} />
                                  <span className="font-medium">Block User</span>
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 rounded-3xl text-center border border-white/10 backdrop-blur-xl"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#a1a1aa] to-[#6b7280] rounded-3xl blur-xl opacity-20"></div>
                    <Users size={64} className="relative text-[#a1a1aa] mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#f1f1f1] mb-3">No Friends Yet</h3>
                  <p className="text-[#a1a1aa] mb-6 text-lg leading-relaxed max-w-md mx-auto">
                    Start building your network by finding and adding friends! Connect with people to make splitting expenses easier.
                  </p>
                  <button
                    onClick={() => setActiveTab('find')}
                    className="btn-gradient py-4 px-8 rounded-2xl font-semibold text-white shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <Search size={20} />
                      Discover Friends
                    </div>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Friend Requests Tab */}
          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Incoming Requests */}
              {pendingFriendRequests.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-2xl">
                      <UserCheck size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#f1f1f1]">Incoming Requests</h3>
                      <p className="text-[#a1a1aa]">{pendingFriendRequests.length} people want to connect</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {pendingFriendRequests.map((request, index) => (
                      <motion.div 
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {request.senderAvatar ? (
                              <img
                                src={request.senderAvatar}
                                alt={request.senderName}
                                className="w-14 h-14 rounded-2xl object-cover shadow-lg"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gradient-to-r from-[#f093fb] to-[#f5576c] rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">
                                  {request.senderName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            
                            <div>
                              <h4 className="text-lg font-bold text-[#f1f1f1]">{request.senderName}</h4>
                              <p className="text-[#a1a1aa] font-medium">{request.senderPhone}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-[#a1a1aa]">
                                  {getTimeAgo(request.createdAt)}
                                </span>
                                {request.mutualFriends && request.mutualFriends > 0 && (
                                  <div className="flex items-center gap-1 text-[#00FFD1]">
                                    <Star size={12} />
                                    <span className="text-sm font-medium">{request.mutualFriends} mutual friends</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={() => acceptFriendRequest(request.id)}
                              className="p-3 bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-xl text-white hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => declineFriendRequest(request.id)}
                              className="p-3 bg-gradient-to-r from-[#ef4444] to-[#f87171] rounded-xl text-white hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Sent Requests */}
              {sentFriendRequests.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl">
                      <Send size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#f1f1f1]">Sent Requests</h3>
                      <p className="text-[#a1a1aa]">{sentFriendRequests.length} pending responses</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {sentFriendRequests.map((request, index) => (
                      <motion.div 
                        key={request.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass p-5 rounded-2xl border border-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">
                                {request.senderName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            
                            <div>
                              <h4 className="text-lg font-bold text-[#f1f1f1]">Request sent</h4>
                              <p className="text-[#a1a1aa]">
                                Waiting for response • {getTimeAgo(request.createdAt)}
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => cancelFriendRequest(request.id)}
                            className="p-3 bg-gradient-to-r from-[#ef4444] to-[#f87171] rounded-xl text-white hover:scale-105 transition-all duration-300 shadow-lg"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {pendingFriendRequests.length === 0 && sentFriendRequests.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 rounded-3xl text-center border border-white/10 backdrop-blur-xl"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#a1a1aa] to-[#6b7280] rounded-3xl blur-xl opacity-20"></div>
                    <UserCheck size={64} className="relative text-[#a1a1aa] mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#f1f1f1] mb-3">No Pending Requests</h3>
                  <p className="text-[#a1a1aa] text-lg">
                    All friend requests have been handled. Find new friends to connect with!
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Find Friends Tab */}
          {activeTab === 'find' && (
            <motion.div
              key="find"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Search Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-[#43e97b] to-[#38f9d7] rounded-2xl">
                    <Search size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#f1f1f1]">Discover Friends</h3>
                    <p className="text-[#a1a1aa]">Search by name or phone number</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a1a1aa]" />
                    <input
                      type="text"
                      placeholder="Search by name or phone number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-14 pr-4 py-4 input-field rounded-2xl text-lg border border-white/10 focus:border-[#00FFD1] transition-all duration-300"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    className="btn-gradient py-4 px-8 rounded-2xl font-semibold text-white disabled:opacity-50 flex items-center gap-3 shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    {isSearching ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
              </motion.div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
                >
                  <h3 className="text-xl font-bold text-[#f1f1f1] mb-6">
                    Search Results ({searchResults.length})
                  </h3>
                  <div className="space-y-4">
                    {searchResults.map((user, index) => (
                      <motion.div 
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-r from-[#43e97b] to-[#38f9d7] rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-lg font-bold text-[#f1f1f1]">{user.name}</h4>
                                {user.isOnline && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-[#10b981] bg-opacity-20 text-[#10b981] rounded-full">
                                    <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                                    <span className="text-xs font-medium">Online</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-[#a1a1aa] font-medium mb-2">{user.phoneNumber}</p>
                              <div className="flex items-center gap-4">
                                {user.mutualFriends && user.mutualFriends > 0 && (
                                  <div className="flex items-center gap-1 text-[#00FFD1]">
                                    <Star size={14} />
                                    <span className="text-sm font-medium">{user.mutualFriends} mutual friends</span>
                                  </div>
                                )}
                                {user.joinedDate && (
                                  <div className="flex items-center gap-1 text-[#a1a1aa]">
                                    <Globe size={14} />
                                    <span className="text-sm">Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleSendRequest(user)}
                            className="btn-gradient py-3 px-6 rounded-2xl font-semibold text-white flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-lg"
                          >
                            <UserPlus size={18} />
                            <span className="hidden sm:inline">Add Friend</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {searchQuery && searchResults.length === 0 && !isSearching && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 rounded-3xl text-center border border-white/10 backdrop-blur-xl"
                >
                  <Search size={64} className="text-[#a1a1aa] mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#f1f1f1] mb-3">No Results Found</h3>
                  <p className="text-[#a1a1aa] text-lg">
                    No users found matching "{searchQuery}". Try a different search term.
                  </p>
                </motion.div>
              )}

              {!searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 rounded-3xl text-center border border-white/10 backdrop-blur-xl"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#43e97b] to-[#38f9d7] rounded-3xl blur-xl opacity-20"></div>
                    <Search size={64} className="relative text-[#43e97b] mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#f1f1f1] mb-3">Discover New Friends</h3>
                  <p className="text-[#a1a1aa] mb-8 text-lg leading-relaxed max-w-md mx-auto">
                    Search for friends by their name or phone number to connect and split expenses together.
                  </p>
                  <div className="glass p-6 rounded-2xl border border-[#00FFD1] border-opacity-30">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap size={20} className="text-[#00FFD1]" />
                      <h4 className="font-bold text-[#00FFD1]">Search Tips</h4>
                    </div>
                    <ul className="text-sm text-[#a1a1aa] space-y-2 text-left">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></div>
                        Use full names for better results
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></div>
                        Include country code for phone numbers
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></div>
                        Try partial matches if exact search fails
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Sync Contacts Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl">
                      <Contacts size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#f1f1f1]">Your Contacts</h3>
                      <p className="text-[#a1a1aa]">Find friends from your phone contacts</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSyncContacts}
                    disabled={isSyncingContacts}
                    className="btn-gradient py-3 px-6 rounded-2xl font-semibold text-white disabled:opacity-50 flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    {isSyncingContacts ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Smartphone size={18} />
                    )}
                    {contactsPermissionGranted ? 'Refresh Contacts' : 'Sync Contacts'}
                  </button>
                </div>

                {!contactsPermissionGranted && (
                  <div className="glass p-6 rounded-2xl border border-[#00FFD1] border-opacity-30 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Shield size={20} className="text-[#00FFD1]" />
                      <h4 className="font-bold text-[#00FFD1]">Permission Required</h4>
                    </div>
                    <p className="text-[#a1a1aa] mb-4">
                      Allow LogUp to access your contacts to find friends who are already using the app.
                    </p>
                    <div className="text-xs text-[#a1a1aa] space-y-1">
                      <p>• Your contacts are processed locally and securely</p>
                      <p>• We only check which contacts are on LogUp</p>
                      <p>• No contact data is stored on our servers</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Contacts List */}
              {contactsPermissionGranted && contacts.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  {/* On App Contacts */}
                  {contacts.filter(c => c.isOnApp && c.friendStatus === 'none').length > 0 && (
                    <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-xl">
                          <Users size={20} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[#f1f1f1]">On LogUp</h4>
                          <p className="text-[#a1a1aa]">Your contacts who use LogUp</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {contacts.filter(c => c.isOnApp && c.friendStatus === 'none').map((contact, index) => (
                          <motion.div 
                            key={contact.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 glass rounded-2xl border border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {contact.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h5 className="font-semibold text-[#f1f1f1]">{contact.name}</h5>
                                <p className="text-sm text-[#a1a1aa]">{contact.phoneNumber}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleSendRequest({ id: contact.id, name: contact.name, phoneNumber: contact.phoneNumber })}
                              className="btn-gradient py-2 px-4 rounded-xl font-medium text-white flex items-center gap-2 hover:scale-105 transition-all duration-300"
                            >
                              <UserPlus size={16} />
                              Add
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Already Friends */}
                  {contacts.filter(c => c.friendStatus === 'friends').length > 0 && (
                    <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-xl">
                          <Heart size={20} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[#f1f1f1]">Already Friends</h4>
                          <p className="text-[#a1a1aa]">Contacts you're already connected with</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {contacts.filter(c => c.friendStatus === 'friends').map((contact, index) => (
                          <motion.div 
                            key={contact.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 glass rounded-2xl border border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {contact.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h5 className="font-semibold text-[#f1f1f1]">{contact.name}</h5>
                                <p className="text-sm text-[#a1a1aa]">{contact.phoneNumber}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-[#10b981] bg-opacity-20 text-[#10b981] rounded-full">
                              <Check size={14} />
                              <span className="text-sm font-medium">Friends</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Not On App */}
                  {contacts.filter(c => !c.isOnApp).length > 0 && (
                    <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-[#a1a1aa] to-[#6b7280] rounded-xl">
                          <Gift size={20} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[#f1f1f1]">Invite to LogUp</h4>
                          <p className="text-[#a1a1aa]">Contacts not using LogUp yet</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {contacts.filter(c => !c.isOnApp).slice(0, 5).map((contact, index) => (
                          <motion.div 
                            key={contact.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 glass rounded-2xl border border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-[#a1a1aa] to-[#6b7280] rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {contact.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h5 className="font-semibold text-[#f1f1f1]">{contact.name}</h5>
                                <p className="text-sm text-[#a1a1aa]">{contact.phoneNumber}</p>
                              </div>
                            </div>
                            <button className="py-2 px-4 glass rounded-xl font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300 border border-white/10">
                              Invite
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {contactsPermissionGranted && contacts.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 rounded-3xl text-center border border-white/10 backdrop-blur-xl"
                >
                  <Contacts size={64} className="text-[#a1a1aa] mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#f1f1f1] mb-3">No Contacts Found</h3>
                  <p className="text-[#a1a1aa] text-lg">
                    We couldn't find any contacts. Make sure you have contacts saved on your device.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom padding for mobile navigation */}
        <div className="pb-20 md:pb-4" />
      </div>
    </div>
  );
};

export default FriendsPage;