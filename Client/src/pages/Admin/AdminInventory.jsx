import React, { useState } from 'react';
import { PRODUCTS_DATA } from '../../data/productsData';
import { Boxes, Search, AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';

const AdminInventory = () => {
  const [search, setSearch] = useState('');
  const [filterStock, setFilterStock] = useState('All');

  const inventoryItems = PRODUCTS_DATA.map((p, idx) => ({
    ...p,
    stockQty: (idx % 7 === 0) ? 4 : (idx % 5 === 0) ? 12 : 45,
    minThreshold: 15,
  }));

  const filtered = inventoryItems.filter((item) => {
    const isLow = item.stockQty <= item.minThreshold;
    if (filterStock === 'Low Stock' && !isLow) return false;
    if (filterStock === 'In Stock' && isLow) return false;
    const q = search.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });

  const lowStockCount = inventoryItems.filter((i) => i.stockQty <= i.minThreshold).length;

  return (
    <div className="pc-page p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="page-title mb-1">
            Stock <span className="italic-accent">Inventory</span>
          </h1>
          <p className="page-subtitle mb-0">
            Real-time component stock levels, threshold alerts, and re-order management
          </p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-4">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">TOTAL SKUs MONITORED</span>
              <Boxes size={18} color="var(--spi-orange)" />
            </div>
            <div className="pc-stat-value">{inventoryItems.length}</div>
          </div>
        </div>
        <div className="col-6 col-lg-4">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">LOW STOCK WARNINGS</span>
              <AlertTriangle size={18} color="#ef4444" />
            </div>
            <div className="pc-stat-value" style={{ color: '#ef4444' }}>{lowStockCount}</div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">ADEQUATELY STOCKED</span>
              <CheckCircle size={18} color="#16a34a" />
            </div>
            <div className="pc-stat-value" style={{ color: '#16a34a' }}>{inventoryItems.length - lowStockCount}</div>
          </div>
        </div>
      </div>

      <div className="pc-table-card p-3 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
          <div className="pc-search">
            <Search size={16} />
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search components or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            {['All', 'Low Stock', 'In Stock'].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn btn-sm ${filterStock === st ? 'btn-orangered' : 'btn-outline-orangered'}`}
                style={{ fontSize: '12px', padding: '4px 12px' }}
                onClick={() => setFilterStock(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pc-table-card">
        <div className="table-responsive">
          <table className="table pc-table mb-0">
            <thead>
              <tr>
                <th>Component</th>
                <th>Category</th>
                <th>Unit Price</th>
                <th>Units in Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</div>
                    <small style={{ color: 'var(--text-muted)' }}>ID: {item.id}</small>
                  </td>
                  <td>
                    <span style={{ fontSize: '12.5px', color: 'var(--spi-orange)', fontWeight: '600' }}>
                      {item.category}
                    </span>
                  </td>
                  <td>₹{item.price?.toLocaleString('en-IN')}</td>
                  <td>
                    <span style={{ fontWeight: '700', color: item.stockQty <= item.minThreshold ? '#ef4444' : 'var(--text-primary)' }}>
                      {item.stockQty} units
                    </span>
                  </td>
                  <td>
                    {item.stockQty <= item.minThreshold ? (
                      <span className="user-status-pill" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                        Low Stock Alert
                      </span>
                    ) : (
                      <span className="user-status-pill user-status-delivered">
                        Healthy
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-orangered btn-sm d-flex align-items-center gap-1"
                      style={{ fontSize: '12px', padding: '4px 10px' }}
                      onClick={() => alert(`Restock request sent to supplier for "${item.name}"`)}
                    >
                      Restock <ArrowUpRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
