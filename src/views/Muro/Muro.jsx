import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Image } from 'lucide-react';

export default function Muro({ user, token, API_URL }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const fetchPosts = () => {
    fetch(`${API_URL}/posts`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Error cargando posts:", err));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (imageFile) formData.append('image', imageFile);

    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      setTitle(''); setContent(''); setImageFile(null);
      fetchPosts();
    } else {
      alert("Error al publicar, verifica los datos.");
    }
  };

  const handleLike = async (id) => {
    if (!user) return alert("¡Mae, tenés que registrarte e iniciar sesión para dar corazón! ❤️");
    const res = await fetch(`${API_URL}/posts/${id}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchPosts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Segura que quieres borrar esta publicación, Doctora?")) {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchPosts();
    }
  };

  return (
    <div>
      <h2 style={{ color: 'var(--primary-blue)', marginBottom: '20px' }}>📰 Novedades y Consejos Médicos</h2>
      
      {user?.role === 'admin' && (
        <form onSubmit={handleCreatePost} style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '10px' }}>Nueva Publicación</h3>
          <input type="text" placeholder="Título informativo" value={title} onChange={e=>setTitle(e.target.value)} style={{ width:'100%', marginBottom:'10px' }} required />
          <textarea placeholder="¿Qué nos compartirá hoy, Dra.?" value={content} onChange={e=>setContent(e.target.value)} style={{ width:'100%', height:'90px', marginBottom:'10px' }} required />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'5px', cursor:'pointer', color:'var(--primary-green)', fontWeight:'600' }}>
              <Image size={18}/> {imageFile ? "Imagen seleccionada ✅" : "Subir Imagen Informativa"}
              <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files[0])} style={{ display:'none' }} />
            </label>
            <button type="submit" style={{ backgroundColor:'var(--primary-blue)', color:'white', border:'none', padding:'10px 20px', borderRadius:'6px', fontWeight:'bold' }}>Publicar en el Muro</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {posts.map(p => (
          <div key={p._id} style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display:'flex', justifyContent: 'space-between', alignItems:'center' }}>
              <h3 style={{ color: 'var(--primary-blue)' }}>{p.title}</h3>
              {user?.role === 'admin' && <button onClick={()=>handleDelete(p._id)} style={{ background:'none', border:'none', color:'#e53e3e' }}><Trash2 size={18}/></button>}
            </div>
            <p style={{ margin:'12px 0', lineHeight:'1.5' }}>{p.content}</p>
            {p.image && <img src={p.image} alt="Publicación" style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />}
            <div style={{ display:'flex', alignItems:'center' }}>
              <button onClick={()=>handleLike(p._id)} style={{ background:'none', border:'none', color: p.likes?.includes(user?.id) ? '#e53e3e' : 'var(--text-muted)', display:'flex', alignItems:'center', gap:'6px', fontWeight:'600' }}>
                <Heart size={20} fill={p.likes?.includes(user?.id) ? '#e53e3e' : 'none'}/> 
                <span>{p.likes?.length || 0} Reacciones</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}