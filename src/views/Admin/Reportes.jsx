// src/views/Admin/Reportes.jsx

import { useState, useEffect } from 'react';
import { 
  BarChart3, Download, TrendingUp, Users, 
  Package, DollarSign, FileText, MapPin, ChevronDown, ChevronUp
} from 'lucide-react';

export default function Reportes({ token, API_URL }) {
  const [reportData, setReportData] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadReport = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/orders/sales-report?period=${period}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal
        });
        if (!res.ok) throw new Error('Error cargando reporte');
        const data = await res.json();
        setReportData(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error cargando reporte:', error);
          alert('❌ Error al cargar el reporte');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadReport();
    return () => controller.abort();
  }, [period, API_URL, token]);

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
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 'clamp(40px, 10vh, 80px)', 
        color: 'var(--text-muted)' 
      }}>
        ⏳ Cargando reportes...
      </div>
    );
  }

  const displayedOrders = showAllOrders 
    ? reportData?.orders || [] 
    : (reportData?.orders || []).slice(0, 5);

  return (
    <div style={{ 
      padding: 'clamp(8px, 1vw, 16px)',
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: 'clamp(10px, 2vw, 16px)', 
        marginBottom: 'clamp(16px, 3vw, 25px)'
      }}>
        <h2 style={{ 
          color: 'var(--primary-blue)', 
          margin: 0, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)'
        }}>
          <BarChart3 size={26} /> Reportes
        </h2>
        <div style={{ 
          display: 'flex', 
          gap: 'clamp(8px, 1.5vw, 12px)', 
          alignItems: 'center', 
          flexWrap: 'wrap' 
        }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              padding: 'clamp(6px, 1vw, 10px) clamp(10px, 1.5vw, 14px)',
              borderRadius: '8px',
              border: '1.5px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)',
              minHeight: '38px'
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
              padding: 'clamp(6px, 1vw, 10px) clamp(12px, 1.5vw, 16px)',
              backgroundColor: 'var(--primary-green)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold',
              fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)',
              minHeight: '38px',
              whiteSpace: 'nowrap'
            }}
          >
            <Download size={clamp(14, 1.5, 18)} /> Exportar
          </button>
        </div>
      </div>

      {reportData && (
        <>
          {/* Tarjetas de resumen */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
            gap: 'clamp(10px, 1.5vw, 14px)',
            marginBottom: 'clamp(16px, 3vw, 24px)'
          }}>
            <div className="card" style={{ padding: 'clamp(12px, 1.5vw, 18px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 12px)' }}>
                <div style={{ 
                  backgroundColor: '#dcfce7', 
                  padding: '8px', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <DollarSign size={clamp(18, 2, 24)} color="#22c55e" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 'clamp(0.6rem, 1vw, 0.75rem)', color: 'var(--text-muted)' }}>
                    Total Ventas
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', 
                    fontWeight: 'bold', 
                    color: 'var(--primary-green)' 
                  }}>
                    C${reportData.summary?.totalSales?.toFixed(2) || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card" style={{ padding: 'clamp(12px, 1.5vw, 18px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 12px)' }}>
                <div style={{ 
                  backgroundColor: '#ede9fe', 
                  padding: '8px', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Package size={clamp(18, 2, 24)} color="#8b5cf6" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 'clamp(0.6rem, 1vw, 0.75rem)', color: 'var(--text-muted)' }}>
                    Total Pedidos
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', 
                    fontWeight: 'bold' 
                  }}>
                    {reportData.summary?.totalOrders || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 'clamp(12px, 1.5vw, 18px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 12px)' }}>
                <div style={{ 
                  backgroundColor: '#dbeafe', 
                  padding: '8px', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp size={clamp(18, 2, 24)} color="#3b82f6" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 'clamp(0.6rem, 1vw, 0.75rem)', color: 'var(--text-muted)' }}>
                    Promedio x Pedido
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', 
                    fontWeight: 'bold' 
                  }}>
                    C${reportData.summary?.averageOrderValue?.toFixed(2) || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 'clamp(12px, 1.5vw, 18px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 12px)' }}>
                <div style={{ 
                  backgroundColor: '#e0f2fe', 
                  padding: '8px', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users size={clamp(18, 2, 24)} color="#0284c7" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 'clamp(0.6rem, 1vw, 0.75rem)', color: 'var(--text-muted)' }}>
                    Clientes Únicos
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', 
                    fontWeight: 'bold' 
                  }}>
                    {reportData.orders ? new Set(reportData.orders.map(o => o.userId?._id)).size : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ventas por Departamento */}
          {reportData.byDepartment && Object.keys(reportData.byDepartment).length > 0 && (
            <div className="card" style={{ marginBottom: 'clamp(14px, 2vw, 20px)' }}>
              <h3 style={{ 
                marginBottom: 'clamp(10px, 1.5vw, 14px)', 
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: 'clamp(0.95rem, 2vw, 1.15rem)'
              }}>
                <MapPin size={clamp(16, 1.5, 20)} /> Ventas por Departamento
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 110px), 1fr))', 
                gap: 'clamp(8px, 1vw, 12px)' 
              }}>
                {Object.entries(reportData.byDepartment).map(([dept, count]) => (
                  <div key={dept} style={{
                    padding: 'clamp(8px, 1vw, 12px)',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)' 
                    }}>
                      {dept}
                    </div>
                    <div style={{ 
                      fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', 
                      fontWeight: 'bold', 
                      color: 'var(--primary-blue)' 
                    }}>
                      {count}
                    </div>
                    <div style={{ 
                      fontSize: 'clamp(0.55rem, 0.8vw, 0.65rem)', 
                      color: 'var(--text-muted)' 
                    }}>
                      pedidos
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Productos más vendidos */}
          {reportData.topProducts && reportData.topProducts.length > 0 && (
            <div className="card" style={{ marginBottom: 'clamp(14px, 2vw, 20px)' }}>
              <h3 style={{ 
                marginBottom: 'clamp(10px, 1.5vw, 14px)', 
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: 'clamp(0.95rem, 2vw, 1.15rem)'
              }}>
                🏆 Productos Más Vendidos
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {reportData.topProducts.slice(0, 5).map((product, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 'clamp(8px, 1vw, 12px) clamp(10px, 1.5vw, 14px)',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    flexWrap: 'wrap',
                    gap: '4px',
                    fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)'
                  }}>
                    <span style={{ fontWeight: idx < 3 ? 'bold' : 'normal' }}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`} {product.name}
                    </span>
                    <span style={{ fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                      {product.quantity}u - C${product.revenue.toFixed(2)}
                    </span>
                  </div>
                ))}
                {reportData.topProducts.length > 5 && (
                  <p style={{ 
                    fontSize: 'clamp(0.7rem, 1vw, 0.8rem)', 
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    margin: '4px 0 0 0'
                  }}>
                    + {reportData.topProducts.length - 5} productos más
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Últimos pedidos */}
          {reportData.orders && reportData.orders.length > 0 && (
            <div className="card">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: 'clamp(10px, 1.5vw, 14px)'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: 'clamp(0.95rem, 2vw, 1.15rem)'
                }}>
                  <FileText size={clamp(16, 1.5, 20)} /> Últimos Pedidos
                </h3>
                {reportData.orders.length > 5 && (
                  <button
                    onClick={() => setShowAllOrders(!showAllOrders)}
                    style={{
                      padding: 'clamp(4px, 0.8vw, 8px) clamp(10px, 1.5vw, 14px)',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
                      color: 'var(--primary-blue)',
                      fontWeight: 'bold',
                      minHeight: '32px'
                    }}
                  >
                    {showAllOrders ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {showAllOrders ? 'Ver menos' : `Ver más (${reportData.orders.length})`}
                  </button>
                )}
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse', 
                  fontSize: 'clamp(0.75rem, 1vw, 0.85rem)',
                  minWidth: '400px'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: 'clamp(6px, 0.8vw, 10px)', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                        Fecha
                      </th>
                      <th style={{ textAlign: 'left', padding: 'clamp(6px, 0.8vw, 10px)', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                        Cliente
                      </th>
                      <th style={{ textAlign: 'right', padding: 'clamp(6px, 0.8vw, 10px)', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                        Total
                      </th>
                      <th style={{ textAlign: 'center', padding: 'clamp(6px, 0.8vw, 10px)', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedOrders.map((order, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: 'clamp(6px, 0.8vw, 10px)' }}>
                          {new Date(order.createdAt).toLocaleDateString('es-ES')}
                        </td>
                        <td style={{ padding: 'clamp(6px, 0.8vw, 10px)' }}>
                          {order.userId?.name || 'Cliente'}
                        </td>
                        <td style={{ 
                          padding: 'clamp(6px, 0.8vw, 10px)', 
                          textAlign: 'right', 
                          fontWeight: 'bold' 
                        }}>
                          C${(order.totalAmount + order.shippingCost).toFixed(2)}
                        </td>
                        <td style={{ padding: 'clamp(6px, 0.8vw, 10px)', textAlign: 'center' }}>
                          <span style={{
                            padding: '2px 10px',
                            borderRadius: '20px',
                            fontSize: 'clamp(0.6rem, 0.8vw, 0.7rem)',
                            fontWeight: 'bold',
                            backgroundColor: order.orderStatus === 'delivered' ? '#dcfce7' :
                                           order.orderStatus === 'cancelled' ? '#fee2e2' : '#fef3c7',
                            color: order.orderStatus === 'delivered' ? '#166534' :
                                   order.orderStatus === 'cancelled' ? '#991b1b' : '#92400e',
                            whiteSpace: 'nowrap'
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

// Helper para clamp en JS
const clamp = (min, val, max) => Math.min(Math.max(min, val), max);