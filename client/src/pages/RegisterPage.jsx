import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2, Mail, Lock, UserPlus } from 'lucide-react';

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '0.5rem',
        padding: '2rem',
        width: '100%',
        maxWidth: '28rem',
        border: '1px solid var(--border-light)'
      }}>
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
        }}>
          <Building2 size={32} style={{color: 'var(--primary-main)'}} />
          {t('register.title')}
        </h1>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: '#EF4444',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.5)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label style={{color: 'var(--text-primary)'}} className="block font-bold mb-2">{t('register.username')}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '0.375rem',
                color: 'var(--text-primary)'
              }}
              placeholder={t('register.chooseUsername')}
              required
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
            />
          </div>

          <div className="mb-4">
            <label style={{color: 'var(--text-primary)'}} className="block font-bold mb-2">{t('register.email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '0.375rem',
                color: 'var(--text-primary)'
              }}
              placeholder={t('register.enterEmail')}
              required
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
            />
          </div>

          <div className="mb-4">
            <label style={{color: 'var(--text-primary)'}} className="block font-bold mb-2">{t('register.password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '0.375rem',
                color: 'var(--text-primary)'
              }}
              placeholder={t('register.enterPassword')}
              required
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
            />
          </div>

          <div className="mb-6">
            <label style={{color: 'var(--text-primary)'}} className="block font-bold mb-2">{t('register.confirmPassword')}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '0.375rem',
                color: 'var(--text-primary)'
              }}
              placeholder={t('register.confirmPasswordPlaceholder')}
              required
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
            />
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
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = '1')}
          >
            {loading ? '⏳ ' + t('common.loading') : (<><UserPlus size={16} /> {t('register.createAccount')}</>)}
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)'}}>
          {t('register.alreadyHaveAccount')}{' '}
          <Link to="/login" style={{color: 'var(--primary-main)', fontWeight: 'bold', textDecoration: 'none'}} className="hover:underline">
            {t('register.loginHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};
