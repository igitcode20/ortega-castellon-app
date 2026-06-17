// src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Menu, X, BookOpen, ShoppingBag, Calendar, 
  Info, MapPin, UserCheck, ShoppingCart, Package, 
  BarChart3, LayoutDashboard, Heart, LogOut, ChevronDown, ChevronUp,
  PlusCircle
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, user, handleLogout, cartCount, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Items principales del cliente
  const clientItems = [
    { id: 'inicio', label: 'Inicio', icon: <Info size={18} /> },
    { id: 'muro', label: 'Muro', icon: <BookOpen size={18} /> },
    { id: 'farmacia', label: 'Farmacia', icon: <ShoppingBag size={18} /> },
    { id: 'citas', label: 'Citas', icon: <Calendar size={18} /> },
    { id: 'mis-pedidos', label: 'Mis Pedidos', icon: <Package size={18} /> },
    { id: 'contacto', label: 'Contacto', icon: <MapPin size={18} /> },
  ];

  // Items de admin (siempre visibles)
  const adminItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'admin-citas', label: 'Citas', icon: <Calendar size={18} /> },
    { id: 'admin-pedidos', label: 'Pedidos', icon: <Package size={18} /> },
    { id: 'admin-reportes', label: 'Reportes', icon: <BarChart3 size={18} /> },
  ];

  // Items extras que aparecen con "Ver más" (Muro y Farmacia para admin)
  const moreItems = [
    { id: 'muro', label: 'Muro', icon: <BookOpen size={18} /> },
    { id: 'farmacia', label: 'Farmacia', icon: <ShoppingBag size={18} /> },
  ];

  const publicItems = [
    { id: 'inicio', label: 'Inicio', icon: <Info size={18} /> },
    { id: 'contacto', label: 'Contacto', icon: <MapPin size={18} /> },
  ];

  // Construir navItems según rol
  let navItems = publicItems;
  if (user && !isAdmin) navItems = clientItems;
  if (user && isAdmin) {
    // Admin: mostrar adminItems + botón Ver más + (si showMore) moreItems
    navItems = [
      ...adminItems,
      { 
        id: 'ver-mas', 
        label: showMore ? 'Ver menos' : 'Ver más', 
        icon: showMore ? <ChevronUp size={18} /> : <ChevronDown size={18} />,
        isMore: true 
      },
      ...(showMore ? moreItems : [])
    ];
  }

  const handleNavClick = (tabId) => {
    if (tabId === 'ver-mas') {
      setShowMore(!showMore);
      return;
    }
    setActiveTab(tabId);
    setIsOpen(false);
  };

  // Items para el menú móvil
  const getMobileItems = () => {
    if (!user) return publicItems;
    if (isAdmin) {
      return [...adminItems, ...moreItems, ...clientItems];
    }
    return clientItems;
  };

  const mobileItems = getMobileItems();

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
              fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', 
              color: 'var(--primary-blue)', 
              fontWeight: '800', 
              lineHeight: 1.2,
              cursor: 'pointer',
              margin: 0
            }}
          >
            <span>Consultorio Clínico</span>
            <br />
            <span style={{ color: 'var(--primary-green)', fontSize: 'clamp(0.75rem, 1.6vw, 1rem)' }}>
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
          {navItems.map(item => {
            if (item.isMore) {
              return (
                <button
                  key="ver-mas"
                  onClick={() => handleNavClick('ver-mas')}
                  style={{
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: showMore ? 'var(--primary-blue)' : 'transparent',
                    color: showMore ? 'white' : 'var(--text-muted)',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
                    border: showMore ? 'none' : '1px dashed var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    fontWeight: showMore ? 'bold' : 'normal'
                  }}
                >
                  {item.icon} {item.label}
                </button>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: activeTab === item.id ? 'var(--primary-blue)' : 'transparent',
                  color: activeTab === item.id ? 'white' : 'var(--text-main)',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: activeTab === item.id ? 'bold' : '500',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.icon} {item.label}
              </button>
            );
          })}

          {user && isAdmin && (
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', padding: '0 4px' }}>|</span>
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
                fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
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
                fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
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
          gap: '10px'
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
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && isMobile && (
        <>
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
          
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: 'min(85%, 320px)',
            height: '100vh',
            backgroundColor: 'var(--bg-card)',
            zIndex: 99,
            padding: '20px 16px 24px 16px',
            overflowY: 'auto',
            boxShadow: '-4px 0 30px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
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
                  fontSize: '1.1rem', 
                  color: 'var(--primary-blue)',
                  margin: 0
                }}>
                  Menú
                </p>
                {user && (
                  <p style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--text-muted)',
                    margin: '2px 0 0 0'
                  }}>
                    👋 Hola, <strong style={{ color: 'var(--primary-blue)' }}>{user.name}</strong>
                  </p>
                )}
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'var(--bg-main)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {isAdmin && (
                <>
                  <div style={{ 
                    fontSize: '0.65rem', 
                    color: 'var(--text-muted)', 
                    fontWeight: 'bold', 
                    padding: '6px 4px 4px 4px',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
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
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: activeTab === item.id ? 'bold' : '500',
                        fontSize: '0.95rem'
                      }}
                    >
                      <span style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  ))}
                  
                  {/* Separador para "Ver más" en móvil */}
                  <div style={{ 
                    fontSize: '0.65rem', 
                    color: 'var(--text-muted)', 
                    fontWeight: 'bold', 
                    padding: '12px 4px 4px 4px',
                    borderTop: '1px solid var(--border-color)',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    📱 Contenido
                  </div>
                </>
              )}

              {/* Mostrar todos los items en móvil (incluyendo Muro y Farmacia) */}
              {(isAdmin ? [...moreItems, ...clientItems] : mobileItems).map(item => (
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
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: activeTab === item.id ? 'bold' : '500',
                    fontSize: '0.95rem'
                  }}
                >
                  <span style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}

              {/* Cerrar Sesión */}
              {user && (
                <div style={{ 
                  marginTop: 'auto',
                  paddingTop: '12px',
                  borderTop: '2px solid var(--border-color)'
                }}>
                  <button 
                    onClick={handleLogout} 
                    style={{ 
                      width: '100%', 
                      padding: '14px', 
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      borderRadius: '8px',
                      border: '1px solid #fecaca',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <LogOut size={18} /> Cerrar Sesión
                  </button>
                </div>
              )}

              {!user && (
                <div style={{ 
                  marginTop: 'auto',
                  paddingTop: '12px',
                  borderTop: '2px solid var(--border-color)'
                }}>
                  <button 
                    onClick={() => handleNavClick('cuenta')} 
                    style={{ 
                      width: '100%', 
                      padding: '14px', 
                      backgroundColor: 'var(--primary-green)', 
                      color: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.95rem'
                    }}
                  >
                    Iniciar Sesión / Registrarse
                  </button>
                </div>
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