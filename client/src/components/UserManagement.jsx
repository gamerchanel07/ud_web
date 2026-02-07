import React, { useState, useEffect } from "react";
import API from "../services/api";
import { adminService } from "../services/api";
import { User, Mail, Lock, Key, Shield, Plus, Save, X, Edit2, Trash2 } from "lucide-react";

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
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#FCA5A5',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          animation: 'shake 0.5s ease'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          color: '#86EFAC',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          animation: 'bounce-in 0.5s ease'
        }}>
          {success}
        </div>
      )}

      {/* โมดัลแก้ไขผู้ใช้ */}
      {showUserModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          paddingTop: '2rem'
        }}>
          {/* Background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s'
            }}
            onClick={() => setShowUserModal(false)}
          />

          {/* Modal */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            backgroundColor: 'var(--bg-secondary)',
            width: '100%',
            maxWidth: '28rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            animation: 'scale-in 0.3s ease',
            border: '1px solid rgba(0, 173, 181, 0.2)',
            overflow: 'hidden'
          }}>
            
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-main), rgba(0, 173, 181, 0.8))',
              padding: '1.5rem',
              borderBottom: '1px solid rgba(0, 173, 181, 0.2)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {editingUser ? (
                  <>
                    <Edit2 size={24} /> แก้ไขผู้ใช้
                  </>
                ) : (
                  <>
                    <Plus size={24} /> เพิ่มผู้ใช้ใหม่
                  </>
                )}
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.875rem',
                marginTop: '0.25rem'
              }}>
                {editingUser ? "อัปเดตข้อมูลผู้ใช้" : "สร้างบัญชีผู้ใช้ใหม่"}
              </p>
            </div>

            {/* Form Content */}
            <div style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Username */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <User size={16} style={{color: 'var(--primary-main)'}} />
                  ชื่อผู้ใช้
                </label>
                <input
                  name="username"
                  placeholder="กรุณากรอกชื่อผู้ใช้"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={editingUser ? true : false}
                  style={{
                    width: '100%',
                    backgroundColor: editingUser ? 'rgba(0, 173, 181, 0.05)' : 'var(--bg-primary)',
                    border: '1px solid rgba(0, 173, 181, 0.3)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    color: editingUser ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.3s',
                    cursor: editingUser ? 'not-allowed' : 'text',
                    opacity: editingUser ? 0.6 : 1
                  }}
                  onFocus={(e) => !editingUser && (e.target.style.borderColor = 'var(--primary-main)')}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Mail size={16} style={{color: 'var(--primary-main)'}} />
                  อีเมล
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid rgba(0, 173, 181, 0.3)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Lock size={16} style={{color: 'var(--primary-main)'}} />
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  placeholder={editingUser ? "(ปล่อยว่างเพื่อไม่เปลี่ยน)" : "กรุณากรอกรหัสผ่าน"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid rgba(0, 173, 181, 0.3)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Key size={16} style={{color: 'var(--primary-main)'}} />
                  ยืนยันรหัสผ่าน
                </label>
                <input
                  type="password"
                  placeholder="กรุณายืนยันรหัสผ่าน"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid rgba(0, 173, 181, 0.3)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
                />
              </div>

              {/* Role */}
              <div>
                <label style={{
                  display: 'flex',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Shield size={16} style={{color: 'var(--primary-main)'}} />
                  บทบาท
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid rgba(0, 173, 181, 0.3)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.3s',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
                >
                  <option value="user">ผู้ใช้ทั่วไป</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid rgba(0, 173, 181, 0.2)',
              display: 'flex',
              gap: '0.75rem',
              backgroundColor: 'rgba(0, 173, 181, 0.05)',
              borderBottomLeftRadius: '1rem',
              borderBottomRightRadius: '1rem'
            }}>
              <button
                onClick={handleSaveUser}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, var(--primary-main), rgba(0, 173, 181, 0.8))',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0, 173, 181, 0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Save size={18} />
                {editingUser ? "อัปเดต" : "สร้าง"}
              </button>

              <button
                onClick={() => setShowUserModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--text-tertiary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <X size={18} />
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ตารางผู้ใช้ */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid rgba(0, 173, 181, 0.2)',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        animation: 'slide-in-up 0.5s ease'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(0, 173, 181, 0.2)'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Shield size={24} style={{color: 'var(--primary-main)'}} />
            จัดการผู้ใช้
          </h2>
          <p style={{
            color: 'var(--text-tertiary)',
            fontSize: '0.875rem',
            marginTop: '0.25rem'
          }}>
            {users.length} ผู้ใช้ทั้งหมด
          </p>
          {/* ปุ่มเพิ่มผู้ใช้ */}
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
            style={{
              marginTop: '1rem',
              backgroundColor: 'var(--primary-main)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={18} />
            เพิ่มผู้ใช้
          </button>
        </div>

        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', fontSize: '0.875rem'}}>
            <thead style={{
              backgroundImage: 'linear-gradient(135deg, rgba(0, 173, 181, 0.15), rgba(0, 137, 123, 0.15))',
              borderBottom: '2px solid var(--primary-main)'
            }}>
              <tr>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)'
                }}>
                  ชื่อผู้ใช้
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  display: 'none'
                }} className="md:table-cell">
                  อีเมล
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)'
                }}>
                  บทบาท
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  display: 'none'
                }} className="lg:table-cell">
                  วันเข้าร่วม
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)'
                }}>
                  แก้ไข
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)'
                }}>
                  ลบ
                </th>
              </tr>
            </thead>
            <tbody style={{
              borderTop: '1px solid rgba(0, 173, 181, 0.1)'
            }}>
              {users.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: '1px solid rgba(0, 173, 181, 0.1)',
                    transition: 'background-color 0.3s',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{
                    padding: '1rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500'
                  }}>
                    {user.username}
                  </td>
                  <td style={{
                    padding: '1rem',
                    color: 'var(--text-secondary)',
                    display: 'none'
                  }} className="md:table-cell">
                    {user.email}
                  </td>
                  <td style={{
                    padding: '1rem'
                  }}>
                    <span
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: user.role === "admin" ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 173, 181, 0.1)',
                        color: user.role === "admin" ? '#FCA5A5' : 'var(--primary-main)',
                        border: `1px solid ${user.role === "admin" ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 173, 181, 0.3)'}`
                      }}
                    >
                      {user.role === "admin" ? "ผู้ดูแล" : "ผู้ใช้"}
                    </span>
                  </td>
                  <td style={{
                    padding: '1rem',
                    color: 'var(--text-tertiary)',
                    fontSize: '0.75rem',
                    display: 'none'
                  }} className="lg:table-cell">
                    {new Date(user.createdAt).toLocaleDateString('th-TH')}
                  </td>
                  <td style={{
                    padding: '1rem'
                  }}>
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
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem',
                        backgroundColor: 'rgba(0, 173, 181, 0.15)',
                        color: 'var(--primary-main)',
                        border: '1px solid var(--primary-main)',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 0.25)';
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 0.15)';
                        e.currentTarget.style.opacity = '1';
                      }}
                      title="แก้ไขผู้ใช้"
                    >
                      <Edit2 size={14} />
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        color: '#FCA5A5',
                        border: '1px solid #FCA5A5',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        marginLeft: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                      }}
                      title="ลบผู้ใช้"
                    >
                      <Trash2 size={14} />
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-tertiary)',
            fontSize: '0.875rem'
          }}>
            ไม่พบผู้ใช้
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
