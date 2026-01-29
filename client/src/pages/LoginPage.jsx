import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2, Lock, User, LogIn, Loader } from 'lucide-react';

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
      padding: 'var(--spacing-sm)',
      backgroundColor: 'var(--bg-primary)'
    }} className="animate-fade-in">
      {/* Background blur effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(0, 173, 181, 0.1), transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div className="card" style={{
        backgroundColor: 'var(--bg-secondary)',
        width: '100%',
        maxWidth: '28rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div className="card-header">
          <h1 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            textAlign: 'center',
            color: 'var(--primary-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-xs)',
            margin: 0
          }} className="animate-slide-in-down">
            <Building2 size={32} />
            {t('login.title')}
          </h1>
        </div>

        {/* Body */}
        <div className="card-body">

          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-error)',
              fontSize: 'var(--text-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)'
            }} className="animate-shake">
              <div style={{width: '4px', height: '4px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-error)'}} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="animate-stagger space-y-4">
            {/* Username Field */}
            <div className="animate-slide-in-left">
              <label className="form-label required">{t('login.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder={t('login.username')}
                required
              />
            </div>

            {/* Password Field */}
            <div className="animate-slide-in-right">
              <label className="form-label required">{t('login.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder={t('login.password')}
                required
              />
              <div style={{textAlign: 'right', marginTop: 'var(--spacing-xs)'}}>
                <Link 
                  to="/forgot-password" 
                  className="hover:underline"
                  style={{
                    color: 'var(--primary-main)',
                    fontSize: 'var(--text-xs)',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-6"
              style={{
                width: '100%',
                marginTop: 'var(--spacing-lg)'
              }}
            >
              {loading ? (
                <><Loader size={16} className="animate-spin" /> {t('common.loading')}</>
              ) : (
                <><LogIn size={16} /> {t('login.title')}</>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="card-footer" style={{textAlign: 'center'}}>
          <p style={{
            margin: 0,
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)'
          }}>
            {t('login.dontHaveAccount')}{' '}
            <Link 
              to="/register" 
              style={{
                color: 'var(--primary-main)',
                fontWeight: 'var(--font-semibold)',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {t('login.registerHere')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
