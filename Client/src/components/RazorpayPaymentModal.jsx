import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, ExternalLink, QrCode, ShieldCheck, CheckCircle2, AlertCircle, X, Copy, Check, Smartphone } from 'lucide-react';

const USER_UPI_ID = '9432414877@ibl';
const RAZORPAY_ME_URL = 'https://razorpay.me/@wareeshaanjum';

const RazorpayPaymentModal = ({
  isOpen,
  onClose,
  amount = 0,
  items = [],
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('upi_qr'); // 'upi_qr' | 'razorpay_link'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOrderComplete(false);
      setError('');
      setLoading(false);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmountFormatted = Number(amount).toLocaleString('en-IN');
  const upiPayString = `upi://pay?pa=${USER_UPI_ID}&pn=Wareesha%20Anjum&am=${amount}&cu=INR&tn=SoftPro%20Innovation%20Order`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPayString)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(USER_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmOrder = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        customer_name: customerName || 'Valued Customer',
        customer_email: customerEmail || 'customer@softpro.com',
        customer_phone: customerPhone || '+91 9876543210',
        items: items.map((i) => ({
          product_id: i.id || i._id,
          name: i.name,
          quantity: i.quantity || 1,
          price: i.price,
        })),
        total_amount: amount,
        payment_method: `UPI Payment (9432414877@ibl)`,
        shipping_address: 'Registered User Address, SoftPro Store',
      };

      const res = await axios.post('http://localhost:5000/api/order', payload);

      if (res.data && res.data.data) {
        setOrderId(res.data.data.order_id || res.data.data._id);
        setOrderComplete(true);
        if (onSuccess) onSuccess(res.data.data);
      } else {
        setError('Order created, but server response was invalid.');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.response?.data?.msg || 'Failed to confirm order with server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRazorpayMe = () => {
    window.open(RAZORPAY_ME_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '490px',
          backgroundColor: 'var(--bg-surface, #ffffff)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          border: '1px solid var(--border-color, #e2e8f0)',
          color: 'var(--text-primary, #1e293b)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '20px 24px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(249, 115, 22, 0.4)',
              }}
            >
              <ShieldCheck size={22} color="#f97316" />
            </div>
            <div>
              <h5 style={{ margin: 0, fontWeight: '700', fontSize: '18px', color: '#ffffff' }}>
                UPI &amp; Online Payment <span style={{ color: '#f97316' }}>Gateway</span>
              </h5>
              <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#94a3b8' }}>
                Direct Receiver: <strong>Wareesha Anjum</strong> ({USER_UPI_ID})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {orderComplete ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(22, 163, 74, 0.15)',
                  color: '#16a34a',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ fontWeight: '700', fontSize: '20px', marginBottom: '8px' }}>
                Payment Received &amp; Order Confirmed!
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary, #64748b)', marginBottom: '16px' }}>
                Thank you! Your payment to <strong>9432414877@ibl</strong> has been recorded and order <strong>#{orderId}</strong> is active.
              </p>
              <div
                style={{
                  backgroundColor: 'var(--bg-surface-secondary, #f8fafc)',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  marginBottom: '20px',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  textAlign: 'left',
                }}
              >
                <div style={{ marginBottom: '4px' }}><strong>Total Amount Paid:</strong> ₹{totalAmountFormatted}</div>
                <div style={{ marginBottom: '4px' }}><strong>UPI Receiver Account:</strong> 9432414877@ibl (SBI - 1792)</div>
                <div><strong>Merchant Name:</strong> Wareesha Anjum</div>
              </div>
              <button
                type="button"
                className="btn btn-orangered"
                style={{ width: '100%', padding: '10px 16px', fontWeight: '700' }}
                onClick={onClose}
              >
                Close &amp; View Orders
              </button>
            </div>
          ) : (
            <div>
              {error && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={16} />
                  <div>{error}</div>
                </div>
              )}

              {/* Amount Banner */}
              <div
                style={{
                  backgroundColor: 'var(--spi-orange-light, #fff7ed)',
                  border: '1px solid var(--spi-orange-border, #ffedd5)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #78716c)', display: 'block', fontWeight: '600' }}>
                    TOTAL AMOUNT TO PAY
                  </span>
                  <span style={{ fontSize: '26px', fontWeight: '800', color: 'var(--spi-orange, #ea580c)' }}>
                    ₹{totalAmountFormatted}
                  </span>
                </div>
                <span
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#0f172a',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  INR 🇮🇳
                </span>
              </div>

              {/* Payment Option Selector */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_qr')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: paymentMethod === 'upi_qr' ? '2px solid var(--spi-orange, #ea580c)' : '1px solid var(--border-color, #cbd5e1)',
                    borderRadius: '10px',
                    backgroundColor: paymentMethod === 'upi_qr' ? 'var(--bg-surface, #ffffff)' : 'var(--bg-surface-secondary, #f8fafc)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: '13px',
                    color: paymentMethod === 'upi_qr' ? 'var(--spi-orange, #ea580c)' : 'var(--text-secondary, #64748b)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <QrCode size={20} />
                  Scan PhonePe / UPI QR
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay_link')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: paymentMethod === 'razorpay_link' ? '2px solid var(--spi-orange, #ea580c)' : '1px solid var(--border-color, #cbd5e1)',
                    borderRadius: '10px',
                    backgroundColor: paymentMethod === 'razorpay_link' ? 'var(--bg-surface, #ffffff)' : 'var(--bg-surface-secondary, #f8fafc)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: '13px',
                    color: paymentMethod === 'razorpay_link' ? 'var(--spi-orange, #ea580c)' : 'var(--text-secondary, #64748b)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CreditCard size={20} />
                  Razorpay Link
                </button>
              </div>

              {/* Option 1: PhonePe / SBI UPI QR Code */}
              {paymentMethod === 'upi_qr' && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  {/* QR Box */}
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '14px',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      marginBottom: '14px',
                      border: '2px solid var(--spi-orange-border, #ffedd5)',
                    }}
                  >
                    <img
                      src={qrCodeUrl}
                      alt="SBI PhonePe UPI QR Code (9432414877@ibl)"
                      style={{ width: '210px', height: '210px', display: 'block' }}
                    />
                    <div style={{ marginTop: '8px', fontSize: '11.5px', color: '#16a34a', fontWeight: '700' }}>
                      ● State Bank of India (- 1792)
                    </div>
                  </div>

                  {/* Copy UPI ID Box */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface-secondary, #f8fafc)',
                      border: '1px solid var(--border-color, #e2e8f0)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', display: 'block' }}>
                        DIRECT RECEIVER UPI ID:
                      </span>
                      <strong style={{ fontSize: '15px', color: 'var(--text-primary, #0f172a)' }}>
                        {USER_UPI_ID}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      style={{
                        backgroundColor: copied ? '#16a34a' : 'var(--spi-orange, #ea580c)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12.5px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy UPI'}
                    </button>
                  </div>

                  {/* Direct Mobile UPI Trigger */}
                  <a
                    href={upiPayString}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      color: 'var(--spi-orange, #ea580c)',
                      fontWeight: '700',
                      textDecoration: 'none',
                      backgroundColor: 'var(--spi-orange-light, #fff7ed)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--spi-orange-border, #ffedd5)',
                    }}
                  >
                    <Smartphone size={15} /> Open GPay / PhonePe / Paytm App →
                  </a>
                </div>
              )}

              {/* Option 2: Razorpay Link */}
              {paymentMethod === 'razorpay_link' && (
                <div>
                  <div
                    style={{
                      border: '1px dashed var(--spi-orange-border, #fed7aa)',
                      borderRadius: '14px',
                      padding: '18px',
                      backgroundColor: 'var(--bg-surface-secondary, #f8fafc)',
                      textAlign: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary, #475569)', margin: '0 0 14px 0' }}>
                      Pay via Cards, Netbanking, or Razorpay handle for <strong>Wareesha Anjum</strong>:
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenRazorpayMe}
                      style={{
                        backgroundColor: '#072654',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 22px',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(7,38,84,0.3)',
                      }}
                    >
                      Pay ₹{totalAmountFormatted} on Razorpay <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  className="btn btn-outline-orangered"
                  onClick={onClose}
                  style={{ flex: 1, padding: '10px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-orangered"
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  style={{ flex: 2, padding: '10px', fontWeight: '700' }}
                >
                  {loading ? 'Confirming Order...' : 'I Have Paid • Confirm Order'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RazorpayPaymentModal;

