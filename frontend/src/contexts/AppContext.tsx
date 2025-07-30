import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  memory?: any;
}

interface FriendMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface IncomeEntry {
  id: string;
  amount: number;
  description: string;
  date: string;
  source: string;
}

interface SmsTransaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  originalSms: string;
  bankName: string;
  transactionType: 'debit' | 'credit';
  accountLast4: string;
}

interface ReceiptTransaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  imageUrl: string;
  extractedText: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  color: string;
  createdAt: string;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string;
  category: string;
  color: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface Debt {
  id: string;
  personName: string;
  phoneNumber: string;
  amount: number;
  type: 'lent' | 'borrowed';
  description: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
}

interface Nudge {
  id: string;
  message: string;
  type: 'budget' | 'goal' | 'saving' | 'spending' | 'debt';
  actionLink?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface DashboardWidget {
  id: string;
  type: 'recent-transactions' | 'budget-overview' | 'goal-progress' | 'spending-summary' | 'debt-summary' | 'savings-rate' | 'cash-flow-summary' | 'spending-trends';
  title: string;
  enabled: boolean;
  order: number;
}

interface SplitExpense {
  id: string;
  description: string;
  totalAmount: number;
  participants: SplitParticipant[];
  splitType: 'equal' | 'custom' | 'percentage';
  createdAt: string;
}

interface SplitParticipant {
  id: string;
  name: string;
  phoneNumber: string;
  amountPaid: number;
  amountOwed: number;
  percentage?: number;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface Friend {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  mutualFriends?: number;
  joinedDate?: string;
}

interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderPhone: string;
  senderAvatar?: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  mutualFriends?: number;
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  isOnApp?: boolean;
  friendStatus?: 'none' | 'pending' | 'friends';
}

interface QuickEntryTemplate {
  id: string;
  name: string;
  amount: number;
  description: string;
  category: string;
  createdAt: string;
}

interface LocationSuggestion {
  id: string;
  merchantName: string;
  category: string;
  estimatedAmount: number;
  distance: string;
}

interface AppContextType {
  messages: Message[];
  addMessage: (text: string, isUser: boolean, memory?: any) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  manualEntryOpen: boolean;
  setManualEntryOpen: (open: boolean) => void;
  receiptScannerOpen: boolean;
  setReceiptScannerOpen: (open: boolean) => void;
  botTone: 'chill' | 'nerdy' | 'sarcastic';
  setBotTone: (tone: 'chill' | 'nerdy' | 'sarcastic') => void;
  developerMode: boolean;
  setDeveloperMode: (mode: boolean) => void;
  smsPermissionGranted: boolean;
  setSmsPermissionGranted: (granted: boolean) => void;
  
  // SMS Transactions
  pendingSmsTransactions: SmsTransaction[];
  addPendingSmsTransaction: (transaction: Omit<SmsTransaction, 'id'>) => void;
  confirmSmsTransaction: (id: string) => void;
  editSmsTransaction: (id: string, updates: Partial<SmsTransaction>) => void;
  ignoreSmsTransaction: (id: string) => void;
  showSmsPermissionModal: boolean;
  setShowSmsPermissionModal: (show: boolean) => void;
  
  // Receipt Transactions
  pendingReceiptTransactions: ReceiptTransaction[];
  addReceiptTransaction: (transaction: Omit<ReceiptTransaction, 'id'>) => void;
  confirmReceiptTransaction: (id: string) => void;
  editReceiptTransaction: (id: string, updates: Partial<ReceiptTransaction>) => void;
  ignoreReceiptTransaction: (id: string) => void;
  
  // Budgets
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'spent' | 'createdAt'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getBudgetProgress: (categoryName: string) => { spent: number; limit: number; percentage: number };
  
  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addToGoal: (id: string, amount: number) => void;
  
  // Debts
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  markDebtAsPaid: (id: string) => void;
  deleteDebt: (id: string) => void;
  
  // Nudges
  activeNudges: Nudge[];
  addNudge: (nudge: Omit<Nudge, 'id' | 'createdAt'>) => void;
  dismissNudge: (id: string) => void;
  
