// src/views/Farmacia/Farmacia.jsx

import { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, PlusCircle, Edit, Save, X, ShoppingCart, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Farmacia({ user, token, API_URL, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null
  });

  const isAdmin = user?.role === 'admin';

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

  useEffect(() => {
    let mounted = true;
    const getProducts = async () => {
      try {
        if (mounted) setLoading(true);
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (mounted) setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getProducts();

    return () => { mounted = false; };
  }, [API_URL]);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '', category: '', image: null });
    setEditingProduct(null);
    setShowForm(false);
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
        resetForm();
        fetchProducts();
      } else {
        const data = await res.json();
        alert(`❌ Error: ${data.message || 'No se pudo agregar'}`);
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
        resetForm();
        fetchProducts();
      } else {
        const data = await res.json();
        alert(`❌ Error: ${data.message || 'No se pudo actualizar'}`);
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
        alert('✅ Producto eliminado');
        fetchProducts();
      } else {
        alert('❌ Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar');
    }
  };

  const addToCart = (product) => {
    if (!user) {
      alert('⚠️ Inicia sesión para agregar al carrito');
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

  const scrollProducts = (direction) => {
    const container = document.getElementById('product-scroll');
    const scrollAmount = 280;
    if (container) {
      container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  // Modal para ver imagen
  if (selectedImage) {
    return (
      <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              ✕ Cerrar
            </button>
          </div>
          <img src={selectedImage} alt="Producto" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header con buscador estilo Facebook */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '12px' 
      }}>
        <h2 style={{ 
          color: 'var(--primary-blue)', 
          margin: 0, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '1.2rem'
        }}>
          <ShoppingBag size={20} /> Farmacia
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', minWidth: '160px' }}>
            <Search size={16} style={{ 
              position: 'absolute', 
              left: '10px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                padding: '6px 10px 6px 32px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                minWidth: '140px',
                minHeight: '34px'
              }}
            />
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-success"
              style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            >
              {showForm ? <X size={16} /> : <PlusCircle size={16} />}
              {showForm ? 'Cancelar' : 'Agregar'}
            </button>
          )}
        </div>
      </div>

      {/* Formulario admin */}
      {isAdmin && showForm && (
        <div className="card" style={{ borderTop: '3px solid var(--primary-green)' }}>
          <h4 style={{ color: 'var(--primary-blue)', marginBottom: '12px' }}>
            {editingProduct ? '✏️ Editar' : '➕ Nuevo Producto'}
          </h4>
          <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input type="text" name="name" placeholder="Nombre *" value={formData.name} onChange={handleInputChange} required />
              <input type="text" name="category" placeholder="Categoría *" value={formData.category} onChange={handleInputChange} required />
            </div>
            <textarea name="description" placeholder="Descripción *" value={formData.description} onChange={handleInputChange} required rows="2" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input type="number" name="price" placeholder="Precio (C$) *" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" />
              <input type="number" name="stock" placeholder="Stock *" value={formData.stock} onChange={handleInputChange} required min="0" />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                {editingProduct ? '📸 Cambiar imagen (opcional)' : '📸 Imagen *'}
              </label>
              <input type="file" accept="image/*" onChange={handleFileChange} required={!editingProduct} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className={editingProduct ? 'btn-primary' : 'btn-success'} style={{ flex: 1 }}>
                {editingProduct ? <Save size={16} /> : <PlusCircle size={16} />}
                {editingProduct ? 'Actualizar' : 'Agregar'}
              </button>
              {editingProduct && (
                <button type="button" className="btn-danger" onClick={resetForm}>Cancelar</button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Catálogo horizontal estilo Facebook Marketplace */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>⏳ Cargando...</div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
          {searchTerm ? '🔍 No se encontraron productos' : '🏥 No hay productos disponibles'}
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {/* Botones de navegación */}
          {filteredProducts.length > 4 && (
            <>
              <button
                onClick={() => scrollProducts(-1)}
                style={{
                  position: 'absolute',
                  left: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 5,
                  background: 'var(--bg-card)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollProducts(1)}
                style={{
                  position: 'absolute',
                  right: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 5,
                  background: 'var(--bg-card)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <div
            id="product-scroll"
            style={{
              display: 'flex',
              gap: '14px',
              overflowX: 'auto',
              padding: '8px 4px 12px 4px',
              scrollbarWidth: 'thin',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: '-ms-autohiding-scrollbar'
            }}
          >
            {filteredProducts.map(product => (
              <div
                key={product._id}
                style={{
                  flex: '0 0 180px',
                  scrollSnapAlign: 'start',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border-color)',
                  padding: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {/* Imagen clickeable para modal */}
                <div
                  onClick={() => setSelectedImage(product.image)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '140px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    marginBottom: '8px'
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      background: 'rgba(0,0,0,0.5)',
                      borderRadius: '50%',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.6rem'
                    }}
                  >
                    <Eye size={12} />
                  </div>
                </div>

                <h4 style={{
                  fontSize: '0.9rem',
                  margin: '4px 0 2px 0',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {product.name}
                </h4>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  margin: '0 0 4px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: '32px'
                }}>
                  {product.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto',
                  paddingTop: '6px',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <span style={{
                    fontWeight: 'bold',
                    color: 'var(--primary-green)',
                    fontSize: '0.95rem'
                  }}>
                    C${product.price.toFixed(2)}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    color: product.stock > 0 ? 'var(--primary-green)' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {product.stock > 0 ? `📦 ${product.stock}` : '❌ Agotado'}
                  </span>
                </div>

                {/* Botones admin */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={{
                        flex: 1,
                        padding: '4px 8px',
                        background: 'var(--primary-blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px'
                      }}
                    >
                      <Edit size={12} /> Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      style={{
                        flex: 1,
                        padding: '4px 8px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px'
                      }}
                    >
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                )}

                {product.stock > 0 && (
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '6px',
                      fontSize: '0.75rem',
                      marginTop: '6px',
                      borderRadius: '6px'
                    }}
                  >
                    <ShoppingCart size={14} /> Agregar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}