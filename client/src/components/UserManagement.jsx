import React, { useState, useEffect } from "react";
import API from "../services/api";
import { adminService } from "../services/api";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowUserModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // โหลดรายชื่อผู้ใช้
  const loadUsers = async () => {
    try {
      const response = await API.get("/dashboard/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users");
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  // จัดการการสร้างผู้ใช้ใหม่
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUser(newUser);
      setSuccess("เพิ่มผู้ใช้เรียบร้อยแล้ว");
      setShowAddForm(false);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Create user failed");
    }
  };

  // จัดการการแก้ไขข้อมูลผู้ใช้
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
    });
  };

  // ล้างสถานะการแก้ไข
  const handleCancel = () => {
    setEditingUserId(null);
    setEditMode("");
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
  };

  // อัปเดตค่าอินพุตของแบบฟอร์ม
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveUser = async () => {
    try {
      if (formData.password && formData.password !== formData.confirmPassword) {
        setError("Password not match");
        return;
      }

      if (editingUser) {
        await adminService.updateUser(editingUser.id, formData);
      } else {
        await adminService.createUser(formData);
      }

      setShowUserModal(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?")) return;

    try {
      await adminService.deleteUser(userId);
      setSuccess("ลบผู้ใช้เรียบร้อยแล้ว");
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-200 animate-pulse">
        กำลังโหลดผู้ใช้...
      </div>
    );
  }

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

      {/* โมดัลแก้ไขผู้ใช้ */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          {/* Background */}
          <div
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-all"
            onClick={() => setShowUserModal(false)}
          />

          {/* Modal */}
          <div className="relative z-10 bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl dark:shadow-2xl animate-scale-in border border-gray-200 dark:border-gray-800">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 dark:from-gray-800 to-blue-100 dark:to-gray-900 px-6 py-5 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingUser ? "✏️ แก้ไขผู้ใช้" : "➕ เพิ่มผู้ใช้ใหม่"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {editingUser ? "อัปเดตข้อมูลผู้ใช้" : "สร้างบัญชีผู้ใช้ใหม่"}
              </p>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  👤 ชื่อผู้ใช้
                </label>
                <input
                  placeholder="กรุณากรอกชื่อผู้ใช้"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📧 อีเมล
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🔒 รหัสผ่าน
                </label>
                <input
                  type="password"
                  placeholder={editingUser ? "(ปล่อยว่างเพื่อไม่เปลี่ยน)" : "กรุณากรอกรหัสผ่าน"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🔑 ยืนยันรหัสผ่าน
                </label>
                <input
                  type="password"
                  placeholder="กรุณายืนยันรหัสผ่าน"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  👑 บทบาท
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                >
                  <option value="user">👤 ผู้ใช้ทั่วไป</option>
                  <option value="admin">👨‍💼 ผู้ดูแลระบบ</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
              <button
                onClick={handleSaveUser}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-700 dark:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white py-2.5 rounded-lg font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
              >
                ✅ {editingUser ? "อัปเดต" : "สร้าง"}
              </button>

              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2.5 rounded-lg font-bold text-sm transition-all duration-200"
              >
                ✕ ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ตารางผู้ใช้ */}
      <div className="glass glass-lg rounded-lg overflow-hidden animate-slide-in-up">
        <div className="p-4 md:p-6 border-b border-white/20">
          <h2 className="text-xl md:text-2xl font-bold text-gray-100">
            จัดการผู้ใช้
          </h2>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            {users.length} ผู้ใช้ทั้งหมด
          </p>
          {/* ปุ่มเพิ่มลุกจาเลว */}
          <button
            onClick={() => {
              setEditingUser(null);
              setFormData({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "user",
              });
              setShowUserModal(true);
            }}
          >
            ➕ เพิ่มผู้ใช้
          </button>

          {/* ฟอร์มเพิ่มลุกจาเลว */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-gradient-to-r from-ocean-600/30 to-blue-600/30 border-b border-white/20">
              <tr>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-100">
                  ชื่อผู้ใช้
                </th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-100 hidden md:table-cell">
                  อีเมล
                </th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-100">
                  บทบาท
                </th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-100 hidden lg:table-cell">
                  วันเข้าร่วม
                </th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-100">
                  แก้ไขผู้ใช้
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/5 transition-colors duration-200 group"
                >
                  <td className="px-2 md:px-4 py-3 text-gray-200 font-medium text-xs md:text-sm">
                    {user.username}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-gray-300 hidden md:table-cell text-xs md:text-sm">
                    {user.email}
                  </td>
                  <td className="px-2 md:px-4 py-3">
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === "admin"
                          ? "bg-red-500/30 text-red-200 border border-red-400/30"
                          : "bg-blue-500/30 text-blue-200 border border-blue-400/30"
                      }`}
                    >
                      {user.role === "admin" ? "ผู้ดูแล" : "ผู้ใช้"}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 md:px-4 py-3">
                    <div className="flex gap-1 md:gap-2 flex-col md:flex-row opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setFormData({
                            username: user.username,
                            email: user.email,
                            password: "",
                            confirmPassword: "",
                            role: user.role,
                          });
                          setShowUserModal(true);
                        }}
                        className="px-2 md:px-3 py-1 rounded bg-blue-500/30 text-blue-200 hover:bg-blue-500/40 transition-all duration-300 text-xs font-bold"
                        title="แก้ไขชื่อผู้ใช้"
                      >
                        แก้ไข
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-300 text-sm">
            ไม่พบผู้ใช้
          </div>
        )}
      </div>
    </div>
  );
};
