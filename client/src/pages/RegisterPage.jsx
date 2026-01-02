import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2 } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('register.title'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="glass glass-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-6 flex items-center justify-center gap-2">
          <Building2 size={32} className="text-purple-300" />
          {t('register.title')}
        </h1>

        {error && (
          <div className="bg-red-500/30 text-red-200 p-3 rounded-lg mb-4 border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-200 font-bold mb-2">{t('register.username')}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100 placeholder-gray-400"
              placeholder={t('register.chooseUsername')}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-200 font-bold mb-2">{t('register.email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100 placeholder-gray-400"
              placeholder={t('register.enterEmail')}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-200 font-bold mb-2">{t('register.password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100 placeholder-gray-400"
              placeholder={t('register.enterPassword')}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-200 font-bold mb-2">{t('register.confirmPassword')}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100 placeholder-gray-400"
              placeholder={t('register.confirmPasswordPlaceholder')}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-300 glow hover:glow-lg"
          >
            {loading ? t('common.loading') : t('register.createAccount')}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-300">
          {t('register.alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-purple-300 font-bold hover:text-purple-200 transition-colors">
            {t('register.loginHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};
