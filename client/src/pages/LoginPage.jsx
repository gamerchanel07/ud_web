import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2, Lock, User, LogIn } from 'lucide-react';

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'var(--bg-primary)'
    }} className="animate-fade-in">
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '0.5rem',
        padding: '2rem',
        width: '100%',
        maxWidth: '28rem',
        border: '1px solid var(--border-light)'
      }} className="card-enter">
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'var(--primary-main)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }} className="animate-slide-in-down">
          <Building2 size={32} style={{color: 'var(--primary-main)'}} />
          {t('login.title')}
        </h1>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: '#EF4444',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            fontSize: '0.875rem'
          }} className="animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="animate-stagger">
          <div className="mb-4 animate-slide-in-left">
            <label style={{color: 'var(--text-primary)', fontSize: '0.875rem'}} className="block font-bold mb-2">{t('login.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '0.375rem',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
              placeholder={t('login.username')}
              required
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
            />
          </div>

          <div className="mb-6 animate-slide-in-right">
            <label style={{color: 'var(--text-primary)', fontSize: '0.875rem'}} className="block font-bold mb-2">{t('login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '0.375rem',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
              placeholder={t('login.password')}
              required
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
            />
            <div style={{textAlign: 'right', marginTop: '0.5rem'}}>
              <Link to="/forgot-password" style={{color: 'var(--primary-main)', fontSize: '0.75rem', textDecoration: 'none'}} className="hover:underline">
                {t('login.forgotPassword')}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? 'rgba(107, 114, 128, 0.5)' : 'var(--primary-main)',
              color: 'white',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              borderRadius: '0.375rem',
              fontWeight: 'bold',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = '1')}
          >
            {loading ? '⏳ ' + t('common.loading') : (<><LogIn size={16} /> {t('login.title')}</>)}
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
          {t('login.dontHaveAccount')}{' '}
          <Link to="/register" style={{color: 'var(--primary-main)', fontWeight: 'bold', textDecoration: 'none'}} className="hover:underline">
            {t('login.registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};
