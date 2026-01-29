import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { activityLogService } from '../services/api';
import { User, Edit2, Trash2, Lock, Crown, Building2, Star, Megaphone, Unlock, BarChart3, TrendingUp, Search, ClipboardList, Download, FileText } from 'lucide-react';

// ประเภทกิจกรรมและสีของมัน
const activityTypeConfig = {
  user_created: { label: 'สร้างผู้ใช้', icon: User, color: 'from-blue-500 to-cyan-500' },
  user_updated: { label: 'อัปเดตผู้ใช้', icon: Edit2, color: 'from-blue-400 to-blue-600' },
  user_deleted: { label: 'ลบผู้ใช้', icon: Trash2, color: 'from-red-500 to-pink-500' },
  password_changed: { label: 'เปลี่ยนรหัสผ่าน', icon: Lock, color: 'from-yellow-500 to-orange-500' },
  role_changed: { label: 'เปลี่ยนบทบาท', icon: Crown, color: 'from-purple-500 to-pink-500' },
  hotel_created: { label: 'สร้างโรงแรม', icon: Building2, color: 'from-green-500 to-emerald-500' },
  hotel_updated: { label: 'อัปเดตโรงแรม', icon: Building2, color: 'from-green-400 to-green-600' },
  hotel_deleted: { label: 'ลบโรงแรม', icon: Trash2, color: 'from-red-400 to-red-600' },
  review_created: { label: 'สร้างรีวิว', icon: Star, color: 'from-yellow-400 to-yellow-600' },
  review_deleted: { label: 'ลบรีวิว', icon: Trash2, color: 'from-orange-400 to-orange-600' },
  announcement_created: { label: 'สร้างประกาศ', icon: Megaphone, color: 'from-indigo-500 to-blue-500' },
  announcement_updated: { label: 'อัปเดตประกาศ', icon: Edit2, color: 'from-indigo-400 to-blue-400' },
  announcement_deleted: { label: 'ลบประกาศ', icon: Trash2, color: 'from-indigo-600 to-blue-600' },
  login: { label: 'เข้าสู่ระบบ', icon: Unlock, color: 'from-teal-500 to-cyan-500' },
  logout: { label: 'ออกจากระบบ', icon: Lock, color: 'from-slate-500 to-gray-500' }
};

