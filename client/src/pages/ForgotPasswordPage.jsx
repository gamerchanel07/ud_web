import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import API from '../services/api';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: กรอกชื่อผู้ใช้, 2: รีเซ็ตผ่านรหัสผาน
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
            {t('forgotPassword.title')}
          </h1>
        </div>

        {/* Body */}
        <div className="card-body">
          {step === 1 ? (
            // Step 1: Enter username
            <form onSubmit={handleSendReset} className="animate-stagger space-y-4">
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                textAlign: 'center',
                marginBottom: 'var(--spacing-md)'
              }}>
                {t('forgotPassword.description')}
              </p>

              {error && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '2px solid var(--color-error)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-sm)',
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

              {success && (
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '2px solid var(--color-success)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-sm)',
                  color: 'var(--color-success)',
                  fontSize: 'var(--text-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}>
                  <div style={{width: '4px', height: '4px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-success)'}} />
                  {success}
                </div>
              )}

              <div className="animate-slide-in-left">
                <label className="form-label required">{t('forgotPassword.username')}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  placeholder={t('forgotPassword.username')}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
                style={{ width: '100%' }}
              >
                {loading ? t('common.loading') : t('forgotPassword.sendCode')}
              </button>

              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-xs)',
                  color: 'var(--primary-main)',
                  fontSize: 'var(--text-sm)',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <ArrowLeft size={16} />
                {t('forgotPassword.backToLogin')}
              </Link>
            </form>
          ) : (
            // Step 2: Reset password
            <form onSubmit={handleResetPassword} className="animate-stagger space-y-4">
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                textAlign: 'center',
                marginBottom: 'var(--spacing-md)'
              }}>
                {t('forgotPassword.enterCode')}
              </p>

              {error && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '2px solid var(--color-error)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-sm)',
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

              <div className="animate-slide-in-left">
                <label className="form-label required">{t('forgotPassword.code')}</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="form-input"
                  placeholder={t('forgotPassword.enterCode')}
                  required
                />
              </div>

              <div className="animate-slide-in-right">
                <label className="form-label required">{t('forgotPassword.newPassword')}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  placeholder={t('forgotPassword.enterNewPassword')}
                  required
                />
              </div>

              <div className="animate-slide-in-left">
                <label className="form-label required">{t('register.confirmPassword')}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
                style={{ width: '100%' }}
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
                className="btn btn-secondary w-full"
                style={{ width: '100%' }}
              >
                <ArrowLeft size={16} />
                {t('common.cancel')}
              </button>
            </form>
          )}
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
              {t('login.title')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
