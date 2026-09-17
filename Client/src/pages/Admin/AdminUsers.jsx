import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, UserPlus, Trash2, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'Customer',
    gender: 'male',
  });
  const [userAlert, setUserAlert] = useState(null);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch real registered customers from MongoDB
      let customerList = [];
      try {
        const userRes = await axios.get('http://localhost:5000/api/user/show');
        if (userRes.data && Array.isArray(userRes.data.data)) {
          customerList = userRes.data.data.map((u) => ({
            ...u,
            role: 'Customer',
          }));
        }
      } catch (userErr) {
        console.warn('User fetch error:', userErr.message);
      }

      // 2. Fetch real registered admins from MongoDB
      let adminList = [];
      try {
        const adminRes = await axios.get('http://localhost:5000/api/admin/show');
        if (adminRes.data && Array.isArray(adminRes.data.data)) {
          adminList = adminRes.data.data.map((a) => ({
            ...a,
            role: 'Admin',
            status: 'active',
          }));
        }
      } catch (adminErr) {
        console.warn('Admin fetch error:', adminErr.message);
      }

      // Combine real accounts only
      const combined = [...adminList, ...customerList];
      setUsers(combined);
    } catch (err) {
      console.error('Error fetching registered accounts:', err);
      setError('Unable to load registered accounts from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus, role) => {
    if (role === 'Admin') {
      alert('Administrator status cannot be deactivated from this panel.');
      return;
    }

    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.patch(`http://localhost:5000/api/user/profile/${userId}`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
      setUserAlert(`User account status changed to "${newStatus}"`);
      setTimeout(() => setUserAlert(null), 3000);
    } catch (e) {
      alert('Failed to update status on server.');
    }
  };

  const handleDeleteUser = async (userId, name, role) => {
    if (!window.confirm(`Are you sure you want to delete ${role} "${name}" from the database?`)) return;

    try {
      if (role === 'Admin') {
        await axios.delete(`http://localhost:5000/api/admin/${userId}`);
      } else {
        await axios.delete(`http://localhost:5000/api/user/${userId}`);
      }
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setUserAlert(`Account "${name}" deleted from database`);
      setTimeout(() => setUserAlert(null), 3000);
    } catch (e) {
      alert('Failed to delete account from server.');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      if (newUser.role === 'Admin') {
        const res = await axios.post('http://localhost:5000/api/admin/register', {
          name: newUser.name.trim(),
          email: newUser.email.trim(),
          password: newUser.password,
        });
        if (res.data) {
          setShowAddModal(false);
          setUserAlert(`Administrator "${newUser.name}" registered in database`);
          setTimeout(() => setUserAlert(null), 3000);
          fetchUsers();
        }
      } else {
        const res = await axios.post('http://localhost:5000/api/user/register', {
          name: newUser.name.trim(),
          email: newUser.email.trim(),
          mobile: newUser.mobile ? newUser.mobile.trim() : '',
          password: newUser.password,
          gender: newUser.gender || 'other',
          status: 'active',
        });
        if (res.data && res.data.success) {
          setShowAddModal(false);
          setUserAlert(`Customer account "${newUser.name}" registered in database`);
          setTimeout(() => setUserAlert(null), 3000);
          fetchUsers();
        } else {
          alert(res.data?.msg || 'Registration failed');
        }
      }
      setNewUser({ name: '', email: '', mobile: '', password: '', role: 'Customer', gender: 'male' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Error registering account in database');
    }
  };

  // Filtered Users (Search + Role)
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.mobile?.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const totalRegistered = users.length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const customerCount = users.filter((u) => u.role === 'Customer').length;

  return (
    <div className="pc-page p-4">
      {/* Toast Alert */}
      {userAlert && (
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
          ✓ {userAlert}
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="page-title mb-1">
            Registered <span className="italic-accent">Users &amp; Admins</span>
          </h1>
          <p className="page-subtitle mb-0">
            Real registered accounts stored in the MongoDB database
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          <button
            type="button"
            onClick={fetchUsers}
            className="btn btn-outline-orangered d-flex align-items-center gap-2"
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh from DB
          </button>
          <button
            type="button"
            className="btn btn-orangered d-flex align-items-center gap-2"
            style={{ fontSize: '13px', padding: '8px 16px' }}
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={16} /> Register New Account
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning d-flex align-items-center gap-2 mb-4" role="alert">
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">TOTAL REGISTERED</span>
              <Users size={18} color="var(--spi-orange)" />
            </div>
            <div className="pc-stat-value">{totalRegistered}</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">ACTIVE ACCOUNTS</span>
              <span style={{ fontSize: '14px', color: '#16a34a', fontWeight: '700' }}>● Active</span>
            </div>
            <div className="pc-stat-value" style={{ color: '#16a34a' }}>{activeCount}</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">ADMINISTRATORS</span>
              <ShieldCheck size={18} color="var(--spi-orange)" />
            </div>
            <div className="pc-stat-value" style={{ color: 'var(--spi-orange)' }}>{adminCount}</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">REGISTERED CUSTOMERS</span>
              <Users size={18} color="#3b82f6" />
            </div>
            <div className="pc-stat-value">{customerCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="pc-table-card p-3 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
          <div className="pc-search">
            <Search size={16} />
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by name, email, or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Filter Role:
            </span>
            {['All', 'Customer', 'Admin'].map((r) => (
              <button
                key={r}
                type="button"
                className={`btn btn-sm ${roleFilter === r ? 'btn-orangered' : 'btn-outline-orangered'}`}
                style={{ fontSize: '12px', padding: '4px 12px' }}
                onClick={() => setRoleFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="pc-table-card">
        <div className="table-responsive">
          <table className="table pc-table mb-0">
            <thead>
              <tr>
                <th>Account</th>
                <th>Contact Info</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    Loading accounts from database...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const initials = u.name
                    ? u.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : (u.email ? u.email[0].toUpperCase() : 'U');

                  return (
                    <tr key={u._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: u.role === 'Admin' ? 'var(--spi-orange)' : 'var(--bg-surface-secondary)',
                              color: u.role === 'Admin' ? '#ffffff' : 'var(--text-primary)',
                              border: '1px solid var(--border-color)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '13px',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                              {u.name || 'Anonymous User'}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              ID: {u._id ? u._id.slice(-6) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{u.email}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.mobile || 'Not provided'}</div>
                      </td>
                      <td>
                        <span
                          className="user-status-pill"
                          style={{
                            backgroundColor: u.role === 'Admin' ? 'var(--spi-orange-light)' : 'var(--bg-surface-secondary)',
                            color: u.role === 'Admin' ? 'var(--spi-orange)' : 'var(--text-secondary)',
                            border: `1px solid ${u.role === 'Admin' ? 'var(--spi-orange-border)' : 'var(--border-color)'}`,
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.role === 'Admin' ? (
                          <span className="pc-badge pc-badge-active">Active</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u._id, u.status, u.role)}
                            className={`btn btn-sm ${u.status === 'active' ? 'pc-badge-active' : 'pc-badge-inactive'}`}
                            style={{ border: 'none', cursor: 'pointer' }}
                          >
                            {u.status === 'active' ? 'Active' : 'Inactive'}
                          </button>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Registered'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm p-1 px-2"
                          onClick={() => handleDeleteUser(u._id, u.name || u.email, u.role)}
                          title={`Delete ${u.role}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No registered accounts found in the database.
                    <br />
                    <small>When users create an account via Sign Up or admin register, they will appear here.</small>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="pc-overlay" onClick={() => setShowAddModal(false)}>
          <div className="pc-modal p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="mb-0" style={{ fontWeight: '700' }}>Register New Account</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              />
            </div>

            <form onSubmit={handleAddUser}>
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: '600' }}>Account Role</label>
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="Customer">Customer Account</option>
                  <option value="Admin">Administrator Account</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: '600' }}>Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: '600' }}>Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="name@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              {newUser.role === 'Customer' && (
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: '12.5px', fontWeight: '600' }}>Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={newUser.mobile}
                    onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: '600' }}>Password *</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-orangered"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-orangered">
                  Save in Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
