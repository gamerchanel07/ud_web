import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export const StatCard = ({ title, value, icon, color }) => (
  <div className={`glass glass-lg border-l-4 ${color} hover:shadow-xl transition-all duration-300 hover:bg-white/20 card-enter hover-lift hover-glow`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-300 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);

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

  if (loading) return <div className="text-center py-8 text-gray-200">Loading dashboard...</div>;
  if (error) return <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/30">{error}</div>;
  if (!stats) return <div className="text-gray-300">No data available</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text animate-slide-in-down">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 animate-stagger">
        <StatCard
          title="Total Hotels"
          value={stats.stats.totalHotels}
          icon="🏨"
          color="border-purple-400"
        />
        <StatCard
          title="Total Reviews"
          value={stats.stats.totalReviews}
          icon="⭐"
          color="border-yellow-400"
        />
        <StatCard
          title="Total Users"
          value={stats.stats.totalUsers}
          icon="👥"
          color="border-pink-400"
        />
        <StatCard
          title="Avg Rating"
          value={stats.stats.avgRating}
          icon="📊"
          color="border-purple-500"
        />
        <StatCard
          title="Favorites"
          value={stats.stats.totalFavorites}
          icon="❤️"
          color="border-red-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-stagger">
        {/* Reviews by Rating Chart */}
        <div className="glass glass-lg hover:shadow-xl transition-all duration-300 card-enter">
          <h3 className="text-xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">Reviews by Rating</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.reviewsByRating}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="rating" 
                label={{ value: 'Rating (Stars)', position: 'insideBottomRight', offset: -5 }}
                stroke="rgba(255, 255, 255, 0.5)"
              />
              <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} stroke="rgba(255, 255, 255, 0.5)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 15, 30, 0.9)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(168, 85, 247, 0.2)' }}
              />
              <Bar dataKey="count" fill="#c084fc" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hotels by Type Pie Chart */}
        <div className="glass glass-lg hover:shadow-xl transition-all duration-300 card-enter">
          <h3 className="text-xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">Hotels by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.hotelsByType}
                dataKey="count"
                nameKey="hotelType"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ hotelType, count }) => `${hotelType}: ${count}`}
              >
                {stats.hotelsByType.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={['#a855f7', '#c084fc', '#ec4899', '#f472b6', '#fb7185', '#fda4af'][index % 6]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 15, 30, 0.9)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rating Distribution Chart */}
      <div className="glass glass-lg mb-8 hover:shadow-xl transition-all duration-300 card-enter">
        <h3 className="text-xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">Hotel Average Ratings Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.reviewsByRating || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="rating"
              label={{ value: 'Star Rating', position: 'insideBottomRight', offset: -5 }}
              stroke="rgba(255, 255, 255, 0.5)"
            />
            <YAxis label={{ value: 'Number of Reviews', angle: -90, position: 'insideLeft' }} stroke="rgba(255, 255, 255, 0.5)" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 15, 30, 0.9)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px' }}
              cursor={{ stroke: '#a855f7', strokeWidth: 2 }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#a855f7" 
              strokeWidth={2}
              dot={{ fill: '#c084fc', r: 5 }}
              activeDot={{ r: 7 }}
              name="Reviews"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Rated Hotels */}
      <div className="glass glass-lg mb-8 hover:shadow-xl transition-all duration-300 card-enter animate-slide-in-left">
        <h3 className="text-xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">🏆 Top Rated Hotels</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-purple-500/30 to-pink-500/30">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-purple-300">Hotel Name</th>
                <th className="px-4 py-2 text-left font-semibold text-purple-300">Rating</th>
                <th className="px-4 py-2 text-left font-semibold text-purple-300">Price</th>
              </tr>
            </thead>
            <tbody>
              {stats.topRatedHotels.map((hotel, idx) => (
                <tr 
                  key={hotel.id} 
                  className="border-b border-white/10 hover:bg-purple-500/20 transition-colors duration-200 group cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-purple-300 group-hover:text-purple-300 transition-colors">{hotel.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-yellow-400 group-hover:scale-110 transform transition-transform duration-200 inline-block">
                      {'⭐'.repeat(Math.round(hotel.rating))} <span className="text-gray-200 ml-1">{hotel.rating.toFixed(1)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-pink-300 group-hover:text-pink-200 transition-colors">฿{hotel.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="glass glass-lg hover:shadow-xl transition-all duration-300 card-enter animate-slide-in-right">
        <h3 className="text-xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">📝 Recent Reviews</h3>
        <div className="space-y-4">
          {stats.recentReviews.map((review) => (
            <div 
              key={review.id} 
              className="border-b border-white/10 pb-4 last:border-b-0 hover:bg-purple-500/20 p-3 rounded-lg transition-colors duration-200 group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-100 group-hover:text-purple-300 transition-colors">{review.user}</p>
                  <p className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">{review.hotel}</p>
                  <p className="text-yellow-400 mt-1 group-hover:scale-110 transform transition-transform duration-200 inline-block">
                    {'⭐'.repeat(review.rating)}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-gray-200 mt-2 text-sm italic group-hover:text-gray-100 transition-colors">
                  "{review.comment.substring(0, 100)}{review.comment.length > 100 ? '...' : ''}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
