import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';

export default function Contacto() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', margin: '20px 0' }}>
      
      {/* TARJETA DIRECCIÓN */}
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h3 style={{ color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>📍 Dirección Exacta</h3>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.5' }}>
          Juigalpa Chontales, Barrio San Antonio, segunda entrada, 1 Cuadra al Este.
        </p>
        <div style={{ marginTop: '10px' }}>
          <a href="tel:84334235" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary-blue)', color: 'white', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            <Phone size={18} /> Llamar al: 84334235
          </a>
        </div>
      </div>

      {/* MAPA DETALLADO */}
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ color: 'var(--primary-blue)' }}>🗺️ Croquis de Acceso</h3>
        <div style={{ width: '100%', flex: 1, minHeight: '150px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '2px dashed var(--primary-green)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px', textAlign: 'center' }}>
          <MapPin size={32} style={{ color: '#e53e3e', marginBottom: '8px' }} />
          <span style={{ fontWeight: 'bold' }}>Consultorio Ortega Castellón</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Barrio San Antonio, Juigalpa</span>
        </div>
      </div>

      {/* HORARIOS */}
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContet: 'center', gap: '10px' }}>
        <h3 style={{ color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={20}/> Horarios de Atención</h3>
        <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Lunes a Sábado:</p>
        <p style={{ color: 'var(--primary-green)', fontSize: '1.3rem', fontWeight: '800' }}>8:00 AM - 6:00 PM</p>
      </div>

    </div>
  );
}