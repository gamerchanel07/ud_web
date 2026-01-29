import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass glass-lg mt-12 py-12 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4">
        {/* ส่วนบน */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* แบรนด์ */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 hover:scale-110 transition-transform">
              <Building2 size={32} className="text-ocean-300" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-ocean-300 to-blue-300 bg-clip-text text-transparent">
                UD Hotels
              </h3>
            </Link>
            <p className="text-gray-400 text-sm">
              ค้นหาที่พักในอุดรธานีได้ง่าย ๆ กับเรา!
            </p>
          </div>

          {/* ลิงก์ที่ดวงเร็ว */}
          <div>
            <h4 className="font-bold text-ocean-300 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-ocean-300 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-ocean-300 transition-colors text-sm">
                  My Favorites
                </Link>
              </li>
              <li>
                <Link to="/my-reviews" className="text-gray-400 hover:text-ocean-300 transition-colors text-sm">
                  My Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* ข้อมูลติดต่อ */}
          <div>
            <h4 className="font-bold text-ocean-300 mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={16} className="text-ocean-300" />
                Udon Thani, Thailand
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={16} className="text-ocean-300" />
                +66 063 313 2456
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={16} className="text-ocean-300" />
                67319010021@udontech.ac.th
              </li>
            </ul>
          </div>

          {/* ลิงก์สอื่อเรา */}
          <div>
            <h4 className="font-bold text-ocean-300 mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-ocean-300 transition-colors p-2 bg-white/10 rounded-lg hover:bg-ocean-600/20"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-ocean-300 transition-colors p-2 bg-white/10 rounded-lg hover:bg-ocean-600/20"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* เส้นแบ่ง */}
        <div className="border-t border-white/10 py-6"></div>

        {/* ส่วนล่าง */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-400 text-sm">
            © {currentYear} UD Hotels. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/" className="text-gray-400 hover:text-ocean-300 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/" className="text-gray-400 hover:text-ocean-300 transition-colors text-sm">
              Terms of Service
            </Link>
            <Link to="/" className="text-gray-400 hover:text-ocean-300 transition-colors text-sm">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
