import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import QuickEntryPage from './pages/QuickEntryPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import SpendingPage from './pages/SpendingPage';
import SavingsPage from './pages/SavingsPage';
import StoryPage from './pages/StoryPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import SmsReviewPage from './pages/SmsReviewPage';
import BudgetsPage from './pages/BudgetsPage';
import GoalsPage from './pages/GoalsPage';
import DebtsPage from './pages/DebtsPage';
import SplitExpensePage from './pages/SplitExpensePage';
import FriendsPage from './pages/FriendsPage';
import FriendChatPage from './pages/FriendChatPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <QuickEntryPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Layout>
                    <ChatPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/budgets" element={
                <ProtectedRoute>
                  <Layout>
                    <BudgetsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/goals" element={
                <ProtectedRoute>
                  <Layout>
                    <GoalsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/debts" element={
                <ProtectedRoute>
                  <Layout>
                    <DebtsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/split-expense" element={
                <ProtectedRoute>
                  <SplitExpensePage />
                </ProtectedRoute>
              } />
              <Route path="/spend/:period" element={
                <ProtectedRoute>
                  <Layout>
                    <SpendingPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/savings" element={
                <ProtectedRoute>
                  <Layout>
                    <SavingsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/subscriptions" element={
                <ProtectedRoute>
                  <Layout>
                    <SubscriptionsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/sms-review" element={
                <ProtectedRoute>
                  <Layout>
                    <SmsReviewPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/story" element={
                <ProtectedRoute>
                  <Layout>
                    <StoryPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute>
                  <Layout>
                    <AccountPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/friends" element={
                <ProtectedRoute>
                  <Layout>
                    <FriendsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/chat/friend/:friendId" element={
                <ProtectedRoute>
                  <Layout>
                    <FriendChatPage />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}