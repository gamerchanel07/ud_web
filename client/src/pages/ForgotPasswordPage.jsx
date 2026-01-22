import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import API from '../services/api';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: enter username, 2: reset password
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/forgot-password', { username });
      if (response.data.resetCode) {
        console.log(`🔐 Reset Code: ${response.data.resetCode}`);
      }
      setSuccess(t('forgotPassword.resetCodeSent'));
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await API.post('/auth/reset-password', {
        username,
        resetCode,
        newPassword
      });
      setSuccess(t('forgotPassword.resetSuccess'));
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || t('forgotPassword.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 size={40} className="text-ocean-300" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-ocean-300 to-blue-300 bg-clip-text text-transparent">
              UD Hotels
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-100">{t('forgotPassword.title')}</h2>
        </div>

        {/* Card */}
        <div className="glass glass-lg p-8 rounded-2xl">
          {step === 1 ? (
            // Step 1: Enter Username
            <form onSubmit={handleSendReset} className="space-y-6">
              <p className="text-gray-300 text-center text-sm mb-4">
                {t('forgotPassword.description')}
              </p>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('forgotPassword.username')}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('forgotPassword.username')}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-ocean-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-ocean-700 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-300 glow hover:glow-lg text-sm bg-gradient-to-r from-ocean-600 to-blue-600 hover:from-ocean-700 hover:to-blue-700 px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-white"
              >
                {loading ? t('common.loading') : t('forgotPassword.sendCode')}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-ocean-300 hover:text-ocean-200 transition-colors text-sm"
              >
                <ArrowLeft size={16} />
                {t('forgotPassword.backToLogin')}
              </Link>
            </form>
          ) : (
            // Step 2: Reset Password
            <form onSubmit={handleResetPassword} className="space-y-6">
              <p className="text-gray-300 text-center text-sm mb-4">
                {t('forgotPassword.enterCode')}
              </p>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('forgotPassword.code')}
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder={t('forgotPassword.enterCode')}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ocean-400 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('forgotPassword.newPassword')}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('forgotPassword.enterNewPassword')}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ocean-400 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('register.confirmPassword')}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ocean-400 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-ocean-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-ocean-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? t('common.loading') : t('forgotPassword.resetPassword')}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                  setSuccess('');
                  setResetCode('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="flex items-center justify-center gap-2 text-ocean-300 hover:text-ocean-200 transition-colors text-sm w-full"
              >
                <ArrowLeft size={16} />
                {t('common.cancel')}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          {t('login.dontHaveAccount')}{' '}
          <Link to="/login" className="text-ocean-300 hover:text-ocean-200 transition-colors">
            {t('login.title')}
          </Link>
        </p>
      </div>
    </div>
  );
};
