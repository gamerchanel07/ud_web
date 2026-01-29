import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Building2, Star, Users, BarChart3, Heart, Trophy, TrendingUp, MessageCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* =========================
   บัตรสถิติที่สามารถนำมาใช้ใหม่ได้
========================= */
export const StatCard = ({ title, value, icon: Icon, color }) => (
  <div
    style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid rgba(0, 173, 181, 0.2)',
      borderLeft: '4px solid var(--primary-main)',
      borderRadius: '0.5rem',
      padding: '1.25rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 0.1)';
      e.currentTarget.style.borderColor = 'rgba(0, 173, 181, 0.4)';
      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 173, 181, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
      e.currentTarget.style.borderColor = 'rgba(0, 173, 181, 0.2)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
      <div>
        <p style={{fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-tertiary)'}}>{title}</p>
        <p style={{fontSize: '1.875rem', fontWeight: 'bold', marginTop: '0.5rem', color: 'var(--primary-main)'}}>
          {value}
        </p>
      </div>
      {Icon && <Icon size={32} style={{color: 'var(--primary-main)'}} />}
    </div>
  </div>
);

/* =========================
   สถิติแดชบอร์ด
========================= */
export const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await API.get("/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-200">Loading dashboard...</div>
    );
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

  const mostFavoritedHotels = Array.isArray(stats.mostFavoritedHotels)
    ? stats.mostFavoritedHotels
    : [];

  const recentReviews = Array.isArray(stats.recentReviews)
    ? stats.recentReviews
    : [];

  return (
    <div style={{animation: 'fade-in 0.5s ease-in'}}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <BarChart3 size={36} style={{color: 'var(--primary-main)'}} />
        Dashboard Overview
      </h2>

      {/* =========================
          Stats Grid
      ========================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="โรงแรมทั้งหมด"
          value={totalHotels}
          icon={Building2}
        />
        <StatCard
          title="รีวิวทั้งหมด"
          value={totalReviews}
          icon={Star}
        />
        <StatCard
          title="ผู้ใช้ทั้งหมด"
          value={totalUsers}
          icon={Users}
        />
        <StatCard
          title="คะแนนเฉลี่ย"
          value={avgRating}
          icon={BarChart3}
        />
        <StatCard
          title="รายการโปรด"
          value={totalFavorites}
          icon={Heart}
        />
      </div>

      {/* =========================
          Charts
      ========================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* รีวิวตามคะแนน */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid rgba(0, 173, 181, 0.2)',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <TrendingUp size={24} style={{color: 'var(--primary-main)'}} />
            รีวิวตามคะแนน
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reviewsByRating}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0, 173, 181, 0.1)"
              />
              <XAxis dataKey="rating" stroke="var(--text-tertiary)" />
              <YAxis stroke="var(--text-tertiary)" />
              <Tooltip />
              <Bar dataKey="count" fill="#00ADB5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* โรงแรมตามประเภท */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid rgba(0, 173, 181, 0.2)',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Building2 size={24} style={{color: 'var(--primary-main)'}} />
            โรงแรมตามประเภท
          </h3>
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
                    fill={
                      ["#00ADB5", "#00897B", "#009688", "#00796B"][index % 4]
                    }
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
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid rgba(0, 173, 181, 0.2)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Trophy size={24} style={{color: '#FFC107'}} />
          โรงแรมที่มีคะแนนสูงสุด
        </h3>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', fontSize: '0.875rem'}}>
            <thead style={{backgroundColor: 'rgba(0, 173, 181, 0.1)'}}>
              <tr style={{borderBottom: '2px solid var(--primary-main)'}}>
                <th style={{padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 'bold'}}>ชื่อโรงแรม</th>
                <th style={{padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 'bold'}}>คะแนน</th>
                <th style={{padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 'bold'}}>ราคา</th>
              </tr>
            </thead>
            <tbody>
              {topRatedHotels.map((hotel) => (
                <tr key={hotel.id} style={{borderBottom: '1px solid rgba(0, 173, 181, 0.1)'}}>
                  <td style={{padding: '0.75rem 1rem', color: 'var(--text-primary)'}}>{hotel.name}</td>
                  <td style={{padding: '0.75rem 1rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{display: 'flex', color: '#FFC107'}}>
                        {[...Array(Math.round(hotel.rating ?? 0))].map((_, i) => (
                          <Star key={i} size={16} fill="#FFC107" />
                        ))}
                      </div>
                      <span style={{color: 'var(--text-secondary)', marginLeft: '0.5rem'}}>
                        {Number(hotel.rating ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td style={{padding: '0.75rem 1rem', color: 'var(--primary-main)', fontWeight: 'bold'}}>
                    ฿{Number(hotel.price ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          Most Favorited Hotels
      ========================= */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid rgba(0, 173, 181, 0.2)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Heart size={24} style={{color: '#E91E63', fill: '#E91E63'}} />
          โรงแรมที่ถูกชื่นชอบมากที่สุด
        </h3>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', fontSize: '0.875rem'}}>
            <thead style={{backgroundColor: 'rgba(0, 173, 181, 0.1)'}}>
              <tr style={{borderBottom: '2px solid var(--primary-main)'}}>
                <th style={{padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 'bold'}}>ชื่อโรงแรม</th>
                <th style={{padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 'bold'}}>จำนวนรายการโปรด</th>
                <th style={{padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 'bold'}}>ราคา</th>
              </tr>
            </thead>
            <tbody>
              {mostFavoritedHotels.map((hotel) => (
                <tr key={hotel.id} style={{borderBottom: '1px solid rgba(0, 173, 181, 0.1)'}}>
                  <td style={{padding: '0.75rem 1rem', color: 'var(--text-primary)'}}>{hotel.name}</td>
                  <td style={{padding: '0.75rem 1rem', fontWeight: 'bold', color: '#E91E63'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <Heart size={18} style={{color: '#E91E63', fill: '#E91E63'}} />
                      {hotel.favoriteCount ?? 0}
                    </div>
                  </td>
                  <td style={{padding: '0.75rem 1rem', color: 'var(--primary-main)', fontWeight: 'bold'}}>
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
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid rgba(0, 173, 181, 0.2)',
        borderRadius: '0.5rem',
        padding: '1.5rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <MessageCircle size={24} style={{color: 'var(--primary-main)'}} />
          รีวิวล่าสุด
        </h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {recentReviews.map((review) => (
            <div key={review.id} style={{
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(0, 173, 181, 0.1)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <p style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{review.user}</p>
                  <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)'}}>{review.hotel}</p>
                  <div style={{display: 'flex', color: '#FFC107', marginTop: '0.25rem'}}>
                    {[...Array(review.rating ?? 0)].map((_, i) => (
                      <Star key={i} size={16} fill="#FFC107" />
                    ))}
                  </div>
                </div>
                <span style={{fontSize: '0.75rem', color: 'var(--text-tertiary)'}}>
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString('th-TH')
                    : ""}
                </span>
              </div>
              {review.comment && (
                <p style={{
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  fontStyle: 'italic',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'rgba(0, 173, 181, 0.05)',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  borderLeft: '3px solid var(--primary-main)'
                }}>
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
