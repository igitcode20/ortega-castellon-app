// src/views/Admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Heart, Users, CalendarDays, Package, DollarSign, TrendingUp, Clock, ShoppingBag } from 'lucide-react';

export default function AdminDashboard({ token, API_URL }) {
  const [stats, setStats] = useState({
    likes: 0,
    users: 0,
    pendingAppointments: 0,
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Estadísticas de pedidos
      const resStats = await fetch(`${API_URL}/orders/stats`, { headers });
      const dataStats = await resStats.json();

      // 2. Citas pendientes
      const resApp = await fetch(`${API_URL}/appointments/all`, { headers });
      const dataApp = await resApp.json();
      const pendingApps = Array.isArray(dataApp) ? dataApp.filter(a => a.status === 'pending').length : 0;

      // 3. Reacciones del muro
      const resPosts = await fetch(`${API_URL}/posts`);
      const dataPosts = await resPosts.json();
      const totalLikes = Array.isArray(dataPosts) 
        ? dataPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0) 
        : 0;

      setStats({
        likes: totalLikes,
        users: dataStats.totalUsers || 0,
        pendingAppointments: pendingApps,
        totalOrders: dataStats.totalOrders || 0,
        totalSales: dataStats.totalSales || 0,
        pendingOrders: dataStats.pendingOrders || 0,
        totalProducts: dataStats.totalProducts || 0
      });

    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  const cards = [
    { 
      icon: <Users size={22} color="#0284c7" />, 
      label: 'Pacientes', 
      value: stats.users,
      bg: '#e0f2fe'
    },
    { 
      icon: <CalendarDays size={22} color="#b45309" />, 
      label: 'Citas Pendientes', 
      value: stats.pendingAppointments,
      bg: '#fef3c7'
    },
    { 
      icon: <Package size={22} color="#8b5cf6" />, 
      label: 'Pedidos', 
      value: stats.totalOrders,
      bg: '#ede9fe'
    },
    { 
      icon: <DollarSign size={22} color="#22c55e" />, 
      label: 'Ventas Totales', 
      value: `C$${stats.totalSales.toFixed(2)}`,
      bg: '#dcfce7'
    },
    { 
      icon: <Heart size={22} color="#ef4444" fill="#ef4444" />, 
      label: 'Reacciones', 
      value: stats.likes,
      bg: '#fee2e2'
    },
    { 
      icon: <ShoppingBag size={22} color="#3b82f6" />, 
      label: 'Productos', 
      value: stats.totalProducts,
      bg: '#dbeafe'
    }
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>⏳ Cargando dashboard...</div>;
  }

  return (
    <div>
      <h2 style={{ color: 'var(--primary-blue)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        📊 Panel de Control
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '15px'
      }}>
        {cards.map((card, index) => (
          <div key={index} style={{
            backgroundColor: 'var(--bg-card)',
            padding: '18px',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            transition: 'transform 0.2s ease'
          }}>
            <div style={{
              backgroundColor: card.bg,
              padding: '10px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '40px'
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje de bienvenida */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          👋 ¡Bienvenida, Administradora! Tienes <strong style={{ color: 'var(--primary-blue)' }}>{stats.pendingAppointments}</strong> citas pendientes 
          y <strong style={{ color: 'var(--primary-green)' }}>{stats.pendingOrders}</strong> pedidos por confirmar.
        </p>
      </div>
    </div>
  );
}