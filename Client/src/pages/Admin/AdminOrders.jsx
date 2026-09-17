import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Search, Eye, Filter, RefreshCw, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdateAlert, setStatusUpdateAlert] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/order');
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.warn('Orders fetch error:', err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/order/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId || o.order_id === orderId ? { ...o, status: newStatus } : o))
      );

      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.order_id === orderId)) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }

      setStatusUpdateAlert(`Order status updated to "${newStatus}"`);
      setTimeout(() => setStatusUpdateAlert(null), 3000);
    } catch (e) {
      alert('Failed to update order status on server.');
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.order_id?.toLowerCase().includes(q) ||
      order.customer_name?.toLowerCase().includes(q) ||
      order.customer_email?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Calculate totals
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const processingCount = orders.filter((o) => o.status === 'Processing').length;
  const shippedCount = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Processing':
        return (
          <span className="user-status-pill user-status-transit d-inline-flex align-items-center gap-1">
            <Clock size={12} /> Processing
          </span>
        );
      case 'Shipped':
        return (
          <span
            className="user-status-pill d-inline-flex align-items-center gap-1"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}
          >
            <Truck size={12} /> Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span className="user-status-pill user-status-delivered d-inline-flex align-items-center gap-1">
            <CheckCircle2 size={12} /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="user-status-pill user-status-cancelled d-inline-flex align-items-center gap-1">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return <span className="user-status-pill">{status || 'Pending'}</span>;
    }
  };

  return (
    <div className="pc-page p-4">
      {/* Toast */}
      {statusUpdateAlert && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--spi-orange)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            zIndex: 2000,
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          ✓ {statusUpdateAlert}
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="page-title mb-1">
            Orders <span className="italic-accent">Management</span>
          </h1>
          <p className="page-subtitle mb-0">
            Real customer orders stored in the MongoDB database
          </p>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          className="btn btn-outline-orangered mt-3 mt-md-0 d-flex align-items-center gap-2"
          style={{ fontSize: '13px', padding: '8px 16px' }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Orders
        </button>
      </div>

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">TOTAL ORDERS</span>
              <ShoppingCart size={18} color="var(--spi-orange)" />
            </div>
            <div className="pc-stat-value">{orders.length}</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">PROCESSING</span>
              <Clock size={18} color="#ea580c" />
            </div>
            <div className="pc-stat-value" style={{ color: '#ea580c' }}>{processingCount}</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">SHIPPED &amp; DELIVERED</span>
              <Truck size={18} color="#16a34a" />
            </div>
            <div className="pc-stat-value" style={{ color: '#16a34a' }}>{shippedCount + deliveredCount}</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">TOTAL REVENUE</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--spi-orange)' }}>₹</span>
            </div>
            <div className="pc-stat-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="pc-table-card p-3 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
          <div className="pc-search">
            <Search size={16} />
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by Order ID or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              <Filter size={14} className="me-1" /> Filter Status:
            </span>
            {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn btn-sm ${statusFilter === st ? 'btn-orangered' : 'btn-outline-orangered'}`}
                style={{ fontSize: '12px', padding: '4px 12px' }}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="pc-table-card">
        <div className="table-responsive">
          <table className="table pc-table mb-0">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    Loading orders from database...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id || order.order_id}>
                    <td>
                      <span style={{ fontWeight: '700', color: 'var(--spi-orange)', fontSize: '13.5px' }}>
                        {order.order_id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                        {order.customer_name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {order.customer_email}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {order.items?.length || 1} Item(s)
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.items?.map((i) => `${i.name} (x${i.quantity || 1})`).join(', ')}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14.5px' }}>
                        ₹{Number(order.total_amount).toLocaleString('en-IN')}
                      </span>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {order.payment_method}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-orangered btn-sm d-flex align-items-center gap-1"
                          style={{ fontSize: '12px', padding: '4px 10px' }}
                          onClick={() => setSelectedOrder(order)}
                          title="View Order Details"
                        >
                          <Eye size={13} /> View
                        </button>
                        <select
                          className="form-select form-select-sm"
                          style={{ width: '120px', fontSize: '12px', padding: '3px 8px', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No customer orders placed yet in the database.
                    <br />
                    <small>When customers place orders from the catalog, they will appear here in real time.</small>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="pc-overlay" onClick={() => setSelectedOrder(null)}>
          <div
            className="pc-modal p-4"
            style={{ maxWidth: '580px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <h5 className="mb-0" style={{ fontWeight: '700' }}>
                  Order Details: <span style={{ color: 'var(--spi-orange)' }}>{selectedOrder.order_id}</span>
                </h5>
                <small style={{ color: 'var(--text-muted)' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close"
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>CUSTOMER</div>
                <div style={{ fontWeight: '600' }}>{selectedOrder.customer_name}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{selectedOrder.customer_email}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{selectedOrder.customer_phone}</div>
              </div>
              <div className="col-6">
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>SHIPPING ADDRESS</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  {selectedOrder.shipping_address?.street || 'Customer Address'}
                  <br />
                  {selectedOrder.shipping_address?.city || ''}, {selectedOrder.shipping_address?.state || ''} - {selectedOrder.shipping_address?.pincode || ''}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '8px' }}>
                ITEMS ORDERED
              </div>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex justify-content-between align-items-center p-2 px-3 border-bottom"
                    style={{ backgroundColor: 'var(--bg-surface-secondary)' }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13.5px' }}>{item.name}</div>
                      <small style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity || 1} × ₹{Number(item.price).toLocaleString('en-IN')}</small>
                    </div>
                    <div style={{ fontWeight: '700', color: 'var(--spi-orange)' }}>
                      ₹{((item.quantity || 1) * item.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
                  <span style={{ fontWeight: '700' }}>Grand Total</span>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--spi-orange)' }}>
                    ₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-2">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Status:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <button
                type="button"
                className="btn btn-orangered"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
