import React, { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, PlusCircle } from 'lucide-react';

export default function Farmacia({ user, token, API_URL }) {
  const [products, setProducts] = useState([]);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodCat, setProdCat] = useState('');
  const [prodImg, setProdImg] = useState(null);

  const fetchProducts = () => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', prodName);
    formData.append('description', prodDesc);
    formData.append('price', prodPrice);
    formData.append('stock', prodStock);
    formData.append('category', prodCat);
    formData.append('image', prodImg);

    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      alert("¡Medicamento agregado!");
      setProdName(''); setProdDesc(''); setProdPrice(''); setProdStock(''); setProdCat(''); setProdImg(null);
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Eliminar fármaco?")) {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchProducts();
    }
  };

  const showAdminPanel = user?.role === 'admin';

  return (
    <div style={{ display: 'flex', flexDirection: showAdminPanel ? 'row' : 'column', gap: '30px', flexWrap: 'wrap' }}>
      
      {/* SUBIR PRODUCTO (A UN LADO - SÓLO ADMIN) */}
      {showAdminPanel && (
        <div style={{ flex: '1', minWidth: '280px', maxWidth: '340px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h3 style={{ color: 'var(--primary-green)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem' }}>
            <PlusCircle size={18}/> Añadir Fármaco
          </h3>
          <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Nombre" value={prodName} onChange={e=>setProdName(e.target.value)} required />
            <input type="text" placeholder="Descripción" value={prodDesc} onChange={e=>setProdDesc(e.target.value)} required />
            <input type="number" placeholder="Precio ($)" value={prodPrice} onChange={e=>setProdPrice(e.target.value)} required />
            <input type="number" placeholder="Stock inicial" value={prodStock} onChange={e=>setProdStock(e.target.value)} required />
            <input type="text" placeholder="Categoría" value={prodCat} onChange={e=>setProdCat(e.target.value)} required />
            <input type="file" accept="image/*" onChange={e=>setProdImg(e.target.files[0])} required />
            <button type="submit" style={{ backgroundColor: 'var(--primary-green)', color: 'white', padding: '10px' }}>Subir a Farmacia</button>
          </form>
        </div>
      )}

      {/* REJILLA DEL CATÁLOGO */}
      <div style={{ flex: '3', minWidth: '320px' }}>
        <h2 style={{ color: 'var(--primary-blue)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag /> Catálogo de Medicamentos
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {products.map(p => (
            <div key={p._id} style={{ backgroundColor: 'var(--bg-card)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <img src={p.image} alt={p.name} style={{ width: '100%', height: '110px', objectFit: 'contain', marginBottom: '8px' }} />
              <h4 style={{ fontSize: '1rem' }}>{p.name}</h4>
              <p style={{ color: 'var(--primary-green)', fontWeight: 'bold', margin: '5px 0' }}>${p.price.toFixed(2)}</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disponibles: {p.stock} u.</span>
              {showAdminPanel && (
                <button onClick={() => handleDeleteProduct(p._id)} style={{ background: 'none', color: '#e53e3e', marginTop: '10px', display: 'block', margin: '10px auto 0' }}><Trash2 size={16} /></button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}