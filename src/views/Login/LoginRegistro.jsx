import React, { useState } from 'react';
import { User, Lock, Mail } from 'lucide-react';

export default function LoginRegistro({ API_URL, setUser, setToken, setActiveTab }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password, role: 'patient' };

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    
    if (isLogin) {
      if (data.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setActiveTab('inicio');
      } else alert(data.message);
    } else {
      if (res.ok) {
        alert("¡Tu cuenta de Paciente se registró con éxito! Ya podés iniciar sesión, mae.");
        setIsLogin(true);
      } else alert("Error al procesar el registro.");
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto', backgroundColor: 'var(--bg-card)', padding: '35px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--primary-blue)' }}>
        {isLogin ? "🔑 Iniciar Sesión" : "📝 Crear Cuenta Paciente"}
      </h2>

      <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', display: 'block' }}>Nombre Completo:</label>
            <input type="text" placeholder="Ej: Juan Pérez" value={name} onChange={e => setName(e.target.value)} required />
          </div>
        )}
        
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', display: 'block' }}>Correo Electrónico:</label>
          <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', display: 'block' }}>Contraseña:</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>

        <button type="submit" style={{ backgroundColor: isLogin ? 'var(--primary-blue)' : 'var(--primary-green)', color: 'white', padding: '14px', marginTop: '10px', fontSize: '1rem' }}>
          {isLogin ? "Ingresar al Portal" : "Registrarme"}
        </button>
      </form>

      <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        {isLogin ? (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            ¿No tenés cuenta todavía?{' '}
            <span onClick={() => setIsLogin(false)} style={{ color: 'var(--primary-green)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
              Registrate aquí
            </span>
          </p>
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            ¿Ya tenés cuenta registrada?{' '}
            <span onClick={() => setIsLogin(true)} style={{ color: 'var(--primary-blue)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
              Iniciá sesión acá
            </span>
          </p>
        )}
      </div>
    </div>
  );
}