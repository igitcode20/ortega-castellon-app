// src/views/Farmacia/Farmacia.jsx

import  { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Trash2, PlusCircle, Edit, Save, X, 
  ShoppingCart, Search, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function Farmacia({ user, token, API_URL, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const scrollContainerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null
  });

  const isAdmin = user?.role === 'admin';

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchProducts(); }, []);

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
    if (scrollContainerRef.current) {
      const scrollAmount = 240;
      scrollContainerRef.current.scrollBy({ 
        left: direction * scrollAmount, 
        behavior: 'smooth' 
      });
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
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.85rem'
              }}
            >
              ✕ Cerrar
            </button>
          </div>
          <img src={selectedImage} alt="Producto" style={{ maxHeight: '80vh' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '16px' }}>
      
      {/* Header con buscador */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        gap: isMobile ? '8px' : '10px'
      }}>
        <h2 style={{ 
          color: 'var(--primary-blue)', 
          margin: 0, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          fontSize: isMobile ? '1rem' : '1.2rem'
        }}>
          <ShoppingBag size={isMobile ? 18 : 20} /> Farmacia
        </h2>
        
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '6px' : '8px', 
          flexWrap: 'wrap',
          alignItems: 'center',
          width: isMobile ? '100%' : 'auto'
        }}>
          {/* Buscador */}
          <div style={{ 
            position: 'relative', 
            flex: isMobile ? 1 : 'none', 
            minWidth: isMobile ? '100%' : '140px'
          }}>
            <Search size={isMobile ? 14 : 16} style={{ 
              position: 'absolute', 
              left: '8px', 
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
                padding: isMobile ? '4px 8px 4px 28px' : '6px 10px 6px 32px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                fontSize: isMobile ? '0.75rem' : '0.85rem',
                width: '100%',
                minHeight: isMobile ? '30px' : '34px',
                background: 'var(--bg-main)'
              }}
            />
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-success"
              style={{ 
                fontSize: isMobile ? '0.7rem' : '0.85rem', 
                padding: isMobile ? '4px 10px' : '6px 14px',
                width: isMobile ? '100%' : 'auto',
                minHeight: isMobile ? '30px' : '36px'
              }}
            >
              {showForm ? <X size={isMobile ? 14 : 16} /> : <PlusCircle size={isMobile ? 14 : 16} />}
              {showForm ? 'Cancelar' : 'Agregar'}
            </button>
          )}
        </div>
      </div>

      {/* Formulario admin */}
      {isAdmin && showForm && (
        <div className="card" style={{ 
          borderTop: '3px solid var(--primary-green)',
          padding: isMobile ? '12px' : '16px'
        }}>
          <h4 style={{ 
            color: 'var(--primary-blue)', 
            marginBottom: isMobile ? '8px' : '12px',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            {editingProduct ? '✏️ Editar' : '➕ Nuevo Producto'}
          </h4>
          <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '6px' : '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '6px' : '10px' }}>
              <input type="text" name="name" placeholder="Nombre *" value={formData.name} onChange={handleInputChange} required style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', padding: isMobile ? '6px 10px' : '8px 12px' }} />
              <input type="text" name="category" placeholder="Categoría *" value={formData.category} onChange={handleInputChange} required style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', padding: isMobile ? '6px 10px' : '8px 12px' }} />
            </div>
            <textarea name="description" placeholder="Descripción *" value={formData.description} onChange={handleInputChange} required rows="2" style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', padding: isMobile ? '6px 10px' : '8px 12px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr', gap: isMobile ? '6px' : '10px' }}>
              <input type="number" name="price" placeholder="Precio (C$) *" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', padding: isMobile ? '6px 10px' : '8px 12px' }} />
              <input type="number" name="stock" placeholder="Stock *" value={formData.stock} onChange={handleInputChange} required min="0" style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', padding: isMobile ? '6px 10px' : '8px 12px' }} />
            </div>
            <div>
              <label style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', fontWeight: '600' }}>
                {editingProduct ? '📸 Cambiar imagen (opcional)' : '📸 Imagen *'}
              </label>
              <input type="file" accept="image/*" onChange={handleFileChange} required={!editingProduct} style={{ fontSize: isMobile ? '0.75rem' : '0.85rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className={editingProduct ? 'btn-primary' : 'btn-success'} style={{ flex: 1, fontSize: isMobile ? '0.8rem' : '0.9rem', padding: isMobile ? '6px 12px' : '8px 16px' }}>
                {editingProduct ? <Save size={isMobile ? 14 : 16} /> : <PlusCircle size={isMobile ? 14 : 16} />}
                {editingProduct ? 'Actualizar' : 'Agregar'}
              </button>
              {editingProduct && (
                <button type="button" className="btn-danger" onClick={resetForm} style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', padding: isMobile ? '6px 12px' : '8px 16px' }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Catálogo */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: isMobile ? '0.85rem' : '1rem' }}>⏳ Cargando...</div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: isMobile ? '0.85rem' : '1rem' }}>
          {searchTerm ? '🔍 No se encontraron productos' : '🏥 No hay productos disponibles'}
        </div>
      ) : (
        <>
          {/* VISTA MÓVIL: Vertical compacta */}
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="card"
                  style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '10px',
                    alignItems: 'center',
                    borderRadius: '10px'
                  }}
                >
                  {/* Imagen clickeable */}
                  <div
                    onClick={() => setSelectedImage(product.image)}
                    style={{
                      width: '70px',
                      minWidth: '70px',
                      height: '70px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '4px'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '4px'
                    }}>
                      <h4 style={{
                        fontSize: '0.85rem',
                        margin: '0',
                        fontWeight: '700',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1
                      }}>
                        {product.name}
                      </h4>
                      <span style={{
                        fontSize: '0.6rem',
                        color: product.stock > 0 ? 'var(--primary-green)' : '#ef4444',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        {product.stock > 0 ? `📦${product.stock}` : '❌'}
                      </span>
                    </div>
                    
                    <p style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      margin: '2px 0 4px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.description}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{
                        fontWeight: 'bold',
                        color: 'var(--primary-green)',
                        fontSize: '0.85rem'
                      }}>
                        C${product.price.toFixed(2)}
                      </span>

                      {isAdmin && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleEditProduct(product)}
                            style={{
                              padding: '2px 6px',
                              background: 'var(--primary-blue)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.6rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px',
                              minHeight: '22px'
                            }}
                          >
                            <Edit size={10} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            style={{
                              padding: '2px 6px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.6rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px',
                              minHeight: '22px'
                            }}
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      )}

                      {product.stock > 0 && !isAdmin && (
                        <button
                          onClick={() => addToCart(product)}
                          className="btn-primary"
                          style={{
                            padding: '2px 10px',
                            fontSize: '0.65rem',
                            borderRadius: '6px',
                            minHeight: '26px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <ShoppingCart size={12} /> Agregar
                        </button>
                      )}
                    </div>

                    {isAdmin && product.stock > 0 && (
                      <button
                        onClick={() => addToCart(product)}
                        className="btn-primary"
                        style={{
                          width: '100%',
                          padding: '3px 0',
                          fontSize: '0.65rem',
                          marginTop: '4px',
                          borderRadius: '4px',
                          minHeight: '26px'
                        }}
                      >
                        <ShoppingCart size={12} /> Agregar al carrito
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* VISTA COMPUTADORA: Horizontal (Carrusel) */
            <div style={{ position: 'relative' }}>
              {filteredProducts.length > 4 && (
                <>
                  <button
                    onClick={() => scrollProducts(-1)}
                    style={{
                      position: 'absolute',
                      left: '-10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 5,
                      background: 'var(--bg-card)',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      padding: 0,
                      boxShadow: 'var(--shadow-md)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => scrollProducts(1)}
                    style={{
                      position: 'absolute',
                      right: '-10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 5,
                      background: 'var(--bg-card)',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      padding: 0,
                      boxShadow: 'var(--shadow-md)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <div
                ref={scrollContainerRef}
                style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  padding: '8px 4px 16px 4px',
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
                      flex: '0 0 200px',
                      scrollSnapAlign: 'start',
                      background: 'var(--bg-card)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border-color)',
                      padding: '12px',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
                    <div
                      onClick={() => setSelectedImage(product.image)}
                      style={{
                        width: '100%',
                        height: '150px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '8px',
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
                          color: 'white'
                        }}
                      >
                        <Eye size={14} />
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
        </>
      )}

      {/* Contador de productos */}
      {!loading && filteredProducts.length > 0 && (
        <div style={{
          textAlign: 'center',
          fontSize: isMobile ? '0.65rem' : '0.75rem',
          color: 'var(--text-muted)',
          padding: isMobile ? '2px 0' : '4px 0'
        }}>
          Mostrando {filteredProducts.length} producto{filteredProducts.length > 1 ? 's' : ''}
          {searchTerm && ` (${products.length} total)`}
        </div>
      )}
    </div>
  );
}