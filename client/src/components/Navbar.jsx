import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Building2, Heart, Settings, LogOut, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(var(--bg-secondary-rgb), 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }} className="animate-slide-in-down">
      <div style={{
        maxWidth: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 'var(--spacing-md)',
        paddingRight: 'var(--spacing-md)',
        paddingTop: 'var(--spacing-md)',
        paddingBottom: 'var(--spacing-md)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              color: 'var(--primary-main)',
              transition: 'opacity 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Building2 size={30} />
            UD Hotels
          </Link>

          {/* Desktop Menu */}
          <div style={{
            gap: 'var(--spacing-md)',
            alignItems: 'center'
          }} className="hidden md:flex">
            {user ? (
              <>
                <span style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: 'var(--text-secondary)'
                }}>
                  Welcome, <span style={{fontWeight: 'var(--font-bold)', color: 'var(--primary-main)'}}>{user.username}</span>
                </span>

                <div style={{width: '1px', height: '24px', backgroundColor: 'var(--border-light)'}} />

                <Link
                  to="/my-reviews"
                  style={{
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 0.1)';
                    e.currentTarget.style.color = 'var(--primary-main)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                >
                  {t("nav.reviews")}
                </Link>

                <Link
                  to="/favorites"
                  style={{
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 0.1)';
                    e.currentTarget.style.color = 'var(--primary-main)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                >
                  <Heart size={18} style={{fill: 'currentColor'}} /> {t("nav.favorites")}
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      fontWeight: 'var(--font-semibold)',
                      border: '1px solid rgba(0, 173, 181, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 0.2)';
                      e.currentTarget.style.color = 'var(--primary-main)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                  >
                    <Settings size={18} /> {t("nav.admin")}
                  </Link>
                )}

                <div style={{width: '1px', height: '24px', backgroundColor: 'var(--border-light)'}} />

                <LanguageSwitcher />
                <ThemeSwitcher />

                <button
                  onClick={logout}
                  className="btn btn-error"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                >
                  <LogOut size={18} /> {t("common.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-primary"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="btn btn-secondary"
                >
                  {t("nav.register")}
                </Link>
                <LanguageSwitcher />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: 'var(--spacing-xs)',
              transition: 'color 0.2s'
            }}
            className="md:hidden"
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-main)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            display: 'flex',
            marginTop: 'var(--spacing-md)',
            paddingTop: 'var(--spacing-md)',
            borderTop: '1px solid var(--border-light)',
            paddingBottom: 'var(--spacing-md)',
            gap: 'var(--spacing-sm)',
            flexDirection: 'column'
          }} className="md:hidden">
            {user ? (
              <>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  paddingLeft: 'var(--spacing-sm)',
                  paddingRight: 'var(--spacing-sm)',
                  paddingTop: 'var(--spacing-sm)',
                  paddingBottom: 'var(--spacing-sm)'
                }}>
                  Welcome, <span style={{fontWeight: 'var(--font-bold)', color: 'var(--primary-main)'}}>{user.username}</span>
                </div>

                <Link
                  to="/my-reviews"
                  style={{
                    paddingLeft: 'var(--spacing-md)',
                    paddingRight: 'var(--spacing-md)',
                    paddingTop: 'var(--spacing-sm)',
                    paddingBottom: 'var(--spacing-sm)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                  className="hover:bg-ocean-600/30"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.reviews")}
                </Link>

                <Link
                  to="/favorites"
                  style={{
                    paddingLeft: 'var(--spacing-md)',
                    paddingRight: 'var(--spacing-md)',
                    paddingTop: 'var(--spacing-sm)',
                    paddingBottom: 'var(--spacing-sm)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                  className="hover:bg-ocean-600/30"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart size={18} style={{fill: 'currentColor'}} /> {t("nav.favorites")}
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    style={{
                      paddingLeft: 'var(--spacing-md)',
                      paddingRight: 'var(--spacing-md)',
                      paddingTop: 'var(--spacing-sm)',
                      paddingBottom: 'var(--spacing-sm)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--primary-main)',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      border: '1px solid rgba(0, 173, 181, 0.3)'
                    }}
                    className="hover:bg-ocean-600/40"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings size={18} /> {t("nav.admin")}
                  </Link>
                )}

                <div style={{height: '1px', backgroundColor: 'var(--border-light)', marginTop: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)'}} />

                <div style={{paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)'}}>
                  <LanguageSwitcher />
                </div>
                <div style={{paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)'}}>
                  <ThemeSwitcher />
                </div>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-error"
                  style={{
                    width: '100%',
                    margin: 'var(--spacing-sm)',
                    marginLeft: 'var(--spacing-sm)',
                    marginRight: 'var(--spacing-sm)'
                  }}
                >
                  <LogOut size={18} /> {t("common.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    paddingLeft: 'var(--spacing-md)',
                    paddingRight: 'var(--spacing-md)',
                    paddingTop: 'var(--spacing-sm)',
                    paddingBottom: 'var(--spacing-sm)',
                    textAlign: 'center',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                  className="hover:bg-ocean-600/30"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{width: '100%', margin: 'var(--spacing-sm)'}}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.register")}
                </Link>
                <div style={{paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)'}}>
                  <LanguageSwitcher />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
