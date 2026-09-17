import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../Home/Footer';
import { PRODUCTS_DATA, resolveProductImage } from '../../data/productsData';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartAlert, setCartAlert] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const resolveProduct = async () => {
      setLoading(true);

      // 1. Check local catalog by id or slugified name
      let found = PRODUCTS_DATA.find((p) => {
        if (!p) return false;
        if (p.id === id || p._id === id) return true;
        const slug = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (slug === id?.toLowerCase()) return true;
        return false;
      });

      // 2. If not found or if id looks like mongo ObjectId, try backend
      if (!found) {
        try {
          const res = await axios.get(`http://localhost:5000/api/product/products/${id}`);
          if (res.data) {
            const data = res.data;
            const localMatch = PRODUCTS_DATA.find(
              (p) => p.name?.toLowerCase() === data.name?.toLowerCase()
            );
            found = {
              ...data,
              id: data._id,
              category: typeof data.category_id === 'object' ? data.category_id?.category : 'COMPONENTS',
              relImage: localMatch?.relImage,
              badge: data.is_featured ? 'FEATURED' : (localMatch?.badge || 'FEATURED'),
              discount: localMatch?.discount || '10% OFF',
              brand: 'SIPL',
              price: data.price,
              original_price: data.original_price || Math.round(data.price * 1.1),
            };
          }
        } catch (err) {
          // If direct ID fetch failed, try list
          try {
            const listRes = await axios.get('http://localhost:5000/api/product/products');
            if (Array.isArray(listRes.data)) {
              const matched = listRes.data.find(
                (item) => item._id === id || item.name?.toLowerCase() === id?.toLowerCase()
              );
              if (matched) {
                const localMatch = PRODUCTS_DATA.find(
                  (p) => p.name?.toLowerCase() === matched.name?.toLowerCase()
                );
                found = {
                  ...matched,
                  id: matched._id,
                  category: typeof matched.category_id === 'object' ? matched.category_id?.category : 'COMPONENTS',
                  relImage: localMatch?.relImage,
                  badge: matched.is_featured ? 'FEATURED' : (localMatch?.badge || 'FEATURED'),
                  discount: localMatch?.discount || '10% OFF',
                  brand: 'SIPL',
                  price: matched.price,
                  original_price: matched.original_price || Math.round(matched.price * 1.1),
                };
              }
            }
          } catch (listErr) {
            console.log('Backend fetch failed, using fallback:', listErr.message);
          }
        }
      }

      // 3. Fallback to WS2812 or first product if ID not found
      if (!found) {
        found = PRODUCTS_DATA.find((p) => p.name === 'WS2812') || PRODUCTS_DATA[0];
      }

      setProduct(found);
      setLoading(false);
    };

    resolveProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="spi-detail-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <p style={{ fontSize: '18px', color: '#78716c' }}>Loading product details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="spi-detail-page" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h2>Product Not Found</h2>
          <p>The requested product could not be located in our catalog.</p>
          <Link to="/products" style={{ color: '#c2410c', textDecoration: 'underline' }}>Back to Products</Link>
        </div>
        <Footer />
      </>
    );
  }

  // Derive display values
  const {
    name = 'WS2812',
    price = 4077,
    original_price = 4530,
    brand = 'SIPL',
    badge = 'FEATURED',
    discount = '10% OFF',
    description = 'Displays colorful RGB light effects using individually controlled LEDs. Used in decoration, indicators, animations, and lighting projects.',
    specifications = 'Lithium Ion',
    height = '80cm',
    width = '80cm',
    refund_policy = 'Yes',
    stock_units = 10,
  } = product;

  // Derive SKU / identifier for header
  const productIdDisplay = product._id || product.id || '6a1d753b113b7602017f1867';
  const skuDisplay = (product._id || product.id || '6a1d753b113b7602017f1867').toUpperCase();

  // Savings calculation
  const origPrice = original_price || Math.round(price * 1.11);
  const savings = Math.max(0, origPrice - price);

  const imageUrl = resolveProductImage(product);

  const handleAddToCart = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('cart') || '[]');
      const itemIndex = existing.findIndex((i) => i.id === product.id);
      if (itemIndex > -1) {
        existing[itemIndex].quantity += quantity;
      } else {
        existing.push({
          id: product.id || product._id,
          name: product.name,
          price: product.price,
          image: imageUrl,
          quantity: quantity,
        });
      }
      localStorage.setItem('cart', JSON.stringify(existing));
      setCartAlert(`Added ${quantity} × "${product.name}" to cart!`);
      setTimeout(() => setCartAlert(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Header />

      <main className="spi-detail-page">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Toast Notification */}
          {cartAlert && (
            <div
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: '#15803d',
                color: '#ffffff',
                padding: '12px 20px',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                zIndex: 2000,
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              ✓ {cartAlert}
            </div>
          )}

          {/* Breadcrumb Navigation */}
          <nav className="spi-detail-breadcrumb-nav" aria-label="Breadcrumb">
            <ol className="spi-detail-breadcrumb">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li className="spi-detail-breadcrumb-sep">&rsaquo;</li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li className="spi-detail-breadcrumb-sep">&rsaquo;</li>
              <li>
                <Link to={`/products/${productIdDisplay}`}>{productIdDisplay}</Link>
              </li>
              <li className="spi-detail-breadcrumb-sep">&rsaquo;</li>
              <li className="spi-detail-breadcrumb-current" aria-current="page">{name}</li>
            </ol>
          </nav>

          {/* 2-Column Detail Grid */}
          <div className="spi-detail-grid">
            {/* Left Column: Media Presentation */}
            <div className="spi-detail-media-card">
              {/* Badges Top Left */}
              <div className="spi-detail-badges-top">
                {badge && (
                  <span className="spi-detail-badge-featured">{badge}</span>
                )}
                {discount && (
                  <span className="spi-detail-badge-discount">{discount}</span>
                )}
              </div>

              {/* Product Image Canvas */}
              <div className="spi-detail-image-box">
                <img
                  src={imageUrl}
                  alt={name}
                  className="spi-detail-img"
                />
              </div>

              {/* Bottom Feature Tags */}
              <div className="spi-detail-feature-tags">
                <span className="spi-detail-tag-pill">
                  <span role="img" aria-label="chat">💬</span> Yes
                </span>
                <span className="spi-detail-tag-pill">
                  <span role="img" aria-label="refresh">🔁</span> Yes
                </span>
              </div>
            </div>

            {/* Right Column: Product Information */}
            <div className="spi-detail-info-col">
              {/* SKU / Product ID */}
              <div className="spi-detail-sku">{skuDisplay}</div>

              {/* Title */}
              <h1 className="spi-detail-title">{name}</h1>

              {/* Brand */}
              <p className="spi-detail-brand">
                By <strong>{brand}</strong>
              </p>

              {/* Orange Divider Accent */}
              <div className="spi-detail-divider" />

              {/* Pricing */}
              <div className="spi-detail-price-row">
                <span className="spi-detail-current-price">
                  ₹{Number(price).toLocaleString('en-IN')}
                </span>
                {origPrice > price && (
                  <span className="spi-detail-orig-price">
                    ₹{Number(origPrice).toLocaleString('en-IN')}
                  </span>
                )}
                {savings > 0 && (
                  <span className="spi-detail-save-pill">
                    You save ₹{Number(savings).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="spi-detail-stock">
                ✓ In Stock ({stock_units} units)
              </div>

              {/* Description Card */}
              <div className="spi-detail-card-box">
                <div className="spi-detail-box-label">DESCRIPTION</div>
                <p className="spi-detail-box-text">{description}</p>
              </div>

              {/* Specifications Card */}
              <div className="spi-detail-card-box">
                <div className="spi-detail-box-label">SPECIFICATIONS</div>
                <p className="spi-detail-box-text">{specifications}</p>
              </div>

              {/* Dimensions Grid (Height / Width) */}
              <div className="spi-detail-dimensions-row">
                <div className="spi-detail-dimension-card">
                  <div className="spi-detail-dim-label">HEIGHT</div>
                  <div className="spi-detail-dim-val">{height}</div>
                </div>
                <div className="spi-detail-dimension-card">
                  <div className="spi-detail-dim-label">WIDTH</div>
                  <div className="spi-detail-dim-val">{width}</div>
                </div>
              </div>

              {/* Refund Policy Banner */}
              <div className="spi-detail-refund-banner">
                <span role="img" aria-label="shield">🛡️</span>
                <span><strong>Refund Policy:</strong> {refund_policy}</span>
              </div>

              {/* Actions: Quantity Picker & Add to Cart */}
              <div className="spi-detail-actions-row">
                <div className="spi-detail-qty-picker">
                  <button
                    type="button"
                    className="spi-detail-qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="spi-detail-qty-num">{quantity}</span>
                  <button
                    type="button"
                    className="spi-detail-qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="spi-detail-add-cart-btn"
                  onClick={handleAddToCart}
                >
                  Add to Cart (₹{(price * quantity).toLocaleString('en-IN')})
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetail;
