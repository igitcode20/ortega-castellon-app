// src/views/Farmacia/Farmacia.jsx

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, PlusCircle, Edit, Save, X, ShoppingCart, Package } from 'lucide-react';

export default function Farmacia({ user, token, API_URL, cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null
  });
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const formDataSend = new FormData();
    formDataSend.append('name', formData.name);
    formDataSend.append('description', formData.description);
    formDataSend.append('price', formData.price);
    formDataSend.append('stock', formData.stock);
    formDataSend.append('category', formData.category);
    if (formData.image) formDataSend.append('image', formData.image);

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataSend
      });

      if (res.ok) {
        alert('✅ Producto agregado exitosamente');
        setFormData({ name: '', description: '', price: '', stock: '', category: '', image: null });
        setShowForm(false);
        fetchProducts();
      } else {
        const data = await res.json();
        alert(`❌ Error: ${data.message || 'No se pudo agregar el producto'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al agregar producto');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: null
    });
    setShowForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const formDataSend = new FormData();
    formDataSend.append('name', formData.name);
    formDataSend.append('description', formData.description);
    formDataSend.append('price', formData.price);
    formDataSend.append('stock', formData.stock);
    formDataSend.append('category', formData.category);
    if (formData.image) formDataSend.append('image', formData.image);

    try {
      const res = await fetch(`${API_URL}/products/${editingProduct}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataSend
      });

      if (res.ok) {
        alert('✅ Producto actualizado exitosamente');
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', stock: '', category: '', image: null });
        setShowForm(false);
        fetchProducts();
      } else {
        const data = await res.json();
        alert(`❌ Error: ${data.message || 'No se pudo actualizar el producto'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al actualizar producto');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert('✅ Producto eliminado exitosamente');
        fetchProducts();
      } else {
        alert('❌ Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar producto');
    }
  };

  const addToCart = (product) => {
    if (!user) {
      alert('⚠️ Debes iniciar sesión para agregar productos al carrito.');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === product._id);
      if (existing) {
        return prev.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      }];
    });
    alert(`🛒 "${product.name}" agregado al carrito`);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header con botón para agregar producto (solo admin) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ color: 'var(--primary-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag /> Catálogo de Medicamentos
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
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {showForm ? <X size={18} /> : <PlusCircle size={18} />}
            {showForm ? 'Cancelar' : 'Agregar Producto'}
          </button>
        )}
      </div>

      {/* Formulario para agregar/editar producto */}
      {showForm && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          padding: '25px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: 'var(--primary-blue)', marginBottom: '15px' }}>
            {editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
          </h3>
          <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input
                type="text"
                name="name"
                placeholder="Nombre del producto *"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
              <input
                type="text"
                name="category"
                placeholder="Categoría *"
                value={formData.category}
                onChange={handleInputChange}
                required
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
            </div>
            <textarea
              name="description"
              placeholder="Descripción *"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="2"
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input
                type="number"
                name="price"
                placeholder="Precio (C$) *"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock *"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                {editingProduct ? '📸 Cambiar imagen (opcional)' : '📸 Imagen del producto *'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!editingProduct}
                style={{ width: '100%' }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '12px',
                backgroundColor: editingProduct ? 'var(--primary-blue)' : 'var(--primary-green)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {editingProduct ? <Save size={18} /> : <PlusCircle size={18} />}
              {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
          </form>
        </div>
      )}

      {/* Grid de productos */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          ⏳ Cargando productos...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          🏥 No hay productos disponibles en la farmacia.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {products.map(product => (
            <div key={product._id} style={{
              backgroundColor: 'var(--bg-card)',
              padding: '15px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              transition: 'transform 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'contain',
                  marginBottom: '10px',
                  borderRadius: '8px'
                }}
              />
              <h4 style={{ fontSize: '1rem', margin: '8px 0', color: 'var(--text-main)' }}>{product.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0' }}>{product.description}</p>
              <p style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.1rem', margin: '8px 0' }}>
                C${product.price.toFixed(2)}
              </p>
              <span style={{
                fontSize: '0.75rem',
                color: product.stock > 0 ? 'var(--primary-green)' : '#ef4444',
                display: 'block',
                marginBottom: '10px'
              }}>
                {product.stock > 0 ? `📦 ${product.stock} disponibles` : '❌ Agotado'}
              </span>

              {/* Botones para admin */}
              {isAdmin && (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '10px' }}>
                  <button
                    onClick={() => handleEditProduct(product)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--primary-blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    <Edit size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    <Trash2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Eliminar
                  </button>
                </div>
              )}

              {/* Botón para agregar al carrito (solo si hay stock) */}
              {product.stock > 0 && (
                <button
                  onClick={() => addToCart(product)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: 'var(--primary-blue)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <ShoppingCart size={16} /> Agregar al Carrito
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}