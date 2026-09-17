import React, { useState } from 'react';
import { MessageSquare, Search, CheckCircle, Clock, Send } from 'lucide-react';

const INITIAL_COMPLAINTS = [
  {
    id: 'TKT-101',
    user: 'Rahul Mehta',
    email: 'rahul.maker@outlook.com',
    subject: 'Delayed dispatch on Order #SPI-84918',
    message: 'Hello team, I ordered Arduino UNO and Motor Driver 2 days ago. Could you please provide tracking details?',
    status: 'Open',
    date: '14 Sep 2026',
    priority: 'High',
  },
  {
    id: 'TKT-102',
    user: 'Priya Nair',
    email: 'priya.iot@gmail.com',
    subject: 'Inquiry regarding bulk ESP32 sensors',
    message: 'We are ordering 50 units for college lab. Is there educational institution discount available?',
    status: 'Resolved',
    date: '12 Sep 2026',
    priority: 'Normal',
  },
];

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [replyText, setReplyText] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleResolve = (id) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Resolved' } : c))
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => ({ ...prev, status: 'Resolved' }));
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    alert(`Reply sent to ${selectedTicket.email}: "${replyText}"`);
    handleResolve(selectedTicket.id);
    setReplyText('');
    setSelectedTicket(null);
  };

  return (
    <div className="pc-page p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="page-title mb-1">
            Customer <span className="italic-accent">Inquiries &amp; Complaints</span>
          </h1>
          <p className="page-subtitle mb-0">
            Review support messages, inquiries, and respond to customers
          </p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-4">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">TOTAL INQUIRIES</span>
              <MessageSquare size={18} color="var(--spi-orange)" />
            </div>
            <div className="pc-stat-value">{complaints.length}</div>
          </div>
        </div>
        <div className="col-6 col-lg-4">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">PENDING TICKETS</span>
              <Clock size={18} color="#ea580c" />
            </div>
            <div className="pc-stat-value" style={{ color: '#ea580c' }}>
              {complaints.filter((c) => c.status === 'Open').length}
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">RESOLVED TICKETS</span>
              <CheckCircle size={18} color="#16a34a" />
            </div>
            <div className="pc-stat-value" style={{ color: '#16a34a' }}>
              {complaints.filter((c) => c.status === 'Resolved').length}
            </div>
          </div>
        </div>
      </div>

      <div className="pc-table-card">
        <div className="table-responsive">
          <table className="table pc-table mb-0">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span style={{ fontWeight: '700', color: 'var(--spi-orange)' }}>{c.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{c.user}</div>
                    <small style={{ color: 'var(--text-muted)' }}>{c.email}</small>
                  </td>
                  <td>
                    <div style={{ fontWeight: '500' }}>{c.subject}</div>
                    <small style={{ color: 'var(--text-muted)' }}>{c.message.slice(0, 50)}...</small>
                  </td>
                  <td>
                    <span className="user-status-pill" style={{ backgroundColor: c.priority === 'High' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-surface-secondary)', color: c.priority === 'High' ? '#ef4444' : 'var(--text-secondary)' }}>
                      {c.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`user-status-pill ${c.status === 'Resolved' ? 'user-status-delivered' : 'user-status-transit'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td><small style={{ color: 'var(--text-muted)' }}>{c.date}</small></td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-orangered btn-sm"
                      style={{ fontSize: '12px' }}
                      onClick={() => setSelectedTicket(c)}
                    >
                      Respond
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <div className="pc-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="pc-modal p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="mb-0" style={{ fontWeight: '700' }}>Support Ticket: {selectedTicket.id}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedTicket(null)}
                aria-label="Close"
              />
            </div>

            <div className="mb-3">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>CUSTOMER &amp; SUBJECT</div>
              <div style={{ fontWeight: '600' }}>{selectedTicket.user} ({selectedTicket.email})</div>
              <div style={{ fontSize: '13.5px', color: 'var(--spi-orange)', fontWeight: '600', marginTop: '4px' }}>
                {selectedTicket.subject}
              </div>
            </div>

            <div className="p-3 mb-3" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13.5px' }}>
              {selectedTicket.message}
            </div>

            <form onSubmit={handleSendReply}>
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: '600' }}>Reply to Customer</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Type official reply message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-orangered"
                  onClick={() => handleResolve(selectedTicket.id)}
                >
                  Mark as Resolved
                </button>
                <button type="submit" className="btn btn-orangered d-flex align-items-center gap-1">
                  <Send size={14} /> Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
