import React, { useState, useEffect } from 'react';
import { Stethoscope, Clock, MapPin, UserPlus, LogIn, CheckCircle, Lock } from 'lucide-react';

const Inicio = ({ theme, setActiveTab }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = ["/images/local1.jpeg", "/images/local2.jpg", "/images/local3.jpg"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const isDark = theme === 'dark';
  const colors = {
    text: isDark ? '#f1f5f9' : '#334155',
    cardBg: isDark ? '#1e293b' : '#f8fafc',
    accent: '#0084cc',
    notifBg: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
    notifBorder: isDark ? '#334155' : '#bae6fd'
  };

  return (
    <div style={{ color: colors.text }}>
      {/* Notificación elegante y moderna */}
      <div style={{ 
        margin: '20px auto',
        padding: '25px',
        maxWidth: '800px',
        background: colors.notifBg,
        border: `1px solid ${colors.notifBorder}`,
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: '0.3s'
      }}>
        <div style={{ color: colors.accent, marginBottom: '10px' }}>
          <Lock size={30} />
        </div>
        <h3 style={{ margin: '0 0 10px 0', color: isDark ? '#f1f5f9' : '#0369a1' }}>¡Bienvenido a tu Clínica Digital!</h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '1rem', color: isDark ? '#94a3b8' : '#075985' }}>
          Regístrate o inicia sesión para desbloquear el control de tus citas, acceso a farmacia y muro informativo.
        </p>
        <button onClick={() => setActiveTab('cuenta')} style={{ 
          padding: '10px 25px', 
          background: colors.accent, 
          color: 'white', 
          border: 'none', 
          borderRadius: '50px', 
          fontWeight: 'bold',
          cursor: 'pointer' 
        }}>
          Comenzar ahora
        </button>
      </div>

      <header style={{ padding: '20px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', color: colors.accent, margin: 0 }}>Consultorio Clínico y Farmacia</h1>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Ortega Castellón</h2>
      </header>

      <section style={{ margin: '20px 0' }}>
        <div style={{ borderRadius: '15px', overflow: 'hidden', height: '350px', position: 'relative' }}>
          {images.map((img, index) => (
            <img key={index} src={img} alt="Local" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', transition: 'opacity 1s', opacity: currentSlide === index ? 1 : 0 }} />
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', margin: '40px 0' }}>
        <h3 style={{ fontSize: '1.6rem', color: colors.accent }}>¿Por qué nuestra Clínica Digital?</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
          {[
            { title: "Gestión Fácil", desc: "Agenda tus citas sin salir de casa." },
            { title: "Seguimiento", desc: "Control total de tu historial y estado de citas." },
            { title: "Acceso a Farmacia", desc: "Consulta disponibilidad de medicamentos online." }
          ].map((b, i) => (
            <div key={i} style={{ padding: '20px', background: colors.cardBg, borderRadius: '10px', width: '250px', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }}>
              <CheckCircle color={colors.accent} size={24} />
              <h4 style={{ margin: '10px 0' }}>{b.title}</h4>
              <p style={{ fontSize: '0.9rem' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div style={{ textAlign: 'center', marginTop: '30px', color: '#64748b' }}>
        <MapPin size={18} /> Juigalpa, Chontales, Barrio San Antonio, segunda entrada, 1 Cuadra al Este.
      </div>
    </div>
  );
};

export default Inicio;