// src/views/Admin/AdminCitas.jsx

import React, { useState, useEffect } from 'react';
import { Check, X, Clock, CalendarDays, User, Phone, Mail } from 'lucide-react';

export default function AdminCitas({ token, API_URL }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/appointments/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando citas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAppointments(); }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        loadAppointments();
        alert(`✅ Cita ${status === 'confirmed' ? 'confirmada' : 'rechazada'} exitosamente`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al actualizar');
    }
  };

  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    return appointments.filter(a => a.status === filter);
  };

  const getStatusBadge = (status) => {
    const map = {
      'pending': { color: '#f59e0b', label: '⏳ Pendiente' },
      'confirmed': { color: '#22c55e', label: '✅ Confirmada' },
      'rejected': { color: '#ef4444', label: '❌ Rechazada' }
    };
    return map[status] || { color: '#94a3b8', label: status };
  };

  const filtered = getFilteredAppointments();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ color: 'var(--primary-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalendarDays size={24} /> Gestión de Citas
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'pending', 'confirmed', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: filter === f ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                backgroundColor: filter === f ? 'var(--primary-blue)' : 'transparent',
                color: filter === f ? 'white' : 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: filter === f ? 'bold' : 'normal'
              }}
            >
              {f === 'all' ? '📋 Todas' : f === 'pending' ? '⏳ Pendientes' : f === 'confirmed' ? '✅ Confirmadas' : '❌ Rechazadas'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>⏳ Cargando citas...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No hay citas {filter !== 'all' ? `con estado "${filter}"` : ''}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(cita => (
            <div key={cita._id} style={{
              backgroundColor: 'var(--bg-card)',
              padding: '18px 20px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {cita.patientId?.name || 'Paciente'}
                  </span>
                  <span style={{
                    backgroundColor: getStatusBadge(cita.status).color + '20',
                    color: getStatusBadge(cita.status).color,
                    padding: '2px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {getStatusBadge(cita.status).label}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--primary-blue)' }}>{cita.specialty}</span>
                  {' • '}
                  📅 {cita.date} ⏰ {cita.time}
                </div>
                {cita.patientId && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {cita.patientId.phone && <span>📱 {cita.patientId.phone} </span>}
                    {cita.patientId.email && <span>📧 {cita.patientId.email}</span>}
                  </div>
                )}
              </div>

              {cita.status === 'pending' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleUpdateStatus(cita._id, 'confirmed')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#22c55e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Check size={16} /> Aceptar
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(cita._id, 'rejected')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <X size={16} /> Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}