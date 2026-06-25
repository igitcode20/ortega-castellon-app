// src/App.jsx

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Inicio from './components/Inicio';
import Contacto from './components/Contacto';
import Chatbot from './components/Chatbot';
import Cart from './components/Cart';
import FloatingQuote from './components/FloatingQuote';

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

  // Helper para clamp en JS
  const clamp = (min, val, max) => Math.min(Math.max(min, val), max);

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

      {/* Frases flotantes - siempre visibles */}
      <FloatingQuote />

      {/* Banner de bienvenida - solo para no logueados */}
      {!user && activeTab !== 'cuenta' && (
        <div style={{
          margin: '12px auto 0 auto',
          padding: 'clamp(12px, 1.5vw, 20px)',
          maxWidth: '700px',
          width: '100%',
          background: 'linear-gradient(135deg, rgba(0,132,204,0.08), rgba(140,198,63,0.08))',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ color: 'var(--primary-blue)' }}>
            <Lock size={clamp(20, 2.5, 28)} />
          </div>
          <h3 style={{ 
            margin: '4px 0', 
            color: 'var(--primary-blue)', 
            fontSize: 'clamp(0.95rem, 2, 1.2rem)' 
          }}>
            ¡Bienvenido a tu Clínica Digital!
          </h3>
          <p style={{ 
            margin: '4px 0 12px 0', 
            fontSize: 'clamp(0.8rem, 1.5  , 0.95rem)', 
            color: 'var(--text-muted)' 
          }}>
            Regístrate o inicia sesión para desbloquear citas, farmacia y muro informativo.
          </p>
          <button 
            onClick={() => setActiveTab('cuenta')} 
            className="btn-primary"
            style={{ fontSize: 'clamp(0.8rem, 1.2, 0.9rem)', padding: '8px 24px' }}
          >
            Comenzar ahora
          </button>
        </div>
      )}

      <main style={{ 
        maxWidth: '1100px', 
        width: '100%', 
        margin: '12px auto', 
        padding: '0 clamp(10px, 2vw, 20px)', 
        flex: 1
      }}>
        
        {/* Vistas */}
        {activeTab === 'inicio' && <Inicio theme={theme} setActiveTab={setActiveTab} />}
        {activeTab === 'contacto' && <Contacto />}
        {activeTab === 'cuenta' && (
          <LoginRegistro API_URL={API_URL} setUser={setUser} setToken={setToken} setActiveTab={setActiveTab} />
        )}

        {user && !isAdmin && activeTab === 'muro' && <Muro user={user} token={token} API_URL={API_URL} />}
        {user && !isAdmin && activeTab === 'farmacia' && (
          <Farmacia user={user} token={token} API_URL={API_URL} cart={cart} setCart={setCart} />
        )}
        {user && !isAdmin && activeTab === 'citas' && <Citas token={token} API_URL={API_URL} />}
        {user && !isAdmin && activeTab === 'mis-pedidos' && <MisPedidos token={token} API_URL={API_URL} />}

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
        padding: '12px 20px', 
        textAlign: 'center', 
        borderTop: '1px solid var(--border-color)', 
        marginTop: 'auto',
        backgroundColor: 'var(--bg-card)'
      }}>
        <p style={{ 
          fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', 
          fontWeight: '600',
          marginBottom: '2px',
          color: 'var(--text-muted)'
        }}>
          "Tu salud en manos expertas, tu bienestar es nuestra prioridad"
        </p>
        <p style={{ 
          fontSize: 'clamp(0.6rem, 1vw, 0.75rem)', 
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          flexWrap: 'wrap'
        }}>
          © 2026 Todos los derechos reservados por SindyCastellon 
          <Heart size={clamp(10, 1.2, 14)} fill="#e53e3e" color="#e53e3e" />
        </p>
      </div>

      <Chatbot />
      {user && <Cart cart={cart} setCart={setCart} user={user} token={token} API_URL={API_URL} />}
    </div>
  );
}