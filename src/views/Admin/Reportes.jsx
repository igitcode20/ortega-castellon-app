// src/views/Admin/Reportes.jsx

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Eye, 
  FileText,
  MapPin  // ✅ IMPORTADO
} from 'lucide-react';

export default function Reportes({ token, API_URL }) {
  const [reportData, setReportData] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/orders/sales-report?period=${period}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setReportData(data);
    } catch (error) {
      console.error('Error cargando reporte:', error);
      alert('❌ Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, [period]);

  const exportToCSV = () => {
    if (!reportData || !reportData.orders) return;
    
    const headers = ['Fecha', 'Cliente', 'Total', 'Departamento', 'Estado'];
    const rows = reportData.orders.map(order => [
      new Date(order.createdAt).toLocaleDateString('es-ES'),
      order.userId?.name || 'Cliente',
      (order.totalAmount + order.shippingCost).toFixed(2),
      order.department || 'N/A',
      order.orderStatus
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${period}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>⏳ Cargando reportes...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
        <h2 style={{ color: 'var(--primary-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={24} /> Reportes y Estadísticas
        </h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)'
            }}
          >
            <option value="daily">📅 Diario</option>
            <option value="weekly">📆 Semanal</option>
            <option value="monthly">📊 Mensual</option>
            <option value="quarterly">📈 Trimestral</option>
          </select>
          <button
            onClick={exportToCSV}
            style={{
              padding: '8px 18px',
              backgroundColor: 'var(--primary-green)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 'bold'
            }}
          >
            <Download size={18} /> Exportar Excel
          </button>
        </div>
      </div>

      {reportData && (
        <>
          {/* Resumen */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '15px',
            marginBottom: '25px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <DollarSign size={24} color="#22c55e" />
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Ventas</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                    C${reportData.summary?.totalSales?.toFixed(2) || 0}
                  </p>
                </div>
              </div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={24} color="#8b5cf6" />
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Pedidos</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {reportData.summary?.totalOrders || 0}
                  </p>
                </div>
              </div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={24} color="#3b82f6" />
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Promedio por Pedido</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                    C${reportData.summary?.averageOrderValue?.toFixed(2) || 0}
                  </p>
                </div>
              </div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={24} color="#0284c7" />
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Clientes Únicos</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {reportData.orders ? new Set(reportData.orders.map(o => o.userId?._id)).size : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ventas por departamento */}
          {reportData.byDepartment && Object.keys(reportData.byDepartment).length > 0 && (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} /> Ventas por Departamento  {/* ✅ AHORA FUNCIONA */}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                {Object.entries(reportData.byDepartment).map(([dept, count]) => (
                  <div key={dept} style={{
                    padding: '10px',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{dept}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>{count}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>pedidos</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Productos más vendidos */}
          {reportData.topProducts && reportData.topProducts.length > 0 && (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏆 Productos Más Vendidos
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {reportData.topProducts.map((product, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 15px',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <span style={{ fontWeight: idx < 3 ? 'bold' : 'normal' }}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`} {product.name}
                    </span>
                    <span style={{ fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                      {product.quantity} unidades - C${product.revenue.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Últimos pedidos */}
          {reportData.orders && reportData.orders.length > 0 && (
            <div style={{
              marginTop: '20px',
              backgroundColor: 'var(--bg-card)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} /> Últimos Pedidos
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '8px', color: 'var(--text-muted)' }}>Fecha</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: 'var(--text-muted)' }}>Cliente</th>
                      <th style={{ textAlign: 'right', padding: '8px', color: 'var(--text-muted)' }}>Total</th>
                      <th style={{ textAlign: 'center', padding: '8px', color: 'var(--text-muted)' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.orders.slice(0, 15).map((order, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}>{new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
                        <td style={{ padding: '8px' }}>{order.userId?.name || 'Cliente'}</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                          C${(order.totalAmount + order.shippingCost).toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <span style={{
                            padding: '2px 10px',
                            borderRadius: '20px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            backgroundColor: order.orderStatus === 'delivered' ? '#dcfce7' :
                                           order.orderStatus === 'cancelled' ? '#fee2e2' : '#fef3c7',
                            color: order.orderStatus === 'delivered' ? '#166534' :
                                   order.orderStatus === 'cancelled' ? '#991b1b' : '#92400e'
                          }}>
                            {order.orderStatus || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}