import React, { useState, useEffect } from "react";
import { announcementService } from "../services/api";
import { CheckCircle, X, FileText, File, Clock, Timer, Zap, Trash2, AlertCircle, Edit2, Clock3, Flag, Megaphone, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await announcementService.getAll();
      setAnnouncements(response.data);
    } catch (err) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await announcementService.update(editingId, formData);
      } else {
        await announcementService.create(formData);
      }
      loadAnnouncements();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        type: "info",
        startDate: new Date().toISOString().slice(0, 16),
        endDate: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save announcement");
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      startDate: announcement.startDate.slice(0, 16),
      endDate: announcement.endDate ? announcement.endDate.split("T")[0] : "",
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      try {
        await announcementService.delete(id);
        loadAnnouncements();
      } catch (err) {
        setError("Failed to delete announcement");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: "",
      content: "",
      type: "info",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: "",
    });
  };

  const typeColors = {
    info: "from-blue-500 to-cyan-500",
    warning: "from-yellow-500 to-orange-500",
    success: "from-green-500 to-emerald-500",
    error: "from-red-500 to-pink-500",
  };

  const typeIcons = {
    info: Megaphone,
    warning: AlertTriangle,
    success: CheckCircle2,
    error: XCircle,
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 animate-slide-in-down">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white px-6 md:px-8 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 text-sm md:text-base"
        >
          {showForm ? (
            <>
              <X size={20} />
              <span>ยกเลิก</span>
            </>
          ) : (
            <>
              <AlertCircle size={20} />
              <span>เพิ่มประกาศใหม่</span>
            </>
          )}
        </button>
      </div>

      {/* ฟอร์มสร้าง/แก้ไขประกาศ */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-2xl mb-8 card-enter shadow-xl dark:shadow-2xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
            {editingId ? (
              <>
                <FileText size={28} className="text-blue-600 dark:text-blue-400" />
                แก้ไขประกาศ
              </>
            ) : (
              <>
                <AlertCircle size={28} className="text-blue-600 dark:text-blue-400" />
                สร้างประกาศใหม่
              </>
            )}
          </h3>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 border border-red-200 dark:border-red-800/50">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Title Input */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2 flex items-center gap-2">
                <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                ชื่อเรื่อง
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="กรุณากรอกชื่อประกาศ"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                required
              />
            </div>

            {/* Type Select */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2 flex items-center gap-2">
                <File size={18} className="text-blue-600 dark:text-blue-400" />
                ประเภท
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
              >
                <option value="info">ข้อมูล</option>
                <option value="warning">คำเตือน</option>
                <option value="success">สำเร็จ</option>
                <option value="error">ข้อผิดพลาด</option>
              </select>
            </div>
          </div>

          {/* Content Textarea */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2 flex items-center gap-2">
              <File size={18} className="text-blue-600 dark:text-blue-400" />
              เนื้อหา
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="กรุณากรอกเนื้อหาประกาศ"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              rows="5"
              required
            />
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2 flex items-center gap-2">
                <Clock size={18} className="text-blue-600 dark:text-blue-400" />
                วันที่เริ่มต้น
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2 flex items-center gap-2">
                <Timer size={18} className="text-blue-600 dark:text-blue-400" />
                วันที่สิ้นสุด (ตัวเลือก)
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-700 dark:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 text-sm md:text-base flex items-center justify-center gap-2"
            >
              {editingId ? (
                <>
                  <CheckCircle size={18} />
                  อัปเดต
                </>
              ) : (
                <>
                  <Zap size={18} />
                  สร้าง
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-400 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 text-sm md:text-base flex items-center justify-center gap-2"
            >
              <X size={18} />
              ยกเลิก
            </button>
          </div>
        </form>
      )}

      {/* รายการประกาศ */}
      {loading ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-200 animate-pulse">
          กำลังโหลดประกาศ...
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
          <AlertCircle size={24} />
          ยังไม่มีประกาศ
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 animate-stagger">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white dark:bg-gray-900 border-l-4 border-blue-500 dark:border-blue-600 rounded-lg shadow-md dark:shadow-lg p-6 card-enter hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 ${
                announcement.type === 'warning' 
                  ? 'border-l-yellow-500 dark:border-l-yellow-600' 
                  : announcement.type === 'success' 
                  ? 'border-l-green-500 dark:border-l-green-600' 
                  : announcement.type === 'error' 
                  ? 'border-l-red-500 dark:border-l-red-600' 
                  : ''
              }`}
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {React.createElement(typeIcons[announcement.type], { size: 32, className: 'text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1' })}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1"><Clock size={16} /> เริ่ม: {new Date(announcement.startDate).toLocaleString('th-TH')}</span>
                      {announcement.endDate && (
                        <span className="flex items-center gap-1"><Flag size={16} /> สิ้นสุด: {new Date(announcement.endDate).toLocaleString('th-TH')}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300 text-sm font-bold hover:scale-105 flex items-center gap-2"
                    title="แก้ไข"
                  >
                    <Edit2 size={16} /> แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300 text-sm font-bold hover:scale-105 flex items-center gap-2"
                    title="ลบ"
                  >
                    <Trash2 size={16} /> ลบ
                  </button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-base leading-relaxed">
                {announcement.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
