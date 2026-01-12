import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

/* =========================
   Reusable Stat Card
========================= */
export const StatCard = ({ title, value, icon, color }) => (
  <div className={`glass glass-lg border-l-4 ${color} hover:shadow-xl transition-all duration-300 hover:bg-white/20`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-300 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);

/* =========================
   Dashboard Stats
========================= */
export const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await API.get('/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-200">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
        {error}
      </div>
    );
  }

  if (!stats) {
    return <div className="text-gray-300">No data available</div>;
  }

  /* =========================
     Safe Defaults (กัน null)
  ========================= */
  const safeStats = stats.stats || {};

  const totalHotels = safeStats.totalHotels ?? 0;
  const totalReviews = safeStats.totalReviews ?? 0;
  const totalUsers = safeStats.totalUsers ?? 0;
  const avgRating = Number(safeStats.avgRating ?? 0).toFixed(1);
  const totalFavorites = safeStats.totalFavorites ?? 0;

  const reviewsByRating = Array.isArray(stats.reviewsByRating)
    ? stats.reviewsByRating
    : [];

  const hotelsByType = Array.isArray(stats.hotelsByType)
    ? stats.hotelsByType
    : [];

  const topRatedHotels = Array.isArray(stats.topRatedHotels)
    ? stats.topRatedHotels
    : [];

  const recentReviews = Array.isArray(stats.recentReviews)
    ? stats.recentReviews
    : [];

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
        Dashboard Overview
      </h2>

      {/* =========================
          Stats Grid
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Hotels" value={totalHotels} icon="🏨" color="border-purple-400" />
        <StatCard title="Total Reviews" value={totalReviews} icon="⭐" color="border-yellow-400" />
        <StatCard title="Total Users" value={totalUsers} icon="👥" color="border-pink-400" />
        <StatCard title="Avg Rating" value={avgRating} icon="📊" color="border-purple-500" />
        <StatCard title="Favorites" value={totalFavorites} icon="❤️" color="border-red-400" />
      </div>

      {/* =========================
          Charts
      ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Reviews by Rating */}
        <div className="glass glass-lg">
          <h3 className="text-xl font-bold mb-4 text-purple-300">Reviews by Rating</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reviewsByRating}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="rating" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip />
              <Bar dataKey="count" fill="#c084fc" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hotels by Type */}
        <div className="glass glass-lg">
          <h3 className="text-xl font-bold mb-4 text-purple-300">Hotels by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={hotelsByType}
                dataKey="count"
                nameKey="hotelType"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ hotelType, count }) => `${hotelType}: ${count}`}
              >
                {hotelsByType.map((_, index) => (
                  <Cell
                    key={index}
                    fill={['#a855f7', '#c084fc', '#ec4899', '#f472b6'][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================
          Top Rated Hotels
      ========================= */}
      <div className="glass glass-lg mb-8">
        <h3 className="text-xl font-bold mb-4 text-purple-300">🏆 Top Rated Hotels</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-purple-500/20">
              <tr>
                <th className="px-4 py-2 text-left">Hotel Name</th>
                <th className="px-4 py-2 text-left">Rating</th>
                <th className="px-4 py-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {topRatedHotels.map((hotel) => (
                <tr key={hotel.id} className="border-b border-white/10">
                  <td className="px-4 py-3">{hotel.name}</td>
                  <td className="px-4 py-3 text-yellow-400">
                    {'⭐'.repeat(Math.round(hotel.rating ?? 0))}{' '}
                    <span className="text-gray-200 ml-1">
                      {Number(hotel.rating ?? 0).toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-pink-300">
                    ฿{Number(hotel.price ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          Recent Reviews
      ========================= */}
      <div className="glass glass-lg">
        <h3 className="text-xl font-bold mb-4 text-purple-300">📝 Recent Reviews</h3>
        <div className="space-y-4">
          {recentReviews.map((review) => (
            <div key={review.id} className="border-b border-white/10 pb-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-gray-100">{review.user}</p>
                  <p className="text-sm text-gray-300">{review.hotel}</p>
                  <p className="text-yellow-400">{'⭐'.repeat(review.rating ?? 0)}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : ''}
                </span>
              </div>
              {review.comment && (
                <p className="text-gray-200 mt-2 text-sm italic">
                  "{review.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
