// src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Menu, X, BookOpen, ShoppingBag, Calendar, 
  Info, MapPin, UserCheck, ShoppingCart, Package, 
  BarChart3, LayoutDashboard, Heart 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, user, handleLogout, cartCount, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clientItems = [
    { id: 'inicio', label: 'Inicio', icon: <Info size={18} /> },
    { id: 'muro', label: 'Muro', icon: <BookOpen size={18} /> },
    { id: 'farmacia', label: 'Farmacia', icon: <ShoppingBag size={18} /> },
    { id: 'citas', label: 'Citas', icon: <Calendar size={18} /> },
    { id: 'mis-pedidos', label: 'Mis Pedidos', icon: <Package size={18} /> },
    { id: 'contacto', label: 'Contacto', icon: <MapPin size={18} /> },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'admin-citas', label: 'Citas', icon: <Calendar size={18} /> },
    { id: 'admin-pedidos', label: 'Pedidos', icon: <Package size={18} /> },
    { id: 'admin-reportes', label: 'Reportes', icon: <BarChart3 size={18} /> },
  ];

  const publicItems = [
    { id: 'inicio', label: 'Inicio', icon: <Info size={18} /> },
    { id: 'contacto', label: 'Contacto', icon: <MapPin size={18} /> },
  ];

  let navItems = publicItems;
  if (user && !isAdmin) navItems = clientItems;
  if (user && isAdmin) navItems = [...adminItems, ...clientItems.slice(0, 3)];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <nav style={{ 
      backgroundColor: 'var(--bg-card)', 
      borderBottom: '3px solid var(--primary-blue)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      width: '100%'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '10px 16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        minHeight: '60px'
      }}>
        
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <h1 
            onClick={() => handleNavClick('inicio')}
            style={{ 
              fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)', 
              color: 'var(--primary-blue)', 
              fontWeight: '800', 
              lineHeight: 1.2,
              cursor: 'pointer',
              margin: 0
            }}
          >
            <span style={{ display: 'inline-block' }}>
              Consultorio <span style={{ display: 'inline-block' }}>Clínico</span>
            </span>
            <br />
            <span style={{ color: 'var(--primary-green)', fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}>
              Ortega Castellón
            </span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div style={{ 
          display: isMobile ? 'none' : 'flex',
          alignItems: 'center', 
          gap: '4px',
          flexWrap: 'wrap'
        }}>
          {navItems.slice(0, isAdmin ? 4 : 5).map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: activeTab === item.id ? 'var(--primary-blue)' : 'transparent',
                color: activeTab === item.id ? 'white' : 'var(--text-main)',
                borderRadius: '8px',
                fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: activeTab === item.id ? 'bold' : 'normal',
                whiteSpace: 'nowrap'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}

          {user && isAdmin && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0 4px' }}>|</span>
          )}

          {!user ? (
            <button 
              onClick={() => handleNavClick('cuenta')} 
              style={{ 
                padding: '8px 16px', 
                backgroundColor: 'var(--primary-green)', 
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                whiteSpace: 'nowrap'
              }}
            >
              <UserCheck size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Ingresar
            </button>
          ) : (
            <button 
              onClick={handleLogout} 
              style={{ 
                padding: '6px 14px', 
                backgroundColor: '#ef4444', 
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                whiteSpace: 'nowrap'
              }}
            >
              Salir
            </button>
          )}

          <button 
            onClick={toggleTheme} 
            style={{ 
              background: 'none', 
              color: 'var(--text-main)', 
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div style={{ 
          display: isMobile ? 'flex' : 'none',
          alignItems: 'center', 
          gap: '12px'
        }}>
          {user && cartCount > 0 && (
            <span style={{ 
              backgroundColor: 'var(--primary-blue)', 
              color: 'white', 
              borderRadius: '50%', 
              padding: '1px 7px', 
              fontSize: '11px',
              fontWeight: 'bold',
              minWidth: '20px',
              textAlign: 'center'
            }}>
              {cartCount}
            </span>
          )}
          <button onClick={toggleTheme} style={{ background: 'none', color: 'var(--text-main)', border: 'none', padding: '4px' }}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} style={{ 
            background: 'none', 
            color: 'var(--primary-blue)', 
            border: 'none', 
            padding: '4px',
            position: 'relative',
            zIndex: 101
          }}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && isMobile && (
        <>
          {/* Overlay oscuro */}
          <div 
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 98,
              animation: 'fadeIn 0.3s ease'
            }}
          />
          
          {/* Menú deslizable */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: 'min(85%, 320px)',
            height: '100vh',
            backgroundColor: 'var(--bg-card)',
            zIndex: 99,
            padding: '20px 16px',
            overflowY: 'auto',
            boxShadow: '-4px 0 30px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {/* Header del menú */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '2px solid var(--border-color)'
            }}>
              <div>
                <p style={{ 
                  fontWeight: 'bold', 
                  fontSize: '1rem', 
                  color: 'var(--primary-blue)',
                  margin: 0
                }}>
                  Menú
                </p>
                {user && (
                  <p style={{ 
                    fontSize: '0.8rem', 
                    color: 'var(--text-muted)',
                    margin: 0
                  }}>
                    👋 Hola, {user.name}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'var(--bg-main)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items del menú */}
            {isAdmin && (
              <>
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: 'var(--text-muted)', 
                  fontWeight: 'bold', 
                  padding: '6px 0',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '4px'
                }}>
                  👑 Panel de Administración
                </div>
                {adminItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: activeTab === item.id ? 'var(--primary-blue)' : 'transparent',
                      color: activeTab === item.id ? 'white' : 'var(--text-main)',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: activeTab === item.id ? 'bold' : 'normal',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: 'var(--text-muted)', 
                  fontWeight: 'bold', 
                  padding: '12px 0 6px 0',
                  borderTop: '1px solid var(--border-color)',
                  marginTop: '4px'
                }}>
                  🏥 Cliente
                </div>
              </>
            )}

            {(isAdmin ? clientItems : navItems).map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: activeTab === item.id ? 'var(--primary-blue)' : 'transparent',
                  color: activeTab === item.id ? 'white' : 'var(--text-main)',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === item.id ? 'bold' : 'normal',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}

            <div style={{ 
              marginTop: 'auto',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)'
            }}>
              {!user ? (
                <button 
                  onClick={() => handleNavClick('cuenta')} 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: 'var(--primary-green)', 
                    color: 'white',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  Iniciar Sesión / Registrarse
                </button>
              ) : (
                <button 
                  onClick={handleLogout} 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#ef4444', 
                    color: 'white',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  Cerrar Sesión
                </button>
              )}
            </div>
          </div>

          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </>
      )}
    </nav>
  );
}