  // Dashboard
  dashboardWidgets: DashboardWidget[];
  updateWidgetOrder: (widgets: DashboardWidget[]) => void;
  toggleWidget: (id: string) => void;
  
  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // Quick Entry Templates
  quickEntryTemplates: QuickEntryTemplate[];
  addQuickEntryTemplate: (template: Omit<QuickEntryTemplate, 'id' | 'createdAt'>) => void;
  deleteQuickEntryTemplate: (id: string) => void;
  
  // Location-based suggestions
  locationSuggestions: LocationSuggestion[];
  updateLocationSuggestions: (latitude: number, longitude: number) => void;
  
  // Income tracking
  incomeEntries: IncomeEntry[];
  addIncomeEntry: (entry: Omit<IncomeEntry, 'id'>) => void;
  
  // Dashboard management
  showWidgetManager: boolean;
  setShowWidgetManager: (show: boolean) => void;
  
  // Total notifications count
  totalNotifications: number;
  
  // Friend Chat System
  friendMessages: Map<string, FriendMessage[]>;
  addFriendMessage: (friendId: string, text: string, isUser: boolean) => void;
  getFriendMessages: (friendId: string) => FriendMessage[];
  markMessagesAsRead: (friendId: string) => void;
  getUnreadMessageCount: (friendId: string) => number;
  isTyping: Map<string, boolean>;
  setFriendTyping: (friendId: string, typing: boolean) => void;
  
  // Friends system
  friends: Friend[];
  pendingFriendRequests: FriendRequest[];
  sentFriendRequests: FriendRequest[];
  searchResults: Friend[];
  contacts: Contact[];
  contactsPermissionGranted: boolean;
  searchUsers: (query: string) => Promise<Friend[]>;
  sendFriendRequest: (receiverId: string, receiverName: string, receiverPhone: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  cancelFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  getFriendById: (friendId: string) => Friend | undefined;
  syncContacts: () => Promise<void>;
  requestContactsPermission: () => Promise<boolean>;
  
  // Split expenses
  splitExpenses: SplitExpense[];
  addSplitExpense: (expense: Omit<SplitExpense, 'id' | 'createdAt'>) => void;
  generateReminderMessage: (debt: Debt) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! Ready to take control of your finances? I'm here to help you track spending, set budgets, and reach your financial goals. What would you like to do first? 💰",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [receiptScannerOpen, setReceiptScannerOpen] = useState(false);
  const [botTone, setBotTone] = useState<'chill' | 'nerdy' | 'sarcastic'>('chill');
  const [developerMode, setDeveloperMode] = useState(false);
  const [smsPermissionGranted, setSmsPermissionGranted] = useState(false);
  const [pendingSmsTransactions, setPendingSmsTransactions] = useState<SmsTransaction[]>([]);
  const [showSmsPermissionModal, setShowSmsPermissionModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Quick Entry Templates
  const [quickEntryTemplates, setQuickEntryTemplates] = useState<QuickEntryTemplate[]>([
    {
      id: '1',
      name: 'Morning Coffee',
      amount: 250,
      description: 'Coffee at Starbucks',
      category: 'Food & Dining',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Bus Fare',
      amount: 50,
      description: 'Daily commute',
      category: 'Transportation',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Lunch',
      amount: 400,
      description: 'Office lunch',
      category: 'Food & Dining',
      createdAt: new Date().toISOString()
    }
  ]);
  
  // Location Suggestions
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  
  // Income Entries
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([
    {
      id: '1',
      amount: 45000,
      description: 'Salary',
      date: new Date().toISOString(),
      source: 'Employment'
    }
  ]);
  
  // Widget Manager
  const [showWidgetManager, setShowWidgetManager] = useState(false);
  
  // Friends System
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 'friend-1',
      name: 'Rahul Sharma',
      phoneNumber: '+91 9876543210',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      isOnline: true,
      mutualFriends: 5,
      joinedDate: '2024-01-15'
    },
    {
      id: 'friend-2',
      name: 'Priya Patel',
      phoneNumber: '+91 9876543211',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      isOnline: false,
      lastSeen: '2 hours ago',
      mutualFriends: 3,
      joinedDate: '2024-02-20'
    },
    {
      id: 'friend-3',
      name: 'Arjun Kumar',
      phoneNumber: '+91 9876543212',
      isOnline: true,
      mutualFriends: 8,
      joinedDate: '2023-12-10'
    }
  ]);
  
