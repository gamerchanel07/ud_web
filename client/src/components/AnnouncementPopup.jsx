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
      // ตรวจสอบว่าปิดค่องประกาศว่ามิไดนว่าคนู็ได้หรือไม
      const lastHideDate = localStorage.getItem('announcementHideDate');
      const today = new Date().toDateString();
      
      if (lastHideDate === today) {
        return; // ห้ามิดว่าคนูแล้วว่ินคนี้
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
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }} className="animate-fade-in">
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '0.5rem',
        maxWidth: '42rem',
        width: '100%',
        margin: '1rem',
        border: '2px solid var(--primary-main)',
        overflow: 'hidden'
      }} className="card-enter">
        {/* หัว */}
        <div style={{
          background: `linear-gradient(135deg, var(--primary-main), rgba(0, 173, 181, 0.8))`,
          padding: '1.5rem',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              {typeIcons[current.type]}
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold'
              }}>{current.title}</h2>
            </div>
            <button
              onClick={handleClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* เนื้อหา */}
        <div style={{
          padding: '2rem'
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.125rem',
            lineHeight: '1.625',
            marginBottom: '1.5rem',
            whiteSpace: 'pre-wrap'
          }}>
            {current.content}
          </p>

          {/* การนำทาง */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
              {announcements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    height: '0.5rem',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    backgroundColor: idx === currentIndex 
                      ? 'var(--primary-main)' 
                      : 'rgba(255, 255, 255, 0.3)',
                    width: idx === currentIndex ? '2rem' : '0.5rem'
                  }}
                  onMouseEnter={(e) => !currentIndex && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)')}
                  onMouseLeave={(e) => !currentIndex && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')}
                />
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-light)',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: currentIndex === 0 ? 0.5 : 1
                }}
                onMouseEnter={(e) => !currentIndex && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')}
                onMouseLeave={(e) => !currentIndex && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
              >
                <ArrowLeft size={18} /> ก่อนหน้า
              </button>
              <button
                onClick={handleNext}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  backgroundColor: 'var(--primary-main)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {currentIndex === announcements.length - 1 ? 'ปิด' : <>ต่อไป <ArrowRight size={18} /></>}
              </button>
            </div>
          </div>

          {/* ตัวนับ */}
          <div style={{
            textAlign: 'center',
            marginTop: '1rem',
            color: 'var(--text-tertiary)',
            fontSize: '0.875rem'
          }}>
            {currentIndex + 1} / {announcements.length}
          </div>

          {/* ปุ่มไม่แสดงในวันนี้ */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-light)'
          }}>
            <button
              onClick={handleDontShowToday}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: 'rgba(0, 173, 181, 0.1)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--primary-main)',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 0.1)'}
            >
              <EyeOff size={18} /> ไม่แสดงประกาศในวันนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
