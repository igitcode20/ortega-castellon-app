// src/App.jsx

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Inicio from './components/Inicio';
import Contacto from './components/Contacto';
import Chatbot from './components/Chatbot';
import Cart from './components/Cart';

import LoginRegistro from './views/Login/LoginRegistro';
import Muro from './views/Muro/Muro';
import Farmacia from './views/Farmacia/Farmacia';
import Citas from './views/Citas/Citas';
import AdminCitas from './views/Admin/AdminCitas';
import AdminPedidos from './views/Admin/AdminPedidos';
import AdminDashboard from './views/Admin/AdminDashboard';
import MisPedidos from './views/Pedidos/MisPedidos';
import Reportes from './views/Admin/Reportes';

import { Lock, Heart } from 'lucide-react';

const API_URL = 'https://consultorio-ortega-backend.onrender.com/api';

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('inicio');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const handleLogout = () => { 
    localStorage.clear(); 
    setUser(null); 
    setToken(''); 
    setCart([]);
    setActiveTab('inicio'); 
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'var(--bg-main)', 
      color: 'var(--text-main)',
      overflowX: 'hidden'
    }}>
      
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        user={user} 
        handleLogout={handleLogout} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        isAdmin={isAdmin}
      />

      {/* Banner de bienvenida - SOLO PARA NO LOGUEADOS */}
      {!user && activeTab !== 'cuenta' && (
        <div style={{
          margin: 'clamp(12px, 2vw, 20px) auto',
          padding: 'clamp(16px, 2vw, 25px) clamp(16px, 3vw, 30px)',
          maxWidth: '90%',
          width: '100%',
          maxWidth: '800px',
          background: 'linear-gradient(135deg, #0084cc12, #8cc63f12)',
          border: '1px solid var(--border-color)',
          borderRadius: 'clamp(14px, 2vw, 20px)',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ color: 'var(--primary-blue)', marginBottom: '8px' }}>
            <Lock size={28} />
          </div>
          <h3 style={{ 
            margin: '0 0 8px 0', 
            color: 'var(--primary-blue)', 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' 
          }}>
            ¡Bienvenido a tu Clínica Digital!
          </h3>
          <p style={{ 
            margin: '0 0 16px 0', 
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', 
            color: 'var(--text-muted)' 
          }}>
            Regístrate o inicia sesión para desbloquear el control de tus citas, acceso a farmacia y muro informativo.
          </p>
          <button 
            onClick={() => setActiveTab('cuenta')} 
            style={{
              padding: 'clamp(10px, 1.5vw, 14px) clamp(24px, 4vw, 36px)',
              background: 'var(--primary-blue)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
              transition: 'transform 0.2s ease',
              minHeight: '48px'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Comenzar ahora
          </button>
        </div>
      )}

      <main style={{ 
        maxWidth: '1200px', 
        width: '100%', 
        margin: 'clamp(12px, 2vw, 20px) auto', 
        padding: '0 clamp(12px, 2vw, 24px)', 
        flex: 1
      }}>
        
        {/* VISTAS PÚBLICAS */}
        {activeTab === 'inicio' && <Inicio theme={theme} setActiveTab={setActiveTab} />}
        {activeTab === 'contacto' && <Contacto />}
        {activeTab === 'cuenta' && (
          <LoginRegistro API_URL={API_URL} setUser={setUser} setToken={setToken} setActiveTab={setActiveTab} />
        )}

        {/* VISTAS DE CLIENTE */}
        {user && !isAdmin && activeTab === 'muro' && <Muro user={user} token={token} API_URL={API_URL} />}
        {user && !isAdmin && activeTab === 'farmacia' && (
          <Farmacia user={user} token={token} API_URL={API_URL} cart={cart} setCart={setCart} />
        )}
        {user && !isAdmin && activeTab === 'citas' && <Citas token={token} API_URL={API_URL} />}
        {user && !isAdmin && activeTab === 'mis-pedidos' && <MisPedidos token={token} API_URL={API_URL} />}

        {/* VISTAS DE ADMIN */}
        {isAdmin && activeTab === 'admin-dashboard' && <AdminDashboard token={token} API_URL={API_URL} />}
        {isAdmin && activeTab === 'admin-citas' && <AdminCitas token={token} API_URL={API_URL} />}
        {isAdmin && activeTab === 'admin-pedidos' && <AdminPedidos token={token} API_URL={API_URL} />}
        {isAdmin && activeTab === 'admin-reportes' && <Reportes token={token} API_URL={API_URL} />}
        {isAdmin && activeTab === 'muro' && <Muro user={user} token={token} API_URL={API_URL} />}
        {isAdmin && activeTab === 'farmacia' && (
          <Farmacia user={user} token={token} API_URL={API_URL} cart={cart} setCart={setCart} />
        )}

      </main>

      {/* Footer */}
      <div style={{ 
        padding: 'clamp(12px, 1.5vw, 20px) clamp(16px, 3vw, 24px)', 
        textAlign: 'center', 
        borderTop: '1px solid var(--border-color)', 
        marginTop: 'auto',
        backgroundColor: 'var(--bg-card)'
      }}>
        <p style={{ 
          fontStyle: 'italic', 
          fontWeight: '600', 
          fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', 
          marginBottom: '4px' 
        }}>
          "Tu salud en manos expertas, tu bienestar es nuestra prioridad"
        </p>
        <p style={{ 
          fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)', 
          fontWeight: 'bold', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '6px', 
          color: 'var(--text-muted)',
          flexWrap: 'wrap'
        }}>
          © 2026 Todos los derechos reservados por SindyCastellon 
          <Heart size={14} fill="#e53e3e" color="#e53e3e" />
        </p>
      </div>

      <Chatbot />
      {user && <Cart cart={cart} setCart={setCart} user={user} token={token} API_URL={API_URL} />}
    </div>
  );
}

// Helper para clamp en JS
const clamp = (min, val, max) => Math.min(Math.max(min, val), max);