import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2, Mail, Lock, UserPlus, Loader } from 'lucide-react';

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
      padding: 'var(--spacing-sm)',
      backgroundColor: 'var(--bg-primary)'
    }} className="animate-fade-in">
      {/* Background blur effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 80% 50%, rgba(0, 173, 181, 0.1), transparent 50%)',
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
            {t('register.title')}
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
              <label className="form-label required">{t('register.username')}</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder={t('register.chooseUsername')}
                required
              />
            </div>

            {/* Email Field */}
            <div className="animate-slide-in-right">
              <label className="form-label required">{t('register.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder={t('register.enterEmail')}
                required
              />
            </div>

            {/* Password Field */}
            <div className="animate-slide-in-left">
              <label className="form-label required">{t('register.password')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder={t('register.enterPassword')}
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="animate-slide-in-right">
              <label className="form-label required">{t('register.confirmPassword')}</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder={t('register.confirmPasswordPlaceholder')}
                required
              />
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
                <><UserPlus size={16} /> {t('register.createAccount')}</>
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
            {t('register.alreadyHaveAccount')}{' '}
            <Link 
              to="/login" 
              style={{
                color: 'var(--primary-main)',
                fontWeight: 'var(--font-semibold)',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {t('register.loginHere')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
