// src/views/Muro/Muro.jsx

import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Image, PlusCircle, Edit, X } from 'lucide-react';

export default function Muro({ user, token, API_URL }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const isAdmin = user?.role === 'admin';

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setImageFile(null);
        setShowForm(false);
        fetchPosts();
        alert('✅ Publicación creada exitosamente');
      } else {
        alert('❌ Error al publicar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al publicar');
    }
  };

  const handleLike = async (id) => {
    if (!user) return alert('⚠️ Inicia sesión para dar like');
    try {
      const res = await fetch(`${API_URL}/posts/${id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchPosts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Segura que quieres eliminar esta publicación?')) return;
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPosts();
        alert('✅ Publicación eliminada');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          📰 Novedades y Consejos Médicos
        </h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: showForm ? '#ef4444' : 'var(--primary-green)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {showForm ? <X size={18} /> : <PlusCircle size={18} />}
            {showForm ? 'Cancelar' : 'Nueva Publicación'}
          </button>
        )}
      </div>

      {/* Formulario para admin */}
      {isAdmin && showForm && (
        <form onSubmit={handleCreatePost} style={{
          backgroundColor: 'var(--bg-card)',
          padding: '25px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          marginBottom: '25px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ marginBottom: '15px', color: 'var(--primary-blue)' }}>📝 Nueva Publicación</h3>
          <input
            type="text"
            placeholder="Título informativo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              marginBottom: '10px'
            }}
            required
          />
          <textarea
            placeholder="¿Qué nos compartirá hoy, Dra.?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              height: '90px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              resize: 'vertical',
              marginBottom: '10px'
            }}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: 'var(--primary-green)',
              fontWeight: '600'
            }}>
              <Image size={18} />
              {imageFile ? '✅ Imagen seleccionada' : '📸 Subir Imagen'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </label>
            <button
              type="submit"
              style={{
                padding: '10px 25px',
                backgroundColor: 'var(--primary-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Publicar en el Muro
            </button>
          </div>
        </form>
      )}

      {/* Lista de publicaciones */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>⏳ Cargando publicaciones...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No hay publicaciones aún. {isAdmin && '¡Sé la primera en publicar!'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map(p => (
            <div key={p._id} style={{
              backgroundColor: 'var(--bg-card)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ color: 'var(--primary-blue)', margin: '0 0 8px 0' }}>{p.title}</h3>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(p._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p style={{ margin: '10px 0', lineHeight: '1.6', color: 'var(--text-main)' }}>{p.content}</p>
              {p.image && (
                <img
                  src={p.image}
                  alt="Publicación"
                  style={{
                    width: '100%',
                    maxHeight: '380px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}
                />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => handleLike(p._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: p.likes?.includes(user?.id) ? '#ef4444' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: p.likes?.includes(user?.id) ? '#fee2e2' : 'transparent'
                  }}
                >
                  <Heart size={20} fill={p.likes?.includes(user?.id) ? '#ef4444' : 'none'} />
                  <span>{p.likes?.length || 0} Reacciones</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}