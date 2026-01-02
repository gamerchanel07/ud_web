import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Megaphone, AlertCircle, CheckCircle, XCircle, X, ArrowLeft, ArrowRight, EyeOff } from 'lucide-react';

export const AnnouncementPopup = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      // Check if announcements are hidden for today
      const lastHideDate = localStorage.getItem('announcementHideDate');
      const today = new Date().toDateString();
      
      if (lastHideDate === today) {
        return; // Don't show if hidden today
      }

      const response = await API.get('/announcements');
      if (response.data && response.data.length > 0) {
        setAnnouncements(response.data);
        setShowPopup(true);
      }
    } catch (err) {
      console.error('Failed to load announcements', err);
    }
  };

  if (!showPopup || announcements.length === 0) {
    return null;
  }

  const current = announcements[currentIndex];
  
  const typeColors = {
    info: 'from-blue-500 to-cyan-500',
    warning: 'from-yellow-500 to-orange-500',
    success: 'from-green-500 to-emerald-500',
    error: 'from-red-500 to-pink-500'
  };

  const typeIcons = {
    info: <Megaphone size={40} />,
    warning: <AlertCircle size={40} />,
    success: <CheckCircle size={40} />,
    error: <XCircle size={40} />
  };

  const handleNext = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowPopup(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleDontShowToday = () => {
    const today = new Date().toDateString();
    localStorage.setItem('announcementHideDate', today);
    setShowPopup(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] animate-fade-in">
      <div className="glass glass-lg max-w-2xl w-full mx-4 card-enter relative overflow-hidden">
        {/* Header with type color gradient */}
        <div className={`bg-gradient-to-r ${typeColors[current.type]} p-6 text-white`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {typeIcons[current.type]}
              <h2 className="text-3xl font-bold">{current.title}</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:scale-110 transition-transform hover:text-gray-200"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-gray-200 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
            {current.content}
          </p>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
            <div className="flex gap-2">
              {announcements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400 w-8' 
                      : 'bg-white/30 w-2 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3 flex-col md:flex-row w-full md:w-auto">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-lg bg-white/20 text-gray-200 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift text-sm md:text-base flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover-lift glow text-sm md:text-base flex items-center justify-center gap-2"
              >
                {currentIndex === announcements.length - 1 ? 'Close' : <>Next <ArrowRight size={18} /></>}
              </button>
            </div>
          </div>

          {/* Counter */}
          <div className="text-center mt-4 text-gray-400 text-sm">
            {currentIndex + 1} / {announcements.length}
          </div>

          {/* Don't show again today button */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <button
              onClick={handleDontShowToday}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-all duration-300 text-sm md:text-base flex items-center justify-center gap-2"
            >
              <EyeOff size={18} /> ไม่แสดงประกาศในวันนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
