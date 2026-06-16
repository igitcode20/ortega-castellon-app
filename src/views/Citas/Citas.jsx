import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, X, PlusCircle, User, Stethoscope } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://consultorio-ortega-backend.onrender.com/api/appointments';

const Citas = () => {
  const [appointments, setAppointments] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [userRole, setUserRole] = useState('patient');
  const [loading, setLoading] = useState(true);
  const [newCita, setNewCita] = useState({ specialty: '', date: '', time: '' });

  // --- Estilos CSS en objeto para mantenerlo limpio ---
  const styles = {
    container: { padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' },
    card: { background: '#fff', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' },
    button: { background: '#0084cc', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    input: { padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', flex: '1' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
    th: { textAlign: 'left', padding: '1rem', borderBottom: '2px solid #eee' },
    td: { padding: '1rem', borderBottom: '1px solid #eee' }
  };

  const fetchCitasData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const user = JSON.parse(localStorage.getItem('user'));
      setUserRole(user?.role);
      const res = await axios.get(`${API_URL}/all`, config);
      user?.role === 'admin' ? setAppointments(res.data) : setMyAppointments(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCitasData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/create`, newCita, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      alert("✅ Solicitud enviada con éxito");
      setNewCita({ specialty: '', date: '', time: '' });
      fetchCitasData();
    } catch (err) { alert("Error al agendar"); }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#0084cc', marginBottom: '1.5rem' }}>Gestión de Citas</h1>

      {userRole === 'patient' && (
        <>
          <div style={styles.card}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><PlusCircle color="#0084cc" /> Agendar Nueva Cita</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <select style={styles.input} onChange={(e) => setNewCita({...newCita, specialty: e.target.value})} required>
                <option value="">Especialidad</option>
                <option>Consulta General</option><option>Pediatría</option><option>Ginecología</option>
              </select>
              <input type="date" style={styles.input} onChange={(e) => setNewCita({...newCita, date: e.target.value})} required />
              <input type="time" style={styles.input} onChange={(e) => setNewCita({...newCita, time: e.target.value})} required />
              <button style={styles.button} type="submit">Solicitar</button>
            </form>
          </div>

          <h3>Mis Citas</h3>
          {myAppointments.map(c => (
            <div key={c._id} style={{ ...styles.card, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{c.specialty}</strong><br/>
                <small style={{ color: '#666' }}><Calendar size={14}/> {c.date} • <Clock size={14}/> {c.time}</small>
              </div>
              <span style={{ padding: '5px 10px', borderRadius: '20px', background: c.status === 'confirmed' ? '#dcfce7' : '#fef9c3' }}>
                {c.status}
              </span>
            </div>
          ))}
        </>
      )}

      {userRole === 'admin' && (
        <div style={styles.card}>
          <h3>Panel de Administración</h3>
          <table style={styles.table}>
            <thead><tr><th>Paciente</th><th>Esp.</th><th>Fecha</th><th>Acciones</th></tr></thead>
            <tbody>
              {appointments.map(c => (
                <tr key={c._id}>
                  <td>{c.patientId?.name}</td>
                  <td>{c.specialty}</td>
                  <td>{c.date}</td>
                  <td>
                    <button style={{ background: '#22c55e', color: 'white', border: 'none', padding: '5px', borderRadius: '5px', marginRight: '5px' }} onClick={() => console.log('Confirmar')}>Confirmar</button>
                    <button style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px', borderRadius: '5px' }}>Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Citas;