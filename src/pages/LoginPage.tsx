import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DollarSign, Mail, Phone, Chrome, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { user, login, signup, loginWithGoogle, loginWithPhone } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      await loginWithGoogle();
    } catch (error: any) {
      setError(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!phone) return;
    setLoading(true);
    setError('');
    
    try {
      await loginWithPhone(phone);
    } catch (error: any) {
      setError(error.message || 'Phone login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#0a0a0c] via-[#0e0e10] to-[#1a1a1d]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00FFD1] to-[#667eea] rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#00FFD1] to-[#667eea] rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md z-10 relative">
        {/* Logo and Branding */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-3xl blur-lg opacity-50"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-[#00FFD1] to-[#667eea] rounded-3xl flex items-center justify-center shadow-2xl">
                <DollarSign size={40} className="text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-[#00FFD1] via-[#667eea] to-[#764ba2] bg-clip-text text-transparent drop-shadow-sm">
              LogUp
            </h1>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-[#f1f1f1] text-lg sm:text-xl font-semibold drop-shadow-sm">
                Own Your Financial Sh!t
              </p>
              <p className="text-[#a1a1aa] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                Smart AI-powered expense tracking with real-time insights and automated categorization
              </p>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="glass-card rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[#ef4444] bg-opacity-10 border border-[#ef4444] border-opacity-30 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} className="text-[#ef4444] flex-shrink-0" />
              <p className="text-[#ef4444] text-sm">{error}</p>
            </div>
          )}

          {/* Tab Selector */}
          <div className="flex mb-4 sm:mb-8 glass rounded-2xl p-1 sm:p-1.5 border border-white/5">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center rounded-xl transition-all duration-500 font-semibold text-sm ${
                isLogin 
                  ? 'bg-gradient-to-r from-[#00FFD1] to-[#667eea] text-white shadow-xl transform scale-[1.02]' 
                  : 'text-[#a1a1aa] hover:text-[#f1f1f1] hover:bg-white/5'
              }`}
            >
              Welcome Back
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center rounded-xl transition-all duration-500 font-semibold text-sm ${
                !isLogin 
                  ? 'bg-gradient-to-r from-[#00FFD1] to-[#667eea] text-white shadow-xl transform scale-[1.02]' 
                  : 'text-[#a1a1aa] hover:text-[#f1f1f1] hover:bg-white/5'
              }`}
            >
              Get Started
            </button>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 sm:space-y-6 mb-4 sm:mb-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a1a1aa]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 input-field rounded-xl text-[#f1f1f1] placeholder-[#a1a1aa] border border-white/10 focus:border-[#00FFD1] transition-all duration-300"
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 sm:py-4 input-field rounded-xl text-[#f1f1f1] placeholder-[#a1a1aa] border border-white/10 focus:border-[#00FFD1] transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-[#a1a1aa] hover:text-[#f1f1f1] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient py-3 sm:py-4 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>Processing...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? 'Sign In to LogUp' : 'Create Your Account'}
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-4 sm:mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="text-[#a1a1aa] text-sm font-medium px-4 bg-[#1a1a1d] rounded-full">
              or continue with
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full glass p-3 sm:p-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:glass-card transition-all duration-300 text-[#f1f1f1] disabled:opacity-50 border border-white/10 hover:border-white/20 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Chrome size={20} />
              Continue with Google
            </button>
            
            <div className="flex gap-3">
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 pl-4 pr-4 py-3 sm:py-4 input-field rounded-xl text-[#f1f1f1] placeholder-[#a1a1aa] border border-white/10 focus:border-[#00FFD1] transition-all duration-300"
              />
              <button
                onClick={handlePhoneLogin}
                disabled={loading || !phone}
                className="glass p-3 sm:p-4 rounded-xl hover:glass-card transition-all duration-300 text-[#f1f1f1] disabled:opacity-50 border border-white/10 hover:border-white/20 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-8 space-y-2 sm:space-y-3">
          <p className="text-[#a1a1aa] text-xs leading-relaxed max-w-sm mx-auto">
            By continuing, you agree to our{' '}
            <span className="text-[#00FFD1] hover:text-[#667eea] cursor-pointer transition-colors">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-[#00FFD1] hover:text-[#667eea] cursor-pointer transition-colors">
              Privacy Policy
            </span>
          </p>
          
          <div className="flex items-center justify-center gap-2 text-xs text-[#a1a1aa] pb-4 sm:pb-0">
            <div className="w-2 h-2 bg-[#00FFD1] rounded-full animate-pulse"></div>
            <span>Secure authentication powered by Firebase</span>
          </div>
        </div>

        {/* reCAPTCHA container for phone auth */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default LoginPage;