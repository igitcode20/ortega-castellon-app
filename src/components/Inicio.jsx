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
      
      {/* Misión, Visión y Valores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Misión */}
        <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
          <div style={{ 
            backgroundColor: 'var(--primary-blue)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Target size={28} color="white" />
          </div>
          <h3 style={{ color: 'var(--primary-blue)', marginBottom: '12px', fontSize: '1.3rem' }}>🎯 Misión</h3>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-muted)', margin: 0 }}>
            Brindar atención médica integral y acceso a medicamentos de calidad, 
            con calidez humana y tecnología innovadora, mejorando la salud y bienestar 
            de nuestra comunidad en Juigalpa y Chontales.
          </p>
        </div>

        {/* Visión */}
        <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
          <div style={{ 
            backgroundColor: 'var(--primary-green)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Eye size={28} color="white" />
          </div>
          <h3 style={{ color: 'var(--primary-green)', marginBottom: '12px', fontSize: '1.3rem' }}>👁️ Visión</h3>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-muted)', margin: 0 }}>
            Ser el consultorio médico y farmacia de referencia en Juigalpa, 
            reconocido por nuestra excelencia en el servicio, innovación digital 
            y compromiso con la salud de cada paciente que confía en nosotros.
          </p>
        </div>

        {/* Valores */}
        <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Shield size={28} color="white" />
          </div>
          <h3 style={{ color: 'var(--primary-blue)', marginBottom: '12px', fontSize: '1.3rem' }}>💎 Valores</h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            textAlign: 'left',
            display: 'inline-block'
          }}>
            <li style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span> Excelencia en el servicio
            </li>
            <li style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span> Calidez y empatía
            </li>
            <li style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span> Innovación tecnológica
            </li>
            <li style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span> Compromiso comunitario
            </li>
          </ul>
        </div>
      </div>

      {/* Header */}
      <header style={{ padding: '20px 0', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
          color: 'var(--primary-blue)', 
          margin: 0 
        }}>
          Consultorio Clínico y Farmacia
        </h1>
        <h2 style={{ 
          fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', 
          margin: '6px 0 0 0', 
          color: 'var(--primary-green)' 
        }}>
          Ortega Castellón
        </h2>
      </header>

      {/* Carrusel */}
      <section style={{ margin: '20px 0' }}>
        <div style={{ 
          borderRadius: '16px', 
          overflow: 'hidden', 
          height: 'clamp(220px, 40vw, 400px)', 
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
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 2
          }}>
            {images.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: '10px',
                  height: '10px',
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
      <section style={{ textAlign: 'center', margin: '40px 0' }}>
        <h3 style={{ 
          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', 
          color: 'var(--primary-blue)',
          marginBottom: '20px'
        }}>
          ¿Por qué nuestra Clínica Digital?
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', 
          gap: '20px', 
          marginTop: '20px' 
        }}>
          {[
            { 
              title: "Gestión Fácil", 
              desc: "Agenda tus citas sin salir de casa en minutos.",
              icon: <CheckCircle size={32} color="var(--primary-blue)" />
            },
            { 
              title: "Seguimiento", 
              desc: "Control total de tu historial y estado de citas.",
              icon: <Stethoscope size={32} color="var(--primary-green)" />
            },
            { 
              title: "Acceso a Farmacia", 
              desc: "Consulta disponibilidad de medicamentos online.",
              icon: <CheckCircle size={32} color="var(--primary-blue)" />
            }
          ].map((b, i) => (
            <div key={i} className="card" style={{ 
              padding: '24px 20px',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '12px' }}>{b.icon}</div>
              <h4 style={{ 
                margin: '10px 0', 
                color: 'var(--primary-blue)', 
                fontSize: '1.15rem' 
              }}>
                {b.title}
              </h4>
              <p style={{ 
                fontSize: '1rem', 
                margin: 0, 
                color: 'var(--text-muted)',
                lineHeight: '1.6'
              }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ubicación */}
      <div className="card" style={{ 
        textAlign: 'center', 
        marginTop: '20px',
        padding: '20px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <MapPin size={20} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Juigalpa, Chontales, Barrio San Antonio, segunda entrada, 1 Cuadra al Este.
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '10px',
          marginTop: '8px',
          flexWrap: 'wrap'
        }}>
          <Clock size={18} style={{ color: 'var(--primary-green)', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Lunes a Sábado: 8:00 AM - 6:00 PM
          </span>
        </div>
      </div>
    </div>
  );
};

export default Inicio;