  const [pendingFriendRequests, setPendingFriendRequests] = useState<FriendRequest[]>([
    {
      id: 'req-1',
      senderId: 'user-123',
      senderName: 'Sneha Gupta',
      senderPhone: '+91 9876543213',
      senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      receiverId: 'current-user',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      mutualFriends: 2
    },
    {
      id: 'req-2',
      senderId: 'user-124',
      senderName: 'Vikram Singh',
      senderPhone: '+91 9876543214',
      receiverId: 'current-user',
      status: 'pending',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      mutualFriends: 1
    }
  ]);
  
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsPermissionGranted, setContactsPermissionGranted] = useState(false);
  
  // Friend Chat System
  const [friendMessages, setFriendMessages] = useState<Map<string, FriendMessage[]>>(new Map());
  const [isTyping, setIsTyping] = useState<Map<string, boolean>>(new Map());
  
  // Mock users database for search
  const mockUsers: Friend[] = [
    {
      id: 'user-101',
      name: 'Amit Verma',
      phoneNumber: '+91 9876543215',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      isOnline: true,
      mutualFriends: 4,
      joinedDate: '2024-01-05'
    },
    {
      id: 'user-102',
      name: 'Kavya Reddy',
      phoneNumber: '+91 9876543216',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      isOnline: false,
      lastSeen: '1 hour ago',
      mutualFriends: 7,
      joinedDate: '2023-11-20'
    },
    {
      id: 'user-103',
      name: 'Rohan Joshi',
      phoneNumber: '+91 9876543217',
      isOnline: true,
      mutualFriends: 2,
      joinedDate: '2024-03-01'
    },
    {
      id: 'user-104',
      name: 'Ananya Das',
      phoneNumber: '+91 9876543218',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      isOnline: false,
      lastSeen: '5 minutes ago',
      mutualFriends: 6,
      joinedDate: '2023-10-15'
    },
    {
      id: 'user-105',
      name: 'Karthik Nair',
      phoneNumber: '+91 9876543219',
      isOnline: true,
      mutualFriends: 3,
      joinedDate: '2024-02-10'
    }
  ];
  
  // Receipt Transactions
  const [pendingReceiptTransactions, setPendingReceiptTransactions] = useState<ReceiptTransaction[]>([]);
  
  // Budgets
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      category: 'Food & Dining',
      limit: 8000,
      spent: 5200,
      period: 'monthly',
      color: '#00FFD1',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      category: 'Transportation',
      limit: 3000,
      spent: 1800,
      period: 'monthly',
      color: '#667eea',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      category: 'Entertainment',
      limit: 2000,
      spent: 2100,
      period: 'monthly',
      color: '#f093fb',
      createdAt: new Date().toISOString()
    }
  ]);
  
  // Goals
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 100000,
      currentAmount: 35000,
      dueDate: '2025-12-31',
      category: 'Savings',
      color: '#10b981',
      priority: 'high',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'New Laptop',
      targetAmount: 80000,
      currentAmount: 25000,
      dueDate: '2025-06-30',
      category: 'Purchase',
      color: '#3b82f6',
      priority: 'medium',
      createdAt: new Date().toISOString()
    }
  ]);
  
  // Debts
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: '1',
      personName: 'Rahul',
      phoneNumber: '+91 9876543210',
      amount: 2500,
      type: 'lent',
      description: 'Dinner split payment',
      dueDate: '2025-02-15',
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      personName: 'Priya',
      phoneNumber: '+91 9876543211',
      amount: 1200,
      type: 'borrowed',
      description: 'Movie tickets',
      dueDate: '2025-02-10',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  ]);
  
  // Nudges
  const [activeNudges, setActiveNudges] = useState<Nudge[]>([]);
  
  // Dashboard Widgets
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([
    { id: '1', type: 'recent-transactions', title: 'Recent Transactions', enabled: true, order: 1 },
    { id: '2', type: 'cash-flow-summary', title: 'Cash Flow Summary', enabled: true, order: 2 },
    { id: '3', type: 'budget-overview', title: 'Budget Overview', enabled: true, order: 3 },
    { id: '4', type: 'goal-progress', title: 'Goal Progress', enabled: true, order: 4 },
    { id: '5', type: 'spending-summary', title: 'Spending Summary', enabled: true, order: 5 },
    { id: '6', type: 'spending-trends', title: 'Spending Trends', enabled: true, order: 6 },
    { id: '7', type: 'debt-summary', title: 'Debt Summary', enabled: true, order: 7 },
    { id: '8', type: 'savings-rate', title: 'Savings Rate', enabled: false, order: 8 }
  ]);
  
  // Split expenses
  const [splitExpenses, setSplitExpenses] = useState<SplitExpense[]>([]);

  // Calculate total notifications
  const totalNotifications = activeNudges.length + pendingSmsTransactions.length + pendingReceiptTransactions.length + pendingFriendRequests.length;

  // Friends system functions
  const searchUsers = async (query: string): Promise<Friend[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }
    
    const results = mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.phoneNumber.includes(query)
    ).filter(user => 
      // Exclude already friends
      !friends.some(friend => friend.id === user.id) &&
      // Exclude pending requests (sent or received)
      !pendingFriendRequests.some(req => req.senderId === user.id) &&
      !sentFriendRequests.some(req => req.receiverId === user.id)
    );
    
    setSearchResults(results);
    return results;
  };
  
  const sendFriendRequest = async (receiverId: string, receiverName: string, receiverPhone: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newRequest: FriendRequest = {
      id: `req-${Date.now()}`,
      senderId: 'current-user',
      senderName: user?.displayName || 'You',
      senderPhone: user?.phoneNumber || '+91 9876543210',
      receiverId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setSentFriendRequests(prev => [...prev, newRequest]);
    
    // Remove from search results
    setSearchResults(prev => prev.filter(user => user.id !== receiverId));
    
    showToast(`Friend request sent to ${receiverName}!`, 'success');
  };
  
  const acceptFriendRequest = async (requestId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const request = pendingFriendRequests.find(req => req.id === requestId);
    if (!request) return;
    
    // Add to friends list
    const newFriend: Friend = {
      id: request.senderId,
      name: request.senderName,
      phoneNumber: request.senderPhone,
      avatar: request.senderAvatar,
      isOnline: Math.random() > 0.5, // Random online status
      mutualFriends: request.mutualFriends || 0,
      joinedDate: new Date().toISOString()
    };
    
    setFriends(prev => [...prev, newFriend]);
    
    // Remove from pending requests
    setPendingFriendRequests(prev => prev.filter(req => req.id !== requestId));
    
    showToast(`You're now friends with ${request.senderName}!`, 'success');
  };
  
  const declineFriendRequest = async (requestId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const request = pendingFriendRequests.find(req => req.id === requestId);
    if (!request) return;
    
    setPendingFriendRequests(prev => prev.filter(req => req.id !== requestId));
    showToast('Friend request declined', 'info');
  };
  
  const cancelFriendRequest = async (requestId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const request = sentFriendRequests.find(req => req.id === requestId);
    if (!request) return;
    
    setSentFriendRequests(prev => prev.filter(req => req.id !== requestId));
    showToast('Friend request cancelled', 'info');
  };
  
  const removeFriend = async (friendId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;
    
    setFriends(prev => prev.filter(f => f.id !== friendId));
    showToast(`Removed ${friend.name} from friends`, 'info');
  };
  
  const blockUser = async (userId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Remove from friends if they are a friend
    setFriends(prev => prev.filter(f => f.id !== userId));
    
    // Remove any pending requests
    setPendingFriendRequests(prev => prev.filter(req => req.senderId !== userId));
    setSentFriendRequests(prev => prev.filter(req => req.receiverId !== userId));
    
    showToast('User blocked successfully', 'info');
  };
  
  const getFriendById = (friendId: string): Friend | undefined => {
    return friends.find(friend => friend.id === friendId);
  };

  // Contact sync functions
  const requestContactsPermission = async (): Promise<boolean> => {
    // Simulate permission request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would use the Contacts API
    // For now, we'll simulate user granting permission
    const granted = confirm('Allow LogUp to access your contacts to find friends?');
    setContactsPermissionGranted(granted);
    
    if (granted) {
      await syncContacts();
      showToast('Contacts synced successfully!', 'success');
    }
    
    return granted;
  };

  const syncContacts = async (): Promise<void> => {
    if (!contactsPermissionGranted) return;
    
    // Simulate contact sync delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock contacts data - in real app, this would come from device contacts
    const mockContacts: Contact[] = [
      {
        id: 'contact-1',
        name: 'Mom',
        phoneNumber: '+91 9876543220',
        isOnApp: false,
        friendStatus: 'none'
      },
      {
        id: 'contact-2',
        name: 'Amit Verma',
        phoneNumber: '+91 9876543215',
        isOnApp: true,
        friendStatus: 'none'
      },
      {
        id: 'contact-3',
        name: 'Kavya Reddy',
        phoneNumber: '+91 9876543216',
        isOnApp: true,
        friendStatus: 'none'
      },
      {
        id: 'contact-4',
        name: 'Work - John',
        phoneNumber: '+91 9876543221',
        isOnApp: false,
        friendStatus: 'none'
      },
      {
        id: 'contact-5',
        name: 'Rahul Sharma',
        phoneNumber: '+91 9876543210',
        isOnApp: true,
        friendStatus: 'friends'
      }
    ];
    
    setContacts(mockContacts);
  };

  // Toast functions
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Quick Entry Template functions
  const addQuickEntryTemplate = (template: Omit<QuickEntryTemplate, 'id' | 'createdAt'>) => {
    const newTemplate: QuickEntryTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setQuickEntryTemplates(prev => [...prev, newTemplate]);
    showToast('Template saved successfully!', 'success');
  };

  const deleteQuickEntryTemplate = (id: string) => {
    setQuickEntryTemplates(prev => prev.filter(template => template.id !== id));
    showToast('Template deleted', 'info');
  };
  
  // Friend Chat Functions
  const addFriendMessage = (friendId: string, text: string, isUser: boolean) => {
    const newMessage: FriendMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      status: 'sent'
    };
    
    setFriendMessages(prev => {
      const newMap = new Map(prev);
      const existingMessages = newMap.get(friendId) || [];
      newMap.set(friendId, [...existingMessages, newMessage]);
      return newMap;
    });
    
    // Simulate friend response if user sent message
    if (isUser) {
      setFriendTyping(friendId, true);
      setTimeout(() => {
        setFriendTyping(friendId, false);
        const responses = [
          "Hey! How's it going?",
          "Thanks for the message!",
          "Sure, let's catch up soon!",
          "That sounds great!",
          "I'm doing well, thanks for asking!",
          "Let's plan something for the weekend!",
          "Absolutely! Count me in.",
          "Thanks for thinking of me!",
          "Hope you're having a good day!",
          "Let's split that expense we talked about."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const friendResponse: FriendMessage = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          isUser: false,
          timestamp: new Date(),
          status: 'delivered'
        };
        
        setFriendMessages(prev => {
          const newMap = new Map(prev);
          const existingMessages = newMap.get(friendId) || [];
          newMap.set(friendId, [...existingMessages, friendResponse]);
          return newMap;
        });
      }, 1000 + Math.random() * 2000);
    }
  };
  
  const getFriendMessages = (friendId: string): FriendMessage[] => {
    return friendMessages.get(friendId) || [];
  };
  
  const markMessagesAsRead = (friendId: string) => {
    setFriendMessages(prev => {
      const newMap = new Map(prev);
      const messages = newMap.get(friendId) || [];
      const updatedMessages = messages.map(msg => 
        !msg.isUser ? { ...msg, status: 'read' as const } : msg
      );
      newMap.set(friendId, updatedMessages);
      return newMap;
    });
  };
  
  const getUnreadMessageCount = (friendId: string): number => {
    const messages = friendMessages.get(friendId) || [];
    return messages.filter(msg => !msg.isUser && msg.status !== 'read').length;
  };
  
  const setFriendTyping = (friendId: string, typing: boolean) => {
    setIsTyping(prev => {
      const newMap = new Map(prev);
      newMap.set(friendId, typing);
      return newMap;
    });
  };
  
  // Income functions
  const addIncomeEntry = (entry: Omit<IncomeEntry, 'id'>) => {
    const newEntry: IncomeEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setIncomeEntries(prev => [...prev, newEntry]);
    showToast('Income entry added!', 'success');
  };
  
  // Location-based suggestions function
  const updateLocationSuggestions = (latitude: number, longitude: number) => {
    // Mock nearby merchants based on location
    const mockSuggestions: LocationSuggestion[] = [
      {
        id: '1',
        merchantName: 'Cafe Delight',
        category: 'Food & Dining',
        estimatedAmount: 300,
        distance: '50m'
      },
      {
        id: '2',
        merchantName: 'Metro Station',
        category: 'Transportation',
        estimatedAmount: 45,
        distance: '100m'
      },
      {
        id: '3',
        merchantName: 'Big Bazaar',
        category: 'Shopping',
        estimatedAmount: 800,
        distance: '200m'
      },
      {
        id: '4',
        merchantName: 'Petrol Pump',
        category: 'Transportation',
        estimatedAmount: 2000,
        distance: '150m'
      }
    ];
    
    setLocationSuggestions(mockSuggestions);
  };

  // Generate smart nudges based on user data
  useEffect(() => {
    const generateNudges = () => {
      const newNudges: Omit<Nudge, 'id' | 'createdAt'>[] = [];
      
      // Budget nudges
      budgets.forEach(budget => {
        const percentage = (budget.spent / budget.limit) * 100;
        if (percentage >= 80 && percentage < 100) {
          newNudges.push({
            message: `You're ${percentage.toFixed(0)}% through your ${budget.category} budget for this month!`,
            type: 'budget',
            actionLink: '/budgets',
            priority: 'medium'
          });
        } else if (percentage >= 100) {
          newNudges.push({
            message: `You've exceeded your ${budget.category} budget by ₹${(budget.spent - budget.limit).toLocaleString()}`,
            type: 'budget',
            actionLink: '/budgets',
            priority: 'high'
          });
        }
      });
      
      // Goal nudges
      goals.forEach(goal => {
        const daysLeft = Math.ceil((new Date(goal.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
        const remainingAmount = goal.targetAmount - goal.currentAmount;
        
        if (daysLeft <= 30 && progressPercentage < 80) {
          newNudges.push({
            message: `Only ${daysLeft} days left for "${goal.name}"! Consider saving ₹${Math.ceil(remainingAmount / daysLeft)} daily.`,
            type: 'goal',
            actionLink: '/goals',
            priority: 'high'
          });
        }
      });
      
      // Debt nudges
      debts.forEach(debt => {
        const daysLeft = Math.ceil((new Date(debt.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 3 && debt.status === 'pending') {
          newNudges.push({
            message: `Reminder: ₹${debt.amount} ${debt.type === 'lent' ? 'from' : 'to'} ${debt.personName} is due in ${daysLeft} days`,
            type: 'debt',
            actionLink: '/debts',
            priority: 'high'
          });
        }
      });
      
      // Add new nudges
      newNudges.forEach(nudge => addNudge(nudge));
    };
    
    // Generate nudges on component mount and then every hour
    generateNudges();
    const interval = setInterval(generateNudges, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [budgets, goals, debts]);

  const addMessage = (text: string, isUser: boolean, memory?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      memory
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Update budget spending if this is an expense
    if (memory?.type === 'expense' && memory?.category && memory?.amount) {
      updateBudgetSpending(memory.category, memory.amount);
    }
  };

  const updateBudgetSpending = (category: string, amount: number) => {
    setBudgets(prev => 
      prev.map(budget => 
        budget.category === category 
          ? { ...budget, spent: budget.spent + amount }
          : budget
      )
    );
  };

  // SMS Transaction functions
  const addPendingSmsTransaction = (transaction: Omit<SmsTransaction, 'id'>) => {
    const newTransaction: SmsTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setPendingSmsTransactions(prev => [...prev, newTransaction]);
    showToast('New SMS transaction detected!', 'info');
  };

  const confirmSmsTransaction = (id: string) => {
    const transaction = pendingSmsTransactions.find(t => t.id === id);
    if (transaction) {
      const confirmText = `SMS Transaction Confirmed: ₹${transaction.amount} at ${transaction.merchantName}`;
      addMessage(confirmText, true, {
        type: 'expense',
        amount: transaction.amount,
        description: transaction.merchantName,
        category: transaction.category,
        source: 'sms',
        timestamp: new Date().toISOString()
      });
      
      setPendingSmsTransactions(prev => prev.filter(t => t.id !== id));
      showToast('Transaction confirmed successfully!', 'success');
    }
  };

  const editSmsTransaction = (id: string, updates: Partial<SmsTransaction>) => {
    setPendingSmsTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
    showToast('Transaction updated!', 'success');
  };

  const ignoreSmsTransaction = (id: string) => {
    setPendingSmsTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaction ignored', 'info');
  };

  // Receipt Transaction functions
  const addReceiptTransaction = (transaction: Omit<ReceiptTransaction, 'id'>) => {
    const newTransaction: ReceiptTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setPendingReceiptTransactions(prev => [...prev, newTransaction]);
    showToast('Receipt scanned successfully!', 'success');
  };

  const confirmReceiptTransaction = (id: string) => {
    const transaction = pendingReceiptTransactions.find(t => t.id === id);
    if (transaction) {
      const confirmText = `Receipt Scanned: ₹${transaction.amount} at ${transaction.merchantName}`;
      addMessage(confirmText, true, {
        type: 'expense',
        amount: transaction.amount,
        description: transaction.merchantName,
        category: transaction.category,
        source: 'receipt',
        timestamp: new Date().toISOString()
      });
      
      setPendingReceiptTransactions(prev => prev.filter(t => t.id !== id));
      showToast('Receipt transaction confirmed!', 'success');
    }
  };

  const editReceiptTransaction = (id: string, updates: Partial<ReceiptTransaction>) => {
    setPendingReceiptTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
    showToast('Receipt transaction updated!', 'success');
  };

  const ignoreReceiptTransaction = (id: string) => {
    setPendingReceiptTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Receipt transaction ignored', 'info');
  };

  // Budget functions
  const addBudget = (budget: Omit<Budget, 'id' | 'spent' | 'createdAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
      createdAt: new Date().toISOString()
    };
    setBudgets(prev => [...prev, newBudget]);
    showToast('Budget created successfully!', 'success');
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(prev => 
      prev.map(budget => budget.id === id ? { ...budget, ...updates } : budget)
    );
    showToast('Budget updated!', 'success');
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
    showToast('Budget deleted', 'info');
  };

  const getBudgetProgress = (categoryName: string) => {
    const budget = budgets.find(b => b.category === categoryName);
    if (!budget) return { spent: 0, limit: 0, percentage: 0 };
    
    const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
    return { spent: budget.spent, limit: budget.limit, percentage };
  };

  // Goal functions
  const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      currentAmount: 0,
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
    showToast('Goal created successfully!', 'success');
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => 
      prev.map(goal => goal.id === id ? { ...goal, ...updates } : goal)
    );
    showToast('Goal updated!', 'success');
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    showToast('Goal deleted', 'info');
  };

  const addToGoal = (id: string, amount: number) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === id 
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
          : goal
      )
    );
    showToast(`₹${amount} added to goal!`, 'success');
  };

  // Debt functions
  const addDebt = (debt: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setDebts(prev => [...prev, newDebt]);
    showToast('Debt entry added!', 'success');
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(prev => 
      prev.map(debt => debt.id === id ? { ...debt, ...updates } : debt)
    );
    showToast('Debt updated!', 'success');
  };

  const markDebtAsPaid = (id: string) => {
    setDebts(prev => 
      prev.map(debt => debt.id === id ? { ...debt, status: 'paid' as const } : debt)
    );
    showToast('Debt marked as paid!', 'success');
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
    showToast('Debt entry deleted', 'info');
  };

  // Split expense functions
  const addSplitExpense = (expense: Omit<SplitExpense, 'id' | 'createdAt'>) => {
    const newExpense: SplitExpense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSplitExpenses(prev => [...prev, newExpense]);
    
    // Convert split expense to individual debts
    const currentUser = user?.displayName || 'You';
    expense.participants.forEach(participant => {
      if (participant.amountOwed > 0) {
        const newDebt: Debt = {
          id: `split-${Date.now()}-${participant.id}`,
          personName: participant.name,
          phoneNumber: participant.phoneNumber,
          amount: participant.amountOwed,
          type: 'lent',
          description: `Split expense: ${expense.description}`,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        setDebts(prev => [...prev, newDebt]);
      }
    });
    
    showToast('Expense split and debts created!', 'success');
  };

  const generateReminderMessage = (debt: Debt) => {
    const daysOverdue = Math.ceil((new Date().getTime() - new Date(debt.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysOverdue > 0;
    
    if (debt.type === 'lent') {
      return `Hi ${debt.personName}! This is a friendly reminder that you have an outstanding amount of ₹${debt.amount} for "${debt.description}". ${
        isOverdue 
          ? `This payment was due ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} ago.` 
          : 'This payment is due today.'
      } Please contact the lender at your earliest convenience if you wish to discuss payment or need an extension. Thank you!`;
    } else {
      return `Hi ${debt.personName}! This is a reminder that I owe you ₹${debt.amount} for "${debt.description}". ${
        isOverdue 
          ? `This payment was due ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} ago.` 
          : 'This payment is due today.'
      } I will settle this amount soon. Thank you for your patience!`;
    }
  };

  // Mock SMS sending function
  const sendMockSms = (phoneNumber: string, message: string) => {
    // Simulate SMS sending delay
    setTimeout(() => {
      showToast(`SMS sent to ${phoneNumber}`, 'success');
    }, 500);
  };

  // Nudge functions
  const addNudge = (nudge: Omit<Nudge, 'id' | 'createdAt'>) => {
    const newNudge: Nudge = {
      ...nudge,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setActiveNudges(prev => {
      // Avoid duplicate nudges
      const exists = prev.some(n => n.message === newNudge.message);
      if (exists) return prev;
      return [...prev, newNudge];
    });
  };

  const dismissNudge = (id: string) => {
    setActiveNudges(prev => prev.filter(nudge => nudge.id !== id));
  };

  // Dashboard functions
  const updateWidgetOrder = (widgets: DashboardWidget[]) => {
    setDashboardWidgets(widgets);
    showToast('Widget order updated!', 'success');
  };

  const toggleWidget = (id: string) => {
    setDashboardWidgets(prev => 
      prev.map(widget => 
        widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
      )
    );
    const widget = dashboardWidgets.find(w => w.id === id);
    if (widget) {
      showToast(`${widget.title} ${widget.enabled ? 'disabled' : 'enabled'}`, 'info');
    }
  };

  const value = {
    messages,
    addMessage,
    sidebarOpen,
    setSidebarOpen,
    manualEntryOpen,
    setManualEntryOpen,
    receiptScannerOpen,
    setReceiptScannerOpen,
    botTone,
    setBotTone,
    developerMode,
    setDeveloperMode,
    smsPermissionGranted,
    setSmsPermissionGranted,
    pendingSmsTransactions,
    addPendingSmsTransaction,
    confirmSmsTransaction,
    editSmsTransaction,
    ignoreSmsTransaction,
    showSmsPermissionModal,
    setShowSmsPermissionModal,
    pendingReceiptTransactions,
    addReceiptTransaction,
    confirmReceiptTransaction,
    editReceiptTransaction,
    ignoreReceiptTransaction,
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetProgress,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addToGoal,
    debts,
    addDebt,
    updateDebt,
    markDebtAsPaid,
    deleteDebt,
    activeNudges,
    addNudge,
    dismissNudge,
    dashboardWidgets,
    updateWidgetOrder,
    toggleWidget,
    toasts,
    showToast,
    removeToast,
    quickEntryTemplates,
    addQuickEntryTemplate,
    deleteQuickEntryTemplate,
    friendMessages,
    addFriendMessage,
    getFriendMessages,
    markMessagesAsRead,
    getUnreadMessageCount,
    isTyping,
    setFriendTyping,
    locationSuggestions,
    updateLocationSuggestions,
    incomeEntries,
    addIncomeEntry,
    showWidgetManager,
    setShowWidgetManager,
    totalNotifications,
    friends,
    pendingFriendRequests,
    sentFriendRequests,
    searchResults,
    contacts,
    contactsPermissionGranted,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    removeFriend,
    blockUser,
    getFriendById,
    syncContacts,
    requestContactsPermission,
    splitExpenses,
    addSplitExpense,
    generateReminderMessage,
    sendMockSms,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};