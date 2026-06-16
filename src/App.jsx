import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Inicio from './components/Inicio';
import Contacto from './components/Contacto';
import Chatbot from './components/Chatbot';

import LoginRegistro from './views/Login/LoginRegistro';
import Muro from './views/Muro/Muro';
import Farmacia from './views/Farmacia/Farmacia';
import Citas from './views/Citas/Citas';
import AdminDashboard from './views/Admin/AdminDashboard';

import { Lock, Heart } from 'lucide-react';

const API_URL = 'https://consultorio-ortega-backend.onrender.com/api';

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('inicio');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const handleLogout = () => { localStorage.clear(); setUser(null); setToken(''); setActiveTab('inicio'); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} user={user} handleLogout={handleLogout} />

      {!user && (
        <div style={{ backgroundColor: '#feebc8', color: '#92400e', padding: '12px 20px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderBottom: '1px solid #fbd38d' }}>
          <Lock size={16} /> Estimado paciente, regístrese o inicie sesión para desbloquear el Muro Informativo, Catálogo de Farmacia y control de Citas Médicas.
        </div>
      )}

      <main style={{ maxWidth: '1000px', width: '100%', margin: '30px auto', padding: '0 20px', flex: 1 }}>
        
        {activeTab === 'inicio' && (
          <Inicio theme={theme} toggleTheme={toggleTheme} setActiveTab={setActiveTab} />
        )}
        
        {activeTab === 'contacto' && <Contacto />}

        {activeTab === 'cuenta' && (
          <LoginRegistro API_URL={API_URL} setUser={setUser} setToken={setToken} setActiveTab={setActiveTab} />
        )}

        {user && activeTab === 'muro' && <Muro user={user} token={token} API_URL={API_URL} />}
        {user && activeTab === 'farmacia' && <Farmacia user={user} token={token} API_URL={API_URL} />}
        {user && activeTab === 'citas' && <Citas token={token} API_URL={API_URL} />}
        {user?.role === 'admin' && activeTab === 'admin' && <AdminDashboard token={token} API_URL={API_URL} />}

      </main>

      <div style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <p style={{ fontStyle: 'italic', fontWeight: '600', fontSize: '0.95rem', marginBottom: '6px' }}>
          "Tu salud en manos expertas, tu bienestar es nuestra prioridad"
        </p>
        <p style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          © 2026 Todos los derechos reservados por SindyCastellon <Heart size={12} fill="#e53e3e" color="#e53e3e" />
        </p>
      </div>

      <Chatbot />
    </div>
  );
}