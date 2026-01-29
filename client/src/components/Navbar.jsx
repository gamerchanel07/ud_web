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
    <nav className="glass glass-lg fixed w-full top-0 z-50 backdrop-blur-lg animate-slide-in-down">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="
    flex items-center gap-2
    text-2xl font-bold tracking-wide
    drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]
    hover:opacity-90
    transition-all
  "
          >
            <Building2 size={30} className="" />
            UD Hotels
          </Link>

          {/* เมนูเดสก์ท็อป */}
          <div className="hidden md:flex gap-6 items-center">
            {user ? (
              <>
                <span className="text-xs md:text-sm font-medium">
                  Welcome,{" "}
                  <span className="font-bold">
                    {user.username}
                  </span>
                </span>
                <Link
                  to="/my-reviews"
                  className="px-3 py-2 rounded-lg hover:bg-ocean-600/30 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 hover:"
                >
                  {t("nav.reviews")}
                </Link>
                <Link
                  to="/favorites"
                  className="px-3 py-2 rounded-lg hover:bg-ocean-600/30 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 hover flex items-center gap-2"
                >
                  <Heart size={20} className="fill-current" />{" "}
                  {t("nav.favorites")}
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 rounded-lg hover:bg-ocean-600/40 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-semibold glow flex items-center gap-2"
                  >
                    <Settings size={20} /> {t("nav.admin")}
                  </Link>
                )}
                <LanguageSwitcher />
                <ThemeSwitcher />
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-semibold text-white glow flex items-center gap-2"
                >
                  <LogOut size={20} /> {t("common.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-ocean-600 to-blue-600 hover:from-ocean-700 hover:to-blue-700 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-semibold text-white glow"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-ocean-600 to-blue-600 hover:from-ocean-700 hover:to-blue-700 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-semibold text-white glow"
                >
                  {t("nav.register")}
                </Link>
                <LanguageSwitcher />
              </>
            )}
          </div>

          {/* ปุ่มเปิด/ปิดเมนูมือถือ */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-200 hover:text-ocean-200 transition-colors p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* เมนูมือถือ */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20 space-y-3 pb-4 animate-slide-in-down">
            {user ? (
              <>
                <div className="text-xs font-medium text-gray-300 px-2 py-2">
                  Welcome,{" "}
                  <span className="font-bold text-ocean-300">
                    {user.username}
                  </span>
                </div>
                <Link
                  to="/my-reviews"
                  className="px-4 py-2 rounded-lg hover:bg-ocean-600/30 transition-all duration-200 text-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.reviews")}
                </Link>
                <Link
                  to="/favorites"
                  className="px-4 py-2 rounded-lg hover:bg-ocean-600/30 transition-all duration-200 text-gray-100 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart size={20} /> {t("nav.favorites")}
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 rounded-lg hover:bg-ocean-600/40 transition-all duration-200 font-semibold text-ocean-200 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings size={20} /> {t("nav.admin")}
                  </Link>
                )}
                <div className="px-4 py-2">
                  <LanguageSwitcher />
                </div>
                <div className="px-4 py-2">
                  <ThemeSwitcher />
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-white"
                >
                  {t("common.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="all duration-200 text-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="block text-center bg-gradient-to-r from-ocean-600 to-blue-600 hover:from-ocean-700 hover:to-blue-700 px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.register")}
                </Link>
                <div className="px-4 py-2">
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
