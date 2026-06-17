// src/components/Cart.jsx

import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, Wallet, Upload, MapPin, Phone, CheckCircle } from 'lucide-react';

export default function Cart({ cart, setCart, user, token, API_URL }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    address: '',
    department: 'Juigalpa',
    phone: '',
    deliveryNotes: ''
  });
  const [paymentProof, setPaymentProof] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isDeliveryAvailable = orderData.department === 'Juigalpa';
  const shippingCost = isDeliveryAvailable ? 40 : 0;
  const total = subtotal + shippingCost;

  const updateQuantity = (productId, change) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setStep(1);
    setIsOpen(false);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('⚠️ Por favor, inicia sesión para realizar un pedido.');
      return;
    }

    if (!orderData.address) {
      alert('⚠️ Por favor, ingresa tu dirección completa.');
      return;
    }

    if (!isDeliveryAvailable) {
      alert('⚠️ El servicio de delivery solo está disponible en Juigalpa, Chontales.');
      return;
    }

    if (cart.length === 0) {
      alert('⚠️ Tu carrito está vacío.');
      return;
    }

    setLoading(true);
    const orderPayload = {
      products: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      address: orderData.address,
      department: orderData.department,
      phone: orderData.phone || user.phone,
      deliveryNotes: orderData.deliveryNotes
    };

    try {
      const res = await fetch(`${API_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (res.ok) {
        setOrderId(data.order._id);
        setStep(3);
        alert(`✅ Pedido creado exitosamente.\n\n${data.paymentInstructions}\n\nTotal a pagar: C$${data.totalWithShipping.toFixed(2)}`);
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error al crear pedido:', error);
      alert('❌ Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProof = async () => {
    if (!paymentProof) {
      alert('⚠️ Por favor, selecciona el comprobante de pago.');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/${orderId}/upload-proof`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ paymentProof: reader.result })
        });

        if (res.ok) {
          alert('✅ Comprobante subido exitosamente. Espera la confirmación del administrador.');
          clearCart();
        } else {
          alert('❌ Error al subir el comprobante.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al subir el comprobante.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(paymentProof);
  };

  // Botón flotante del carrito
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 'clamp(80px, 15vh, 100px)',
          right: 'clamp(12px, 5vw, 24px)',
          backgroundColor: 'var(--primary-blue)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: 'clamp(52px, 10vw, 60px)',
          height: 'clamp(52px, 10vw, 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 132, 204, 0.4)',
          zIndex: 999,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 6px 30px rgba(0, 132, 204, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(0, 132, 204, 0.4)';
        }}
      >
        <ShoppingCart size="clamp(22px, 4vw, 28px)" />
        {totalItems > 0 && (
          <span style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 8px',
            fontSize: 'clamp(11px, 2vw, 13px)',
            fontWeight: 'bold',
            minWidth: '22px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
          }}>
            {totalItems}
          </span>
        )}
      </button>
    );
  }

  // Panel del carrito abierto
  return (
    <div style={{
      position: 'fixed',
      bottom: 'clamp(10px, 3vh, 20px)',
      right: 'clamp(10px, 3vw, 24px)',
      width: 'min(92vw, 420px)',
      maxHeight: 'min(85vh, 700px)',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'slideUp 0.3s ease'
    }}>
      {/* Header */}
      <div style={{
        padding: 'clamp(14px, 2.5vw, 18px) clamp(16px, 3vw, 24px)',
        backgroundColor: 'var(--primary-blue)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          fontWeight: '700'
        }}>
          {step === 1 && '🛒 Carrito'}
          {step === 2 && '📋 Checkout'}
          {step === 3 && '💳 Pago'}
        </h3>
        <button 
          onClick={() => setIsOpen(false)} 
          style={{ 
            background: 'rgba(255,255,255,0.15)', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer', 
            padding: '6px',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
        >
          <X size="clamp(18px, 3vw, 22px)" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div style={{ 
        padding: 'clamp(14px, 2vw, 20px)', 
        overflowY: 'auto', 
        flex: 1,
        backgroundColor: 'var(--bg-main)'
      }}>
        {step === 1 && (
          <>
            {cart.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: 'clamp(30px, 8vh, 50px) 16px',
                color: 'var(--text-muted)'
              }}>
                <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Tu carrito está vacío</p>
                <p style={{ fontSize: '0.9rem' }}>Agrega productos desde la farmacia</p>
              </div>
            ) : (
              <>
                {cart.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    marginBottom: '8px'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ 
                        width: 'clamp(44px, 8vw, 56px)', 
                        height: 'clamp(44px, 8vw, 56px)', 
                        objectFit: 'contain', 
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                        padding: '4px'
                      }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ 
                        margin: 0, 
                        fontWeight: '600', 
                        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.name}
                      </p>
                      <p style={{ 
                        margin: '2px 0 0 0', 
                        color: 'var(--primary-green)', 
                        fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                        fontWeight: 'bold'
                      }}>
                        C${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      flexShrink: 0
                    }}>
                      <button 
                        onClick={() => updateQuantity(item.productId, -1)} 
                        style={{ 
                          background: 'var(--bg-main)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '6px', 
                          padding: '4px 8px', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '28px',
                          minHeight: '28px'
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ 
                        minWidth: '24px', 
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.95rem'
                      }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.productId, 1)} 
                        style={{ 
                          background: 'var(--bg-main)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '6px', 
                          padding: '4px 8px', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '28px',
                          minHeight: '28px'
                        }}
                      >
                        <Plus size={14} />
                      </button>
                      <button 
                        onClick={() => removeItem(item.productId)} 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#ef4444', 
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <div style={{ 
                  marginTop: '16px', 
                  paddingTop: '16px', 
                  borderTop: '2px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '10px',
                  padding: '16px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '6px',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                    <span style={{ fontWeight: 'bold' }}>C${subtotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      width: '100%',
                      padding: 'clamp(12px, 2vw, 16px)',
                      backgroundColor: 'var(--primary-green)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      marginTop: '12px',
                      cursor: 'pointer',
                      fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.02)';
                      e.target.style.boxShadow = '0 4px 15px rgba(140, 198, 63, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Proceder al Checkout → C${total.toFixed(2)}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {step === 2 && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ 
              marginBottom: '16px', 
              color: 'var(--primary-blue)',
              fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
            }}>
              📋 Datos de Envío
            </h4>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600', 
                fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                color: 'var(--text-main)'
              }}>
                <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Departamento *
              </label>
              <select
                value={orderData.department}
                onChange={(e) => setOrderData({ ...orderData, department: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: 'clamp(10px, 1.5vw, 12px)',
                  borderRadius: '10px', 
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}
              >
                <option value="Juigalpa">Juigalpa</option>
                <option value="Chontales">Chontales</option>
                <option value="Managua">Managua</option>
                <option value="Santo Domingo">Santo Domingo</option>
                <option value="Santo Tomás">Santo Tomás</option>
                <option value="El Lovago">El Lovago</option>
                <option value="La Guinea">La Guinea</option>
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600', 
                fontSize: 'clamp(0.85rem, 2vw, 0.9rem)'
              }}>
                Dirección Completa *
              </label>
              <input
                type="text"
                placeholder="Barrio, calle, casa #"
                value={orderData.address}
                onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: 'clamp(10px, 1.5vw, 12px)',
                  borderRadius: '10px', 
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600', 
                fontSize: 'clamp(0.85rem, 2vw, 0.9rem)'
              }}>
                <Phone size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                placeholder="Número de teléfono"
                value={orderData.phone}
                onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: 'clamp(10px, 1.5vw, 12px)',
                  borderRadius: '10px', 
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600', 
                fontSize: 'clamp(0.85rem, 2vw, 0.9rem)'
              }}>
                Notas de Delivery
              </label>
              <textarea
                placeholder="Instrucciones adicionales..."
                value={orderData.deliveryNotes}
                onChange={(e) => setOrderData({ ...orderData, deliveryNotes: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: 'clamp(10px, 1.5vw, 12px)',
                  borderRadius: '10px', 
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  minHeight: '60px',
                  resize: 'vertical',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}
              />
            </div>

            <div style={{
              backgroundColor: isDeliveryAvailable ? '#dcfce7' : '#fef2f2',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '16px',
              border: `1px solid ${isDeliveryAvailable ? '#bbf7d0' : '#fecaca'}`
            }}>
              <p style={{ margin: 0, fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                {isDeliveryAvailable ? (
                  <span>🚚 <strong>Costo de envío:</strong> C${shippingCost}.00</span>
                ) : (
                  <span>⚠️ <strong>El servicio de delivery solo está disponible en Juigalpa, Chontales.</strong></span>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: 'clamp(10px, 1.5vw, 12px)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'
                }}
              >
                Volver
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !isDeliveryAvailable}
                style={{
                  flex: 2,
                  padding: 'clamp(10px, 1.5vw, 12px)',
                  backgroundColor: isDeliveryAvailable ? 'var(--primary-blue)' : '#94a3b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: isDeliveryAvailable ? 'pointer' : 'not-allowed',
                  opacity: loading ? 0.7 : 1,
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'
                }}
              >
                {loading ? '⏳ Procesando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ 
              marginBottom: '16px', 
              color: 'var(--primary-green)',
              fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
            }}>
              💳 Realizar Pago
            </h4>
            
            <div style={{
              backgroundColor: '#fef3c7',
              padding: '16px',
              borderRadius: '10px',
              marginBottom: '16px',
              border: '1px solid #f59e0b'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#92400e' }}>
                <Wallet size={18} style={{ display: 'inline', marginRight: '8px' }} />
                Wallet Móvil:
              </p>
              <p style={{ 
                margin: '6px 0', 
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', 
                color: '#b45309', 
                fontWeight: 'bold' 
              }}>
                +505 84334235
              </p>
              <p style={{ margin: 0, fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', color: '#92400e' }}>
                Titular: Sindy Castellón
              </p>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderTop: '1px solid var(--border-color)',
              marginBottom: '16px'
            }}>
              <span style={{ fontWeight: 'bold', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)' }}>
                Total a pagar:
              </span>
              <span style={{ 
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', 
                fontWeight: 'bold', 
                color: 'var(--primary-green)' 
              }}>
                C${total.toFixed(2)}
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}>
                📤 Subir Comprobante de Pago
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentProof(e.target.files[0])}
                style={{ 
                  width: '100%', 
                  padding: 'clamp(8px, 1vw, 10px)',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'
                }}
              />
              {paymentProof && (
                <p style={{ 
                  fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', 
                  color: 'var(--primary-green)', 
                  marginTop: '6px' 
                }}>
                  ✅ Archivo seleccionado: {paymentProof.name}
                </p>
              )}
            </div>

            <button
              onClick={handleUploadProof}
              disabled={loading || !paymentProof}
              style={{
                width: '100%',
                padding: 'clamp(12px, 2vw, 16px)',
                backgroundColor: paymentProof ? 'var(--primary-green)' : '#94a3b8',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                cursor: paymentProof ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1,
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (paymentProof) e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <Upload size={clamp(18, '3vw', 22)} /> 
              {loading ? '⏳ Subiendo...' : 'Subir Comprobante y Confirmar'}
            </button>

            {!paymentProof && (
              <p style={{ 
                textAlign: 'center', 
                fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', 
                color: 'var(--text-muted)', 
                marginTop: '10px' 
              }}>
                ⚠️ Debes seleccionar un comprobante para continuar
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer del carrito - solo en paso 1 */}
      {step === 1 && cart.length > 0 && (
        <div style={{
          padding: 'clamp(10px, 1.5vw, 14px) clamp(16px, 3vw, 24px)',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <span style={{ fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
            {cart.length} producto{cart.length > 1 ? 's' : ''}
          </span>
          <span style={{ 
            fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
            fontWeight: 'bold', 
            color: 'var(--primary-green)' 
          }}>
            Total: C${subtotal.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}

// Helper para clamp en JS
const clamp = (min, val, max) => Math.min(Math.max(min, val), max);