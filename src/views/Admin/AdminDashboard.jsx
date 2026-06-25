// src/views/Admin/AdminDashboard.jsx

import { useState, useEffect } from 'react';
import { Heart, Users, CalendarDays, Package, DollarSign, ShoppingBag, Award } from 'lucide-react';

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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadStats();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [API_URL, token]);

  const cards = [
    { 
      icon: <Users size={22} color="#0284c7" />, 
      label: 'Pacientes', 
      value: stats.users, 
      bg: '#e0f2fe',
      borderColor: '#0284c7'
    },
    { 
      icon: <CalendarDays size={22} color="#b45309" />, 
      label: 'Citas Pendientes', 
      value: stats.pendingAppointments, 
      bg: '#fef3c7',
      borderColor: '#b45309'
    },
    { 
      icon: <Package size={22} color="#8b5cf6" />, 
      label: 'Pedidos', 
      value: stats.totalOrders, 
      bg: '#ede9fe',
      borderColor: '#8b5cf6'
    },
    { 
      icon: <DollarSign size={22} color="#22c55e" />, 
      label: 'Ventas Totales', 
      value: `C$${stats.totalSales.toFixed(2)}`, 
      bg: '#dcfce7',
      borderColor: '#22c55e'
    },
    { 
      icon: <Heart size={22} color="#ef4444" fill="#ef4444" />, 
      label: 'Reacciones', 
      value: stats.likes, 
      bg: '#fee2e2',
      borderColor: '#ef4444'
    },
    { 
      icon: <ShoppingBag size={22} color="#3b82f6" />, 
      label: 'Productos', 
      value: stats.totalProducts, 
      bg: '#dbeafe',
      borderColor: '#3b82f6'
    }
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 'clamp(30px, 8vh, 60px)', color: 'var(--text-muted)' }}>⏳ Cargando dashboard...</div>;
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <h2 style={{ 
          color: 'var(--primary-blue)', 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)'
        }}>
          📊 Panel de Control
        </h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'var(--bg-main)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <Award size={18} color="var(--primary-blue)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
        gap: 'clamp(12px, 1.5vw, 16px)'
      }}>
        {cards.map((card, index) => (
          <div key={index} className="card" style={{
            padding: 'clamp(14px, 1.5vw, 20px)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 1.5vw, 14px)',
            borderLeft: `4px solid ${card.borderColor}`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{
              backgroundColor: card.bg,
              padding: 'clamp(8px, 1vw, 12px)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '40px',
              minHeight: '40px'
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ 
                fontSize: 'clamp(0.6rem, 0.9vw, 0.7rem)', 
                color: 'var(--text-muted)', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>
                {card.label}
              </div>
              <div style={{ 
                fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', 
                fontWeight: 'bold', 
                color: 'var(--text-main)' 
              }}>
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{
        marginTop: 'clamp(16px, 3vw, 24px)',
        textAlign: 'center',
        padding: 'clamp(14px, 1.5vw, 20px)',
        background: 'linear-gradient(135deg, var(--bg-card), var(--bg-main))',
        borderTop: '4px solid var(--primary-blue)'
      }}>
        <p style={{ 
          margin: 0, 
          color: 'var(--text-muted)',
          fontSize: 'clamp(0.85rem, 1.5vw, 1rem)'
        }}>
          👋 ¡Bienvenida, Administradora! Tienes <strong style={{ color: 'var(--primary-blue)' }}>{stats.pendingAppointments}</strong> citas pendientes 
          y <strong style={{ color: 'var(--primary-green)' }}>{stats.pendingOrders}</strong> pedidos por confirmar.
        </p>
        <p style={{ 
          margin: '6px 0 0 0',
          fontSize: 'clamp(0.75rem, 1vw, 0.85rem)',
          color: 'var(--text-muted)'
        }}>
          🎯 Total de pacientes: <strong>{stats.users}</strong> | Productos en catálogo: <strong>{stats.totalProducts}</strong>
        </p>
      </div>
    </div>
  );
}