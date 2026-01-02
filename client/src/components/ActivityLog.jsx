import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { activityLogService } from '../services/api';

// ประเภทกิจกรรมและสีของมัน
const activityTypeConfig = {
  user_created: { label: '👤 สร้างผู้ใช้', color: 'from-blue-500 to-cyan-500' },
  user_updated: { label: '✏️ อัปเดตผู้ใช้', color: 'from-blue-400 to-blue-600' },
  user_deleted: { label: '🗑️ ลบผู้ใช้', color: 'from-red-500 to-pink-500' },
  password_changed: { label: '🔐 เปลี่ยนรหัสผ่าน', color: 'from-yellow-500 to-orange-500' },
  role_changed: { label: '👑 เปลี่ยนบทบาท', color: 'from-purple-500 to-pink-500' },
  hotel_created: { label: '🏨 สร้างโรงแรม', color: 'from-green-500 to-emerald-500' },
  hotel_updated: { label: '🏨 อัปเดตโรงแรม', color: 'from-green-400 to-green-600' },
  hotel_deleted: { label: '🏨 ลบโรงแรม', color: 'from-red-400 to-red-600' },
  review_created: { label: '⭐ สร้างรีวิว', color: 'from-yellow-400 to-yellow-600' },
  review_deleted: { label: '⭐ ลบรีวิว', color: 'from-orange-400 to-orange-600' },
  announcement_created: { label: '📢 สร้างประกาศ', color: 'from-indigo-500 to-blue-500' },
  announcement_updated: { label: '📢 อัปเดตประกาศ', color: 'from-indigo-400 to-blue-400' },
  announcement_deleted: { label: '📢 ลบประกาศ', color: 'from-indigo-600 to-blue-600' },
  login: { label: '🔓 เข้าสู่ระบบ', color: 'from-teal-500 to-cyan-500' },
  logout: { label: '🔒 ออกจากระบบ', color: 'from-slate-500 to-gray-500' }
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
            <div className="text-gray-400 text-sm font-bold mb-2">📊 รวมทั้งหมด</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {stats.total}
            </div>
            <div className="text-gray-500 text-xs mt-2">บันทึกกิจกรรม</div>
          </div>
          <div className="glass glass-lg p-6 card-enter rounded-lg border border-white/10">
            <div className="text-gray-400 text-sm font-bold mb-2">📈 7 วันที่ผ่านมา</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {stats.recent7Days}
            </div>
            <div className="text-gray-500 text-xs mt-2">กิจกรรมในสัปดาห์นี้</div>
          </div>
          <div className="glass glass-lg p-6 card-enter rounded-lg border border-white/10">
            <div className="text-gray-400 text-sm font-bold mb-2">🏷️ ประเภท</div>
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
          <label className="block text-gray-200 font-bold mb-3">🔍 กรองตามประเภท</label>
          <select
            value={filterAction}
            onChange={(e) => {
              setFilterAction(e.target.value);
              setPage(1);
            }}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100 placeholder-gray-400"
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
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
          >
            📥 ดาวน์โหลด CSV
          </button>
          <button
            onClick={handleClearOldLogs}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-bold hover:from-red-600 hover:to-orange-600 transition-all duration-300"
          >
            🗑️ ล้างบันทึกเก่า
          </button>
        </div>
      </div>

      {/* รายชื่อบันทึกกิจกรรม */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-100 px-2">📋 บันทึกกิจกรรมล่าสุด</h3>
        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-300">ไม่มีบันทึกกิจกรรม</div>
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
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-gray-400 text-sm">{formatDateTime(log.createdAt)}</span>
                    </div>
                    <p className="text-gray-200 mb-2">{log.description}</p>
                    {log.user && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="text-gray-500">โดย:</span>
                        <span className="text-gray-300 font-semibold">
                          {log.user.username}
                        </span>
                      </div>
                    )}
                    {log.ipAddress && (
                      <div className="text-xs text-gray-500 mt-1">IP: {log.ipAddress}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-purple-500/30 text-purple-200 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500/40 transition-all duration-300"
          >
            ← ก่อนหน้า
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-2 rounded-lg font-bold transition-all duration-300 ${
                  page === p
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-purple-500/30 text-purple-200 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500/40 transition-all duration-300"
          >
            ถัดไป →
          </button>
        </div>
      )}
    </div>
  );
};
