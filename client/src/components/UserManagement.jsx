import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { adminService } from '../services/api';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editMode, setEditMode] = useState(''); // '' | 'username' | 'password' (โหมดแก้ไข)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  // โหลดรายชื่อผู้ใช้
  const loadUsers = async () => {
    try {
      const response = await API.get('/dashboard/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  // จัดการการแก้ไขข้อมูลผู้ใช้
  const handleEditClick = (user, mode) => {
    setEditingUserId(user.id);
    setEditMode(mode);
    setFormData({
      username: user.username || '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  // ล้างสถานะการแก้ไข
  const handleCancel = () => {
    setEditingUserId(null);
    setEditMode('');
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  // อัปเดตค่าอินพุตของแบบฟอร์ม
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // บันทึกชื่อผู้ใช้ใหม่
  const handleSaveUsername = async (userId) => {
    // ตรวจสอบว่าชื่อผู้ใช้ว่างเปล่าหรือไม่
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    // ตรวจสอบความยาวของชื่อผู้ใช้
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    try {
      // เรียก API เพื่ออัปเดตชื่อผู้ใช้
      await adminService.updateUserUsername(userId, { username: formData.username });
      // แสดงข้อความสำเร็จและโหลดผู้ใช้ใหม่
      setSuccess('Username updated successfully');
      loadUsers();
      handleCancel();
    } catch (err) {
      // จัดการการตอบสนองข้อผิดพลาด
      setError(err.response?.data?.message || 'Failed to update username');
    }
  };

  // บันทึกรหัสผ่านใหม่
  const handleSavePassword = async (userId) => {
    // ตรวจสอบว่ารหัสผ่านว่างเปล่าหรือไม่
    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }

    // ตรวจสอบความยาวของรหัสผ่าน
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // เรียก API เพื่ออัปเดตรหัสผ่าน
      await adminService.updateUserPassword(userId, { password: formData.password });
      // แสดงข้อความสำเร็จและโหลดผู้ใช้ใหม่
      setSuccess('Password updated successfully');
      loadUsers();
      handleCancel();
    } catch (err) {
      // จัดการการตอบสนองข้อผิดพลาด
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-200 animate-pulse">กำลังโหลดผู้ใช้...</div>;
  }

  const user = editingUserId ? users.find(u => u.id === editingUserId) : null;

  return (
    <div className="animate-fade-in">
      {error && (
        <div className="bg-red-500/30 text-red-200 p-3 rounded-lg mb-4 border border-red-500/50 animate-shake">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/30 text-green-200 p-3 rounded-lg mb-4 border border-green-500/50 animate-bounce-in">
          {success}
        </div>
      )}

      {/* โมดัลแก้ไข */}
      {editingUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in mb-8 px-4">
          <div className="glass glass-lg max-w-md w-full card-enter p-4 md:p-6">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-100">
              {editMode === 'username' ? 'แก้ไขชื่อผู้ใช้' : 'แก้ไขรหัสผ่าน'}
            </h3>

            {editMode === 'username' ? (
              <div>
                <label className="block text-gray-200 font-bold mb-2 text-sm">ชื่อผู้ใช้ใหม่</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="ป้อนชื่อผู้ใช้ใหม่"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100 placeholder-gray-400 mb-4 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveUsername(editingUserId)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm"
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500/30 text-gray-200 py-2 rounded-lg font-bold hover:bg-gray-500/40 transition-all duration-300 text-sm"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-gray-200 font-bold mb-2 text-sm">รหัสผ่านใหม่</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="ป้อนรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100 placeholder-gray-400 mb-3 text-sm"
                />
                <label className="block text-gray-200 font-bold mb-2 text-sm">ยืนยันรหัสผ่าน</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="ยืนยันรหัสผ่าน"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100 placeholder-gray-400 mb-4"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSavePassword(editingUserId)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500/30 text-gray-200 py-2 rounded-lg font-bold hover:bg-gray-500/40 transition-all duration-300"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ตารางผู้ใช้ */}
      <div className="glass glass-lg rounded-lg overflow-hidden animate-slide-in-up">
        <div className="p-4 md:p-6 border-b border-white/20">
          <h2 className="text-xl md:text-2xl font-bold text-gray-100">จัดการผู้ใช้</h2>
          <p className="text-gray-400 text-xs md:text-sm mt-1">{users.length} ผู้ใช้ทั้งหมด</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-b border-white/20">
              <tr>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-100">ชื่อผู้ใช้</th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-100 hidden sm:table-cell">ชื่อ</th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-100 hidden md:table-cell">อีเมล</th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-100">บทบาท</th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-100 hidden lg:table-cell">วันเข้าร่วม</th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-100">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/5 transition-colors duration-200 group"
                >
                  <td className="px-2 md:px-4 py-3 text-gray-200 font-medium text-xs md:text-sm">{user.username}</td>
                  <td className="px-2 md:px-4 py-3 text-gray-300 hidden md:table-cell text-xs md:text-sm">{user.email}</td>
                  <td className="px-2 md:px-4 py-3">
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin'
                          ? 'bg-red-500/30 text-red-200 border border-red-400/30'
                          : 'bg-blue-500/30 text-blue-200 border border-blue-400/30'
                      }`}
                    >
                      {user.role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้'}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 md:px-4 py-3">
                    <div className="flex gap-1 md:gap-2 flex-col md:flex-row opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleEditClick(user, 'username')}
                        className="px-2 md:px-3 py-1 rounded bg-blue-500/30 text-blue-200 hover:bg-blue-500/40 transition-all duration-300 text-xs font-bold"
                        title="แก้ไขชื่อผู้ใช้"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleEditClick(user, 'password')}
                        className="px-2 md:px-3 py-1 rounded bg-orange-500/30 text-orange-200 hover:bg-orange-500/40 transition-all duration-300 text-xs font-bold"
                        title="แก้ไขรหัสผ่าน"
                      >
                        รหัส
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-300 text-sm">ไม่พบผู้ใช้</div>
        )}
      </div>
    </div>
  );
};
