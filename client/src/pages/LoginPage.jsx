import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2 } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="glass glass-lg p-6 md:p-8 w-full max-w-md card-enter">
        <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-ocean-300 to-blue-300 bg-clip-text text-transparent mb-6 animate-slide-in-down flex items-center justify-center gap-2">
          <Building2 size={32} className="text-ocean-300" />
          {t('login.title')}
        </h1>

        {error && (
          <div className="bg-red-500/30 text-red-200 p-3 rounded-lg mb-4 border border-red-500/50 animate-shake text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="animate-stagger">
          <div className="mb-4 animate-slide-in-left">
            <label className="block text-gray-200 font-bold mb-2 text-sm">{t('login.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-ocean-400 text-gray-100 placeholder-gray-400 input-focus transition-all duration-300 text-sm"
              placeholder={t('login.username')}
              required
            />
          </div>

          <div className="mb-6 animate-slide-in-right">
            <label className="block text-gray-200 font-bold mb-2 text-sm">{t('login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-ocean-400 text-gray-100 placeholder-gray-400 input-focus transition-all duration-300 text-sm"
              placeholder={t('login.password')}
              required
            />
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-ocean-300 text-xs hover:text-ocean-200 transition-colors">
                {t('login.forgotPassword')}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-ocean-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-ocean-700 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-300 glow hover:glow-lg text-sm"
          >
            {loading ? t('common.loading') : t('login.title')}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-300 text-sm">
          {t('login.dontHaveAccount')}{' '}
          <Link to="/register" className="text-ocean-300 font-bold hover:text-ocean-200 transition-colors">
            {t('login.registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};
