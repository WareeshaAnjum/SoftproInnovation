import React from 'react'
import {
  LayoutGrid, Tags, Package, ShoppingCart, Users,
  Boxes, MessageSquare, LogOut, Moon, ChevronRight,
  ChevronLeft, Plus, Wrench, ClipboardList, ShieldCheck, MessageCircle
} from 'lucide-react';
const AdminHome = () => {
    const stats = [
    { label: 'Total Products', value: 72, icon: '📦', bg: 'stat-orange' },
    { label: 'Categories', value: 10, icon: '🏷️', bg: 'stat-blue' },
    { label: 'Total Orders', value: 0, icon: '🛒', bg: 'stat-green' },
    { label: 'Total Users', value: 9, icon: '👥', bg: 'stat-purple' },
  ];
  return (
    <div>
           <h1 className="page-title">
            Admin <span className="italic-accent">Overview</span>
          </h1>
          <p className="page-subtitle">
            Real-time statistics and summary of Softpro Innovation
          </p>

          <div className="stats-grid">
            {stats.map((s) => (
              <div key={s.label} className={`stat-card ${s.bg}`}>
                <span className="stat-icon">{s.icon}</span>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="panels-grid">
            <div className="panel">
              <h2 className="panel-title">Quick Administration Actions</h2>
              <div className="action-list">
                <button className="action-btn primary">
                  <Plus size={16} /> Add New Product
                </button>
                <button className="action-btn">
                  <Wrench size={16} /> Add Category
                </button>
                <button className="action-btn">
                  <ClipboardList size={16} /> Monitor Inventory Stock
                </button>
              </div>
            </div>

            <div className="panel">
              <h2 className="panel-title">System Health &amp; Notifications</h2>
              <div className="notice notice-green">
                <ShieldCheck size={18} className="notice-icon" />
                <div>
                  <p className="notice-title">Helmet Security Enabled</p>
                  <p className="notice-body">
                    HTTP security headers are verified active and secure.
                  </p>
                </div>
              </div>
              <div className="notice notice-blue">
                <MessageCircle size={18} className="notice-icon" />
                <div>
                  <p className="notice-title">Customer Complaints Received</p>
                  <p className="notice-body">
                    There are currently 2 total customer message inquiries.{' '}
                    <a href="/complaints">Review messages →</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}

export default AdminHome