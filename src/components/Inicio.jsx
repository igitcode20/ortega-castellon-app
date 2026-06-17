// src/views/Inicio.jsx

import React, { useState, useEffect } from 'react';
import { Stethoscope, Clock, MapPin, CheckCircle, Target, Eye, Shield } from 'lucide-react';

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

  return (
    <div style={{ 
      color: 'var(--text-main)',
      padding: '0 4px',
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      
      {/* Misión, Visión y Valores - Responsivo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Misión */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ 
            backgroundColor: 'var(--primary-blue)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <Target size={24} color="white" />
          </div>
          <h3 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>🎯 Misión</h3>
          <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', lineHeight: '1.6', color: 'var(--text-muted)', margin: 0 }}>
            Brindar atención médica integral y acceso a medicamentos de calidad, 
            con calidez humana y tecnología innovadora.
          </p>
        </div>

        {/* Visión */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ 
            backgroundColor: 'var(--primary-green)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <Eye size={24} color="white" />
          </div>
          <h3 style={{ color: 'var(--primary-green)', marginBottom: '8px', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>👁️ Visión</h3>
          <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', lineHeight: '1.6', color: 'var(--text-muted)', margin: 0 }}>
            Ser el consultorio médico y farmacia de referencia en Juigalpa, 
            reconocido por excelencia, innovación y compromiso.
          </p>
        </div>

        {/* Valores */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <Shield size={24} color="white" />
          </div>
          <h3 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>💎 Valores</h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
            color: 'var(--text-muted)',
            textAlign: 'left',
            display: 'inline-block'
          }}>
            <li style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>✓</span> Excelencia en el servicio
            </li>
            <li style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>✓</span> Calidez y empatía
            </li>
            <li style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>✓</span> Innovación tecnológica
            </li>
            <li style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>✓</span> Compromiso comunitario
            </li>
          </ul>
        </div>
      </div>

      {/* Header */}
      <header style={{ padding: '16px 0', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', 
          color: 'var(--primary-blue)', 
          margin: 0 
        }}>
          Consultorio Clínico y Farmacia
        </h1>
        <h2 style={{ 
          fontSize: 'clamp(1rem, 3vw, 1.4rem)', 
          margin: '4px 0 0 0', 
          color: 'var(--primary-green)' 
        }}>
          Ortega Castellón
        </h2>
      </header>

      {/* Carrusel - Responsivo */}
      <section style={{ margin: '16px 0' }}>
        <div style={{ 
          borderRadius: '12px', 
          overflow: 'hidden', 
          height: 'clamp(200px, 40vw, 350px)', 
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          {images.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt="Local" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                position: 'absolute', 
                transition: 'opacity 0.8s ease', 
                opacity: currentSlide === index ? 1 : 0 
              }} 
            />
          ))}
          {/* Indicadores */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 2
          }}>
            {images.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: currentSlide === idx ? 'white' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section style={{ textAlign: 'center', margin: '30px 0' }}>
        <h3 style={{ 
          fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)', 
          color: 'var(--primary-blue)',
          marginBottom: '16px'
        }}>
          ¿Por qué nuestra Clínica Digital?
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', 
          gap: '16px', 
          marginTop: '16px' 
        }}>
          {[
            { 
              title: "Gestión Fácil", 
              desc: "Agenda tus citas sin salir de casa en minutos.",
              icon: <CheckCircle size={28} color="var(--primary-blue)" />
            },
            { 
              title: "Seguimiento", 
              desc: "Control total de tu historial y estado de citas.",
              icon: <Stethoscope size={28} color="var(--primary-green)" />
            },
            { 
              title: "Acceso a Farmacia", 
              desc: "Consulta disponibilidad de medicamentos online.",
              icon: <CheckCircle size={28} color="var(--primary-blue)" />
            }
          ].map((b, i) => (
            <div key={i} className="card" style={{ 
              padding: '20px 16px',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '8px' }}>{b.icon}</div>
              <h4 style={{ margin: '8px 0', color: 'var(--primary-blue)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>{b.title}</h4>
              <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', margin: 0, color: 'var(--text-muted)' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ubicación - Responsive */}
      <div className="card" style={{ 
        textAlign: 'center', 
        marginTop: '16px',
        padding: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <MapPin size={18} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
            Juigalpa, Chontales, Barrio San Antonio, segunda entrada, 1 Cuadra al Este.
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '8px',
          marginTop: '6px',
          flexWrap: 'wrap'
        }}>
          <Clock size={16} style={{ color: 'var(--primary-green)', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>
            Lunes a Sábado: 8:00 AM - 6:00 PM
          </span>
        </div>
      </div>
    </div>
  );
};

export default Inicio;