// src/views/Login/LoginRegistro.jsx

import React, { useState } from 'react';
import { User, Lock, Mail, Phone, MapPin } from 'lucide-react';

export default function LoginRegistro({ API_URL, setUser, setToken, setActiveTab }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    department: 'Juigalpa',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const departments = ['Juigalpa', 'Chontales', 'Managua', 'Santo Domingo', 'Santo Tomás', 'El Lovago', 'La Guinea'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
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
          alert(`✅ ¡Bienvenido ${data.user.name}!`);
        } else {
          alert(data.message || '❌ Error al iniciar sesión');
        }
      } else {
        if (res.ok) {
          alert('✅ ¡Tu cuenta se registró con éxito! Ya podés iniciar sesión.');
          setIsLogin(true);
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            department: 'Juigalpa',
            address: ''
          });
        } else {
          alert(data.message || '❌ Error al procesar el registro.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '450px', 
      margin: '40px auto', 
      backgroundColor: 'var(--bg-card)', 
      padding: '35px', 
      borderRadius: '16px', 
      border: '1px solid var(--border-color)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--primary-blue)' }}>
        {isLogin ? '🔑 Iniciar Sesión' : '📝 Crear Cuenta'}
      </h2>

      <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
                <User size={16} style={{ display: 'inline', marginRight: '5px' }} /> Nombre Completo *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ej: Juan Pérez"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
                <Phone size={16} style={{ display: 'inline', marginRight: '5px' }} /> Número de Teléfono *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Ej: 84334235"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
                <MapPin size={16} style={{ display: 'inline', marginRight: '5px' }} /> Departamento *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
                Dirección (opcional)
              </label>
              <input
                type="text"
                name="address"
                placeholder="Barrio, calle, casa #"
                value={formData.address}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
            </div>
          </>
        )}
        
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
            <Mail size={16} style={{ display: 'inline', marginRight: '5px' }} /> Correo Electrónico *
          </label>
          <input
            type="email"
            name="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
            <Lock size={16} style={{ display: 'inline', marginRight: '5px' }} /> Contraseña *
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: isLogin ? 'var(--primary-blue)' : 'var(--primary-green)',
            color: 'white',
            padding: '14px',
            marginTop: '10px',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '⏳ Procesando...' : (isLogin ? 'Ingresar al Portal' : 'Registrarme')}
        </button>
      </form>

      <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        {isLogin ? (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            ¿No tenés cuenta?{' '}
            <span 
              onClick={() => setIsLogin(false)} 
              style={{ color: 'var(--primary-green)', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Registrate aquí
            </span>
          </p>
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            ¿Ya tenés cuenta?{' '}
            <span 
              onClick={() => setIsLogin(true)} 
              style={{ color: 'var(--primary-blue)', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Iniciá sesión
            </span>
          </p>
        )}
      </div>
    </div>
  );
}