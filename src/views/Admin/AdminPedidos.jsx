// src/views/Admin/AdminPedidos.jsx

import React, { useState, useEffect } from 'react';
import { Package, Check, X, Eye, Truck, Clock, Wallet, User, MapPin, Phone } from 'lucide-react';

export default function AdminPedidos({ token, API_URL }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/orders/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: status })
      });

      if (res.ok) {
        loadOrders();
        alert(`✅ Estado actualizado a: ${status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al actualizar');
    }
  };

  const handleConfirmPayment = async (orderId, confirm) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/confirm-payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ confirm })
      });

      if (res.ok) {
        loadOrders();
        alert(confirm ? '✅ Pago confirmado' : '❌ Pago rechazado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al procesar');
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    if (filter === 'pending') return orders.filter(o => o.paymentStatus === 'pending');
    if (filter === 'confirmed') return orders.filter(o => o.paymentStatus === 'confirmed');
    return orders;
  };

  const getStatusBadge = (status) => {
    const map = {
      'pending': { color: '#f59e0b', label: '⏳ Pendiente' },
      'processing': { color: '#3b82f6', label: '🔄 Procesando' },
      'shipped': { color: '#8b5cf6', label: '🚚 En Camino' },
      'delivered': { color: '#22c55e', label: '✅ Entregado' },
      'cancelled': { color: '#ef4444', label: '❌ Cancelado' }
    };
    return map[status] || { color: '#94a3b8', label: status };
  };

  const getPaymentBadge = (status) => {
    const map = {
      'pending': { color: '#f59e0b', label: '⏳ Pendiente' },
      'paid': { color: '#3b82f6', label: '💳 Pagado' },
      'confirmed': { color: '#22c55e', label: '✅ Confirmado' }
    };
    return map[status] || { color: '#94a3b8', label: status };
  };

  const filtered = getFilteredOrders();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ color: 'var(--primary-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package size={24} /> Gestión de Pedidos
        </h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: filter === f ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                backgroundColor: filter === f ? 'var(--primary-blue)' : 'transparent',
                color: filter === f ? 'white' : 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {f === 'all' ? '📋 Todos' : f === 'pending' ? '⏳ Pendientes' : '✅ Confirmados'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>⏳ Cargando pedidos...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No hay pedidos {filter !== 'all' ? `con estado "${filter}"` : ''}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(order => {
            const total = order.totalAmount + order.shippingCost;
            const statusInfo = getStatusBadge(order.orderStatus);
            const paymentInfo = getPaymentBadge(order.paymentStatus);

            return (
              <div key={order._id} style={{
                backgroundColor: 'var(--bg-card)',
                padding: '16px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 'bold' }}>Pedido #{order._id.slice(-6)}</span>
                      <span style={{
                        backgroundColor: statusInfo.color + '20',
                        color: statusInfo.color,
                        padding: '2px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {statusInfo.label}
                      </span>
                      <span style={{
                        backgroundColor: paymentInfo.color + '20',
                        color: paymentInfo.color,
                        padding: '2px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {paymentInfo.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {order.userId?.name || 'Cliente'} • 
                      <span style={{ marginLeft: '8px' }}>📦 {order.products.length} productos</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                      C${total.toFixed(2)}
                    </div>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: 'var(--primary-blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px'
                      }}
                    >
                      <Eye size={14} /> {selectedOrder === order._id ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
                </div>

                {selectedOrder === order._id && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                      <div>
                        <p style={{ margin: '4px 0' }}><strong>📍 Dirección:</strong> {order.address}</p>
                        <p style={{ margin: '4px 0'}}><strong>📱 Teléfono:</strong> {order.phone}</p>
                        {order.deliveryNotes && (
                          <p style={{ margin: '4px 0'}}><strong>📝 Notas:</strong> {order.deliveryNotes}</p>
                        )}
                      </div>
                      <div>
                        <p style={{ margin: '4px 0' }}><strong>Productos:</strong></p>
                        {order.products.map((p, i) => (
                          <p key={i} style={{ margin: '2px 0', fontSize: '0.8rem' }}>
                            • {p.name} x{p.quantity} = C${(p.price * p.quantity).toFixed(2)}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Comprobante */}
                    {order.paymentProof && (
                      <div style={{ marginTop: '10px' }}>
                        <p style={{ margin: '0', fontWeight: 'bold', fontSize: '0.85rem' }}>Comprobante:</p>
                        <img src={order.paymentProof} alt="Comprobante" style={{
                          maxWidth: '200px',
                          maxHeight: '150px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)'
                        }} />
                      </div>
                    )}

                    {/* Acciones Admin */}
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {order.paymentStatus === 'pending' && (
                        <>
                          <button onClick={() => handleConfirmPayment(order._id, true)} style={{
                            padding: '6px 14px',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                            ✅ Confirmar Pago
                          </button>
                          <button onClick={() => handleConfirmPayment(order._id, false)} style={{
                            padding: '6px 14px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                            ❌ Rechazar Pago
                          </button>
                        </>
                      )}
                      {['processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <button key={status} onClick={() => handleUpdateStatus(order._id, status)} style={{
                          padding: '6px 12px',
                          backgroundColor: status === 'cancelled' ? '#ef4444' : 'var(--primary-blue)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}>
                          {status === 'processing' && '🔄 Procesar'}
                          {status === 'shipped' && '🚚 Enviar'}
                          {status === 'delivered' && '✅ Entregar'}
                          {status === 'cancelled' && '❌ Cancelar'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}