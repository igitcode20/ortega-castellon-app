import React, { useState } from 'react';
import { Sun, Moon, Menu, X, BookOpen, ShoppingBag, Calendar, Info, MapPin, UserCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, user, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  // Si está logueado ve todo, si no, solo ve Inicio y Contacto
  const navItems = user 
    ? [
        { id: 'inicio', label: 'Inicio', icon: <Info size={18} /> },
        { id: 'muro', label: 'Muro', icon: <BookOpen size={18} /> },
        { id: 'farmacia', label: 'Farmacia', icon: <ShoppingBag size={18} /> },
        { id: 'citas', label: 'Citas', icon: <Calendar size={18} /> },
        { id: 'contacto', label: 'Contacto', icon: <MapPin size={18} /> },
      ]
    : [
        { id: 'inicio', label: 'Inicio', icon: <Info size={18} /> },
        { id: 'contacto', label: 'Contacto', icon: <MapPin size={18} /> },
      ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <nav style={{ backgroundColor: 'var(--bg-card)', borderBottom: '3px solid var(--primary-blue)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div>
          <h1 style={{ fontSize: '1.2rem', color: 'var(--primary-blue)', fontWeight: '800', lineHeight: 1.2 }}>
            Consultorio Clínico y Farmacia <br />
            <span style={{ color: 'var(--primary-green)' }}>Ortega Castellón</span>
          </h1>
        </div>

        {/* ESCRITORIO */}
        <div style={{ display: 'none', mdDisplay: 'flex', alignItems: 'center', gap: '10px' }} className="desktop-menu">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                padding: '10px 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: activeTab === item.id ? 'var(--primary-blue)' : 'transparent',
                color: activeTab === item.id ? 'white' : 'var(--text-main)'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
          
          {user?.role === 'admin' && (
            <button onClick={() => handleNavClick('admin')} style={{ padding: '10px 15px', backgroundColor: activeTab === 'admin' ? '#e53e3e' : 'transparent', color: activeTab === 'admin' ? 'white' : '#e53e3e', border: '1px solid #e53e3e' }}>
              Panel Admin
            </button>
          )}

          {!user ? (
            <button onClick={() => handleNavClick('cuenta')} style={{ padding: '10px 15px', backgroundColor: 'var(--primary-green)', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <UserCheck size={16}/> Ingresar
            </button>
          ) : (
            <button onClick={handleLogout} style={{ padding: '10px 15px', backgroundColor: '#e53e3e', color: 'white' }}>
              Salir
            </button>
          )}

          <button onClick={toggleTheme} style={{ background: 'none', color: 'var(--text-main)', marginLeft: '10px' }}>
            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
          </button>
        </div>

        {/* MOVIL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="mobile-toggle">
          <button onClick={toggleTheme} style={{ background: 'none', color: 'var(--text-main)' }}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', color: 'var(--primary-blue)' }}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      {isOpen && (
        <div style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', padding: '15px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                width: '100%',
                padding: '12px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: activeTab === item.id ? 'var(--primary-blue)' : 'var(--bg-main)',
                color: activeTab === item.id ? 'white' : 'var(--text-main)'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}

          {user?.role === 'admin' && (
            <button onClick={() => handleNavClick('admin')} style={{ width: '100%', padding: '12px', backgroundColor: '#e53e3e', color: 'white' }}>
              ⚠️ Panel de Administración
            </button>
          )}

          {!user ? (
            <button onClick={() => handleNavClick('cuenta')} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--primary-green)', color: 'white' }}>
              Iniciar Sesión / Registrarse
            </button>
          ) : (
            <button onClick={handleLogout} style={{ width: '100%', padding: '12px', backgroundColor: '#e53e3e', color: 'white' }}>
              Cerrar Sesión ({user.name})
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
          .desktop-menu { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}