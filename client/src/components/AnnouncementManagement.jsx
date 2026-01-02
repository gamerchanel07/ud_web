import React, { useState, useEffect } from 'react';
import { announcementService } from '../services/api';

export const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await announcementService.getAll();
      setAnnouncements(response.data);
    } catch (err) {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
        title: '',
        content: '',
        type: 'info',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save announcement');
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      startDate: announcement.startDate.split('T')[0],
      endDate: announcement.endDate ? announcement.endDate.split('T')[0] : ''
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementService.delete(id);
        loadAnnouncements();
      } catch (err) {
        setError('Failed to delete announcement');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      type: 'info',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
  };

  const typeColors = {
    info: 'from-blue-500 to-cyan-500',
    warning: 'from-yellow-500 to-orange-500',
    success: 'from-green-500 to-emerald-500',
    error: 'from-red-500 to-pink-500'
  };

  const typeIcons = {
    info: '📢',
    warning: '⚠️',
    success: '✅',
    error: '❌'
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 animate-slide-in-down">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 font-bold transition-all duration-300 hover-lift glow"
        >
          {showForm ? '✕ Cancel' : '+ New Announcement'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass glass-lg p-6 rounded-lg mb-8 card-enter">
          <h3 className="text-2xl font-bold mb-4 text-gray-100">
            {editingId ? 'Edit Announcement' : 'Create New Announcement'}
          </h3>

          {error && (
            <div className="bg-red-500/30 text-red-200 p-3 rounded-lg mb-4 border border-red-500/50">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-200 font-bold mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Announcement title"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-200 font-bold mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100"
              >
                <option value="info">Info 📢</option>
                <option value="warning">Warning ⚠️</option>
                <option value="success">Success ✅</option>
                <option value="error">Error ❌</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-200 font-bold mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Announcement content"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100 placeholder-gray-400"
              rows="4"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-200 font-bold mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-200 font-bold mb-2">End Date (optional)</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-gray-100"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 font-bold transition-all duration-300 hover-lift"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500/30 text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-500/40 font-bold transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="text-center py-8 text-gray-200 animate-pulse">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-8 text-gray-300">No announcements yet</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 animate-stagger">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`glass glass-lg border-l-4 bg-gradient-to-r ${typeColors[announcement.type]}/10 p-6 card-enter hover-lift`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{typeIcons[announcement.type]}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">{announcement.title}</h3>
                    <p className="text-sm text-gray-400">
                      Started: {new Date(announcement.startDate).toLocaleDateString()}
                      {announcement.endDate && ` | Ends: ${new Date(announcement.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="px-3 py-1 rounded bg-blue-500/30 text-blue-200 hover:bg-blue-500/40 transition-all duration-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="px-3 py-1 rounded bg-red-500/30 text-red-200 hover:bg-red-500/40 transition-all duration-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-200 whitespace-pre-wrap text-sm">{announcement.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
