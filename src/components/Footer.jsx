import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', marginTop: 'auto', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        
        {/* DIRECCIÓN Y LLAMADA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ color: 'var(--primary-blue)' }}>📍 Información de Contacto</h3>
          <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.4' }}>
            <MapPin size={22} style={{ color: 'var(--primary-green)', flexShrink: 0 }} />
            <span>Dirección: Juigalpa Chontales, Barrio San Antonio, segunda entrada, 1 Cuadra al Este.</span>
          </p>
          <div style={{ marginTop: '10px' }}>
            <a href="tel:84334235" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary-blue)', color: 'white', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              <Phone size={18} /> Llamar Directo: 84334235
            </a>
          </div>
        </div>

        {/* MINIMAPA / CROQUIS SIMULADO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ color: 'var(--primary-blue)' }}>🗺️ Ubicación del Consultorio</h3>
          <div style={{ width: '100%', height: '140px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '2px dashed var(--primary-blue)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px', textAlign: 'center' }}>
            <MapPin size={28} style={{ color: '#e53e3e', marginBottom: '5px' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Bo. San Antonio, Juigalpa</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Segunda entrada, 1c. al Este</span>
          </div>
        </div>

        {/* HORARIOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ color: 'var(--primary-blue)' }}>⏰ Horario de Atención</h3>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <Clock size={18} style={{ color: 'var(--primary-green)' }} />
            <span>Lunes a Sábado: 8:00 AM - 6:00 PM</span>
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>
            © 2026 Consultorio Clínico y Farmacia Ortega Castellón. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}