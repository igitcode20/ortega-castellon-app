// src/views/Pedidos/MisPedidos.jsx

import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, Eye } from 'lucide-react';

export default function MisPedidos({ token, API_URL }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/orders/my-orders`, {
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

  useEffect(() => { fetchOrders(); }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'Pendiente', color: '#f59e0b', icon: <Clock size={16} /> },
      'processing': { label: 'En Procesamiento', color: '#3b82f6', icon: <Package size={16} /> },
      'shipped': { label: 'En Camino', color: '#8b5cf6', icon: <Truck size={16} /> },
      'delivered': { label: 'Entregado', color: '#22c55e', icon: <CheckCircle size={16} /> },
      'cancelled': { label: 'Cancelado', color: '#ef4444', icon: <XCircle size={16} /> }
    };
    return statusMap[status] || { label: status, color: '#94a3b8', icon: <Clock size={16} /> };
  };

  const getPaymentStatus = (status) => {
    const map = {
      'pending': { label: '⏳ Pendiente', color: '#f59e0b' },
      'paid': { label: '✅ Pagado', color: '#3b82f6' },
      'confirmed': { label: '✅ Confirmado', color: '#22c55e' }
    };
    return map[status] || { label: status, color: '#94a3b8' };
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>⏳ Cargando tus pedidos...</div>;
  }

  return (
    <div>
      <h2 style={{ color: 'var(--primary-blue)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Package size={24} /> Mis Pedidos
      </h2>

      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '15px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No tienes pedidos realizados.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Visita la Farmacia para hacer tu primer pedido.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map(order => {
            const statusInfo = getStatusInfo(order.orderStatus);
            const paymentInfo = getPaymentStatus(order.paymentStatus);
            const total = order.totalAmount + order.shippingCost;

            return (
              <div key={order._id} style={{
                backgroundColor: 'var(--bg-card)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                        Pedido #{order._id.slice(-6)}
                      </span>
                      <span style={{
                        backgroundColor: statusInfo.color + '20',
                        color: statusInfo.color,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                      <span style={{
                        backgroundColor: paymentInfo.color + '20',
                        color: paymentInfo.color,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {paymentInfo.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                      📅 {new Date(order.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-green)', margin: 0 }}>
                      C${total.toFixed(2)}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      {order.products.length} producto{order.products.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>📦 Envío a: {order.address}, {order.department}</span>
                    {order.deliveryNotes && (
                      <span style={{ display: 'block', fontSize: '0.8rem' }}>
                        📝 Notas: {order.deliveryNotes}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: 'var(--primary-blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Eye size={16} />
                    {selectedOrder === order._id ? 'Ocultar' : 'Ver Detalles'}
                  </button>
                </div>

                {selectedOrder === order._id && (
                  <div style={{
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    <h4 style={{ marginBottom: '10px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      🛍️ Productos:
                    </h4>
                    {order.products.map((product, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                        borderBottom: '1px solid var(--border-color)',
                        fontSize: '0.9rem'
                      }}>
                        <span>{product.name} x{product.quantity}</span>
                        <span>C${(product.price * product.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingTop: '10px',
                      marginTop: '5px',
                      borderTop: '2px solid var(--border-color)',
                      fontWeight: 'bold'
                    }}>
                      <span>Subtotal</span>
                      <span>C${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span>Envío</span>
                      <span>C${order.shippingCost.toFixed(2)}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: 'var(--primary-green)',
                      marginTop: '5px'
                    }}>
                      <span>Total</span>
                      <span>C${(order.totalAmount + order.shippingCost).toFixed(2)}</span>
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