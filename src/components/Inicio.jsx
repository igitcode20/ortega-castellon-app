// src/views/Inicio.jsx

import { useState, useEffect } from 'react';
import { Stethoscope, Clock, MapPin, CheckCircle, Target, Eye, Shield, Heart, Users } from 'lucide-react';

const Inicio = ({ setActiveTab }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = ["/images/local1.jpeg", "/images/local2.jpg", "/images/local3.jpg"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // set active tab on mount to avoid "setActiveTab is defined but never used" warning
  useEffect(() => {
    if (typeof setActiveTab === 'function') setActiveTab('inicio');
  }, [setActiveTab]);

  return (
    <div style={{ 
      color: 'var(--text-main)',
      padding: '0 4px',
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      
      {/* Misión, Visión y Valores - MEJORADOS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Misión */}
        <div className="card card-glass" style={{ 
          textAlign: 'center', 
          padding: '28px 20px',
          borderTop: '4px solid var(--primary-blue)'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 4px 20px rgba(0, 132, 204, 0.3)'
          }}>
            <Target size={28} color="white" />
          </div>
          <h3 style={{ color: 'var(--primary-blue)', marginBottom: '10px', fontSize: '1.2rem' }}>
            🎯 Misión
          </h3>
          <p style={{ 
            fontSize: '0.95rem', 
            lineHeight: '1.7', 
            color: 'var(--text-muted)',
            margin: 0
          }}>
            Brindar atención médica integral y acceso a medicamentos de calidad, 
            con <strong style={{ color: 'var(--primary-blue)' }}>calidez humana</strong> y 
            <strong style={{ color: 'var(--primary-green)' }}> tecnología innovadora</strong>, 
            mejorando la salud y bienestar de nuestra comunidad en Juigalpa y Chontales.
          </p>
        </div>

        {/* Visión */}
        <div className="card card-glass" style={{ 
          textAlign: 'center', 
          padding: '28px 20px',
          borderTop: '4px solid var(--primary-green)'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-green), var(--primary-green-dark))',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 4px 20px rgba(140, 198, 63, 0.3)'
          }}>
            <Eye size={28} color="white" />
          </div>
          <h3 style={{ color: 'var(--primary-green)', marginBottom: '10px', fontSize: '1.2rem' }}>
            👁️ Visión
          </h3>
          <p style={{ 
            fontSize: '0.95rem', 
            lineHeight: '1.7', 
            color: 'var(--text-muted)',
            margin: 0
          }}>
            Ser el consultorio médico y farmacia de referencia en Juigalpa, 
            reconocido por nuestra <strong style={{ color: 'var(--primary-green)' }}>excelencia</strong> en el servicio, 
            <strong style={{ color: 'var(--primary-blue)' }}> innovación digital</strong> y 
            compromiso con la salud de cada paciente que confía en nosotros.
          </p>
        </div>

        {/* Valores */}
        <div className="card card-glass" style={{ 
          textAlign: 'center', 
          padding: '28px 20px',
          borderTop: '4px solid #8b5cf6'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
          }}>
            <Shield size={28} color="white" />
          </div>
          <h3 style={{ color: '#8b5cf6', marginBottom: '10px', fontSize: '1.2rem' }}>
            💎 Valores
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            textAlign: 'left',
            fontSize: '0.9rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '4px 0',
              color: 'var(--text-muted)'
            }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.1rem' }}>✓</span>
              Excelencia
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '4px 0',
              color: 'var(--text-muted)'
            }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.1rem' }}>✓</span>
              Calidez humana
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '4px 0',
              color: 'var(--text-muted)'
            }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.1rem' }}>✓</span>
              Innovación
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '4px 0',
              color: 'var(--text-muted)'
            }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.1rem' }}>✓</span>
              Compromiso
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header style={{ padding: '16px 0', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', 
          color: 'var(--primary-blue)', 
          margin: 0,
          fontWeight: '800'
        }}>
          Consultorio Clínico y Farmacia
        </h1>
        <h2 style={{ 
          fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', 
          margin: '4px 0 0 0', 
          color: 'var(--primary-green)',
          fontWeight: '700'
        }}>
          Ortega Castellón
        </h2>
      </header>

      {/* Carrusel con efecto */}
      <section style={{ margin: '20px 0' }}>
        <div style={{ 
          borderRadius: '16px', 
          overflow: 'hidden', 
          height: 'clamp(200px, 40vw, 380px)', 
          position: 'relative',
          boxShadow: 'var(--shadow-lg)'
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
            gap: '8px',
            zIndex: 2
          }}>
            {images.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: currentSlide === idx ? 'white' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  boxShadow: currentSlide === idx ? '0 0 20px rgba(255,255,255,0.3)' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section style={{ textAlign: 'center', margin: '32px 0' }}>
        <h3 style={{ 
          fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', 
          color: 'var(--primary-blue)',
          marginBottom: '20px'
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
              icon: <Users size={28} color="var(--primary-blue)" />
            }
          ].map((b, i) => (
            <div key={i} className="card" style={{ 
              padding: '20px 16px',
              textAlign: 'center',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ 
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                {b.icon}
              </div>
              <h4 style={{ 
                margin: '8px 0', 
                color: 'var(--primary-blue)',
                fontSize: '1.05rem'
              }}>
                {b.title}
              </h4>
              <p style={{ 
                fontSize: '0.9rem', 
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
        padding: '20px',
        background: 'linear-gradient(135deg, var(--bg-card), var(--bg-main))'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <MapPin size={18} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
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
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Lunes a Sábado: 8:00 AM - 6:00 PM
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
          <Heart size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Tu salud es nuestra prioridad
          </span>
        </div>
      </div>
    </div>
  );
};

export default Inicio;