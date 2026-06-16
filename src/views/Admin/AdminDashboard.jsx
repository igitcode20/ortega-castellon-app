import React, { useState, useEffect } from 'react';
import { Check, X, User, Clock, Heart, Users, CalendarDays } from 'lucide-react';

export default function AdminDashboard({ token, API_URL }) {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ likes: 0, users: 0, pending: 0 });
  const [systemUsers, setSystemUsers] = useState([]);

  const loadDashboardData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // 1. Cargar todas las citas del sistema
      const resApp = await fetch(`${API_URL}/appointments/all`, { headers });
      const dataApp = await resApp.json();
      const appointmentsArr = Array.isArray(dataApp) ? dataApp : [];
      setAppointments(appointmentsArr);

      // 2. Extraer reacciones del muro dinámicamente
      const resPosts = await fetch(`${API_URL}/posts`);
      const dataPosts = await resPosts.json();
      const totalLikes = Array.isArray(dataPosts) ? dataPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0) : 0;
      
      // 3. Cargar el registro de pacientes
      const resUsr = await fetch(`${API_URL}/appointments/users`, { headers });
      const dataUsr = await resUsr.json();
      const usersArr = Array.isArray(dataUsr) ? dataUsr : [];
      setSystemUsers(usersArr);

      // Actualizar el estado analítico de la cabecera
      setStats({
        likes: totalLikes,
        users: usersArr.length,
        pending: appointmentsArr.filter(a => a.status === 'pending' || !a.status).length
      });

    } catch (err) {
      console.error("Error al cargar el panel de control:", err);
    }
  };

  useEffect(() => {
    if (token) loadDashboardData();
  }, [token]);

  // Función fluida para cambiar el estado sin recargar la pantalla completa
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        loadDashboardData(); // Refresco reactivo instantáneo de datos
      } else {
        alert("Ocurrió un error al actualizar el estado de la consulta.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending' || !a.status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.4s ease' }}>
      
      {/* CONTENEDOR ESTADÍSTICO DE MONITOREO FLUIDO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard icon={<Heart color="#ef4444" size={20} fill="#ef4444"/>} label="Reacciones en Muro" value={stats.likes} bgGrad="linear-gradient(135deg, #fff5f5, #fed7d7)" />
        <StatCard icon={<Users color="#0284c7" size={20}/>} label="Pacientes Activos" value={stats.users} bgGrad="linear-gradient(135deg, #f0f9ff, #e0f2fe)" />
        <StatCard icon={<Clock color="#b45309" size={20}/>} label="Citas en Espera" value={stats.pending} bgGrad="linear-gradient(135deg, #fffbeb, #fef3c7)" />
      </div>

      {/* DISEÑO EN PARALELO DE CONTROL CLÍNICO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
        
        {/* BANDEJA DE ENTRADA DE SOLICITUDES (PANELES SIN MODALES) */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
            <CalendarDays size={20}/> Bandeja de Citas por Confirmar
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '380px', overflowY: 'auto' }}>
            {pendingAppointments.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', padding: '40px 0' }}>
                No existen nuevas solicitudes de pacientes, Doctora.
              </p>
            ) : (
              pendingAppointments.map(cita => (
                <div key={cita._id} style={{ padding: '15px', backgroundColor: 'var(--bg-main)', borderRadius: '15px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      {/* Mostramos de forma explícita el nombre del paciente obtenido del populate */}
                      <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-main)', display: 'block' }}>
                        {cita.patientId?.name || 'Paciente Externo'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: '600' }}>{cita.specialty}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12}/> {cita.date} | {cita.time}
                    </span>
                  </div>
                  
                  {/* BOTONERA REACTIVA */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button onClick={() => handleUpdateStatus(cita._id, 'confirmed')} style={{ flex: 1, backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.2s ease' }}>
                      <Check size={14}/> Aceptar
                    </button>
                    <button onClick={() => handleUpdateStatus(cita._id, 'rejected')} style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.2s ease' }}>
                      <X size={14}/> Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DIRECTORIO COMPACTO DE PACIENTES */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
            <User size={20}/> Directorio Clínico de Pacientes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
            {systemUsers.map(u => (
              <div key={u._id} style={{ padding: '12px 15px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>{u.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</span>
                </div>
                <span style={{ fontSize: '0.7rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Paciente</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

// Componente interno para estructurar las tarjetas del Dashboard
function StatCard({ icon, label, value, bgGrad }) {
  return (
    <div style={{ background: bgGrad, padding: '22px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid rgba(0,0,0,0.01)', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
      <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.3px' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{value}</div>
      </div>
    </div>
  );
}