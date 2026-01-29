import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    
    // Add animation class to document
    document.documentElement.classList.add('theme-transition');
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
      document.documentElement.classList.remove('theme-transition');
    }, 500);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800"
        aria-label="Toggle theme"
      >
        <Sun size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'relative',
        padding: '0.625rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-tertiary)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isAnimating ? '0 4px 12px rgba(0, 173, 181, 0.3)' : '0 0px 0px transparent'
      }}
      className="hover:shadow-md focus:outline-none"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon
          size={20}
          style={{
            color: 'var(--text-primary)',
            transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            transform: isAnimating ? 'rotate(-180deg) scale(0)' : 'rotate(0) scale(1)',
            opacity: isAnimating ? 0 : 1
          }}
        />
      ) : (
        <Sun
          size={20}
          style={{
            color: '#FFD700',
            transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            transform: isAnimating ? 'rotate(180deg) scale(0)' : 'rotate(0) scale(1)',
            opacity: isAnimating ? 0 : 1
          }}
        />
      )}
    </button>
  );
};

export default ThemeSwitcher;