export const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAction, setFilterAction] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadActivityLogs();
    loadStats();
  }, [page, filterAction]);

  // โหลดบันทึกกิจกรรม
  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      const response = filterAction
        ? await activityLogService.getByAction(filterAction, page, 15)
        : await activityLogService.getAll(page, 15);
      setLogs(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      console.error('ไม่สามารถโหลดบันทึกกิจกรรม', err);
    } finally {
      setLoading(false);
    }
  };

  // โหลดสถิติ
  const loadStats = async () => {
    try {
      const response = await activityLogService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('ไม่สามารถโหลดสถิติ', err);
    }
  };

  // ฟังก์ชันแปลงเวลา
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ดาวน์โหลด CSV
  const handleDownloadCSV = () => {
    const headers = ['ประเภท', 'คำอธิบาย', 'ผู้ใช้', 'เวลา', 'IP Address'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        getActionConfig(log.action).label,
        `"${log.description}"`,
        log.user ? log.user.username : 'ระบบ',
        new Date(log.createdAt).toLocaleString('th-TH'),
        log.ipAddress || '-'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  // ล้างบันทึกเก่า (90 วัน)
  const handleClearOldLogs = async () => {
    if (confirm('ลบบันทึกกิจกรรมที่เก่ากว่า 90 วัน หรือไม่?')) {
      try {
        await activityLogService.deleteOldLogs();
        alert('ลบบันทึกกิจกรรมเก่าเรียบร้อย');
        loadActivityLogs();
      } catch (err) {
        alert('ไม่สามารถลบบันทึกกิจกรรม');
      }
    }
  };

  const getActionConfig = (action) => activityTypeConfig[action] || { label: action, color: 'from-gray-500 to-gray-700' };

  return (
    <div className="animate-fade-in space-y-6">
      {/* สถิติ */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass glass-lg p-6 card-enter rounded-lg border border-white/10">
            <div className=" text-sm font-bold mb-2 flex items-center gap-2"><BarChart3 size={16} /> รวมทั้งหมด</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {stats.total}
            </div>
            <div className=" text-xs mt-2">บันทึกกิจกรรม</div>
          </div>
          <div className="glass glass-lg p-6 card-enter rounded-lg border border-white/10">
            <div className=" text-sm font-bold mb-2 flex items-center gap-2"><TrendingUp size={16} /> 7 วันที่ผ่านมา</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {stats.recent7Days}
            </div>
            <div className="text-gray-500 text-xs mt-2">กิจกรรมในสัปดาห์นี้</div>
          </div>
          <div className="glass glass-lg p-6 card-enter rounded-lg border border-white/10">
            <div className="text-sm font-bold mb-2 flex items-center gap-2"><FileText size={16} /> ประเภท</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {stats.byType?.length || 0}
            </div>
            <div className="text-gray-500 text-xs mt-2">ประเภทของกิจกรรม</div>
          </div>
        </div>
      )}

      {/* ตัวกรองและปุ่มการดำเนินการ */}
      <div className="glass glass-lg p-6 rounded-lg border border-white/10 space-y-4">
        <div>
          <label className="block font-bold mb-3 flex items-center gap-2"><Search size={16} /> กรองตามประเภท</label>
          <select
            value={filterAction}
            onChange={(e) => {
              setFilterAction(e.target.value);
              setPage(1);
            }}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 placeholder-gray-400"
          >
            <option value="">ทั้งหมด</option>
            {Object.entries(activityTypeConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* ปุ่มการดำเนินการ */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2"
          >
            <Download size={16} /> ดาวน์โหลด CSV
          </button>
          <button
            onClick={handleClearOldLogs}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-bold hover:from-red-600 hover:to-orange-600 transition-all duration-300 flex items-center gap-2"
          >
            <Trash2 size={16} /> ล้างบันทึกเก่า
          </button>
        </div>
      </div>

      {/* รายชื่อบันทึกกิจกรรม */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold px-2 flex items-center gap-2"><ClipboardList size={20} /> บันทึกกิจกรรมล่าสุด</h3>
        {logs.length === 0 ? (
          <div className="text-center py-12">ไม่มีบันทึกกิจกรรม</div>
        ) : (
          logs.map((log, index) => {
            const config = getActionConfig(log.action);
            return (
              <div
                key={log.id}
                className="glass glass-lg p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 card-enter"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${config.color} flex items-center gap-2`}>
                        {config.icon && React.createElement(config.icon, { size: 14 })}
                        {config.label}
                      </span>
                      <span className=" text-sm">{formatDateTime(log.createdAt)}</span>
                    </div>
                    <p className=" mb-2">{log.description}</p>
                    {log.user && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="">โดย:</span>
                        <span className=" font-semibold">
                          {log.user.username}
                        </span>
                      </div>
                    )}
                    {log.ipAddress && (
                      <div className="text-xs mt-1">IP: {log.ipAddress}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* หน้า */}
      {totalPages > 1 && (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--spacing-sm)', paddingTop: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-lg)'}}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              paddingLeft: 'var(--spacing-md)',
              paddingRight: 'var(--spacing-md)',
              paddingTop: 'var(--spacing-sm)',
              paddingBottom: 'var(--spacing-sm)',
              backgroundColor: page === 1 ? 'rgba(0, 173, 181, 0.1)' : 'var(--primary-main)',
              color: page === 1 ? 'var(--text-tertiary)' : 'white',
              borderRadius: 'var(--radius-md)',
              fontWeight: 'var(--font-bold)',
              border: 'none',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: page === 1 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (page !== 1) {
                e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 173, 181, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = page === 1 ? 'rgba(0, 173, 181, 0.1)' : 'var(--primary-main)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ← ก่อนหน้า
          </button>
          <div style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)'}}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  paddingLeft: 'var(--spacing-md)',
                  paddingRight: 'var(--spacing-md)',
                  paddingTop: 'var(--spacing-xs)',
                  paddingBottom: 'var(--spacing-xs)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 'var(--font-bold)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: page === p ? 'linear-gradient(135deg, var(--primary-main) 0%, #00CED1 100%)' : 'var(--bg-secondary)',
                  color: page === p ? 'white' : 'var(--text-secondary)',
                  boxShadow: page === p ? '0 4px 12px rgba(0, 173, 181, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (page !== p) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--primary-main)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = page === p ? 'linear-gradient(135deg, var(--primary-main) 0%, #00CED1 100%)' : 'var(--bg-secondary)';
                  e.currentTarget.style.color = page === p ? 'white' : 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{
              paddingLeft: 'var(--spacing-md)',
              paddingRight: 'var(--spacing-md)',
              paddingTop: 'var(--spacing-sm)',
              paddingBottom: 'var(--spacing-sm)',
              backgroundColor: page === totalPages ? 'rgba(0, 173, 181, 0.1)' : 'var(--primary-main)',
              color: page === totalPages ? 'var(--text-tertiary)' : 'white',
              borderRadius: 'var(--radius-md)',
              fontWeight: 'var(--font-bold)',
              border: 'none',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: page === totalPages ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (page !== totalPages) {
                e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 173, 181, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = page === totalPages ? 'rgba(0, 173, 181, 0.1)' : 'var(--primary-main)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ถัดไป →
          </button>
        </div>
      )}
    </div>
  );
};
