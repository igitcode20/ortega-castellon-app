// src/views/Admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Heart, Users, CalendarDays, Package, DollarSign, ShoppingBag } from 'lucide-react';

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

      const resStats = await fetch(`${API_URL}/orders/stats`, { headers });
      const dataStats = await resStats.json();

      const resApp = await fetch(`${API_URL}/appointments/all`, { headers });
      const dataApp = await resApp.json();
      const pendingApps = Array.isArray(dataApp) ? dataApp.filter(a => a.status === 'pending').length : 0;

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
    { icon: <Users size={20} color="#0284c7" />, label: 'Pacientes', value: stats.users, bg: '#e0f2fe' },
    { icon: <CalendarDays size={20} color="#b45309" />, label: 'Citas Pendientes', value: stats.pendingAppointments, bg: '#fef3c7' },
    { icon: <Package size={20} color="#8b5cf6" />, label: 'Pedidos', value: stats.totalOrders, bg: '#ede9fe' },
    { icon: <DollarSign size={20} color="#22c55e" />, label: 'Ventas Totales', value: `C$${stats.totalSales.toFixed(2)}`, bg: '#dcfce7' },
    { icon: <Heart size={20} color="#ef4444" fill="#ef4444" />, label: 'Reacciones', value: stats.likes, bg: '#fee2e2' },
    { icon: <ShoppingBag size={20} color="#3b82f6" />, label: 'Productos', value: stats.totalProducts, bg: '#dbeafe' }
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 'clamp(30px, 8vh, 60px)', color: 'var(--text-muted)' }}>⏳ Cargando dashboard...</div>;
  }

  return (
    <div>
      <h2 style={{ 
        color: 'var(--primary-blue)', 
        marginBottom: 'clamp(16px, 3vw, 24px)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)'
      }}>
        📊 Panel de Control
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
        gap: 'clamp(10px, 1.5vw, 16px)'
      }}>
        {cards.map((card, index) => (
          <div key={index} className="card" style={{
            padding: 'clamp(14px, 1.5vw, 20px)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 1.5vw, 14px)'
          }}>
            <div style={{
              backgroundColor: card.bg,
              padding: 'clamp(8px, 1vw, 12px)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '36px',
              minHeight: '36px'
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ 
                fontSize: 'clamp(0.6rem, 1vw, 0.75rem)', 
                color: 'var(--text-muted)', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>
                {card.label}
              </div>
              <div style={{ 
                fontSize: 'clamp(1rem, 2vw, 1.3rem)', 
                fontWeight: 'bold', 
                color: 'var(--text-main)' 
              }}>
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje de bienvenida */}
      <div className="card" style={{
        marginTop: 'clamp(16px, 3vw, 24px)',
        textAlign: 'center',
        padding: 'clamp(14px, 1.5vw, 20px)'
      }}>
        <p style={{ 
          margin: 0, 
          color: 'var(--text-muted)',
          fontSize: 'clamp(0.85rem, 1.5vw, 1rem)'
        }}>
          👋 ¡Bienvenida, Administradora! Tienes <strong style={{ color: 'var(--primary-blue)' }}>{stats.pendingAppointments}</strong> citas pendientes 
          y <strong style={{ color: 'var(--primary-green)' }}>{stats.pendingOrders}</strong> pedidos por confirmar.
        </p>
      </div>
    </div>
  );
}