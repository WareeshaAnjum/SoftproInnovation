import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../Home/Footer';
import ProductCard from './ProductCard';
import { CATEGORIES, PRODUCTS_DATA, resolveProductImage } from '../../data/productsData';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState(PRODUCTS_DATA);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Featured');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartAlert, setCartAlert] = useState(null);

  // Fetch from backend API if available, fallback smoothly to curated catalog
  useEffect(() => {
    const fetchBackendProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/product/products');
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Map backend items to frontend format
          const mapped = res.data.map((item) => {
            const catName = typeof item.category_id === 'object' && item.category_id?.category
              ? item.category_id.category
              : 'COMPONENTS';

            // Find matching local asset for crisp image rendering if available
            const localMatch = PRODUCTS_DATA.find((p) => p.name.toLowerCase() === item.name.toLowerCase());

            return {
              ...item,
              id: item._id,
              category: catName,
              relImage: localMatch?.relImage,
              badge: item.is_featured ? 'FEATURED' : (localMatch?.badge || 'POPULAR'),
              discount: localMatch?.discount || '10% OFF',
              brand: 'SIPL',
              price: item.price,
              original_price: item.original_price || Math.round(item.price * 1.1),
            };
          });
          setProducts(mapped);
        }
      } catch (err) {
        // Backend not reachable or offline; PRODUCTS_DATA already loaded
        console.log('Using bundled electronics catalog:', err.message);
      }
    };

    fetchBackendProducts();
  }, []);

  // Filter and Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        // Category Filter
        if (activeCategory !== 'All') {
          const cat = (prod.category || prod.category_id?.category || '').toLowerCase();
          if (cat !== activeCategory.toLowerCase()) {
            return false;
          }
        }

        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = (prod.name || '').toLowerCase().includes(q);
          const catMatch = (prod.category || '').toLowerCase().includes(q);
          const descMatch = (prod.description || prod.short_description || '').toLowerCase().includes(q);
          return nameMatch || catMatch || descMatch;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Price: Low to High') {
          return a.price - b.price;
        }
        if (sortBy === 'Price: High to Low') {
          return b.price - a.price;
        }
        if (sortBy === 'Name: A-Z') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'Highest Discount') {
          const discA = a.original_price ? (a.original_price - a.price) / a.original_price : 0;
          const discB = b.original_price ? (b.original_price - b.price) / b.original_price : 0;
          return discB - discA;
        }
        // 'Featured'
        if (a.badge === 'FEATURED' && b.badge !== 'FEATURED') return -1;
        if (b.badge === 'FEATURED' && a.badge !== 'FEATURED') return 1;
        return 0;
      });
  }, [products, activeCategory, searchQuery, sortBy]);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product, qty) => {
    try {
      const existing = JSON.parse(localStorage.getItem('cart') || '[]');
      const itemIndex = existing.findIndex((i) => i.id === product.id);
      if (itemIndex > -1) {
        existing[itemIndex].quantity += qty;
      } else {
        existing.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: resolveProductImage(product),
          quantity: qty,
        });
      }
      localStorage.setItem('cart', JSON.stringify(existing));
      setCartAlert(`Added ${qty} × "${product.name}" to cart!`);
      setTimeout(() => setCartAlert(null), 3000);
      handleCloseModal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Header />

      <main className="spi-products-page">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="spi-breadcrumb-nav" aria-label="Breadcrumb">
            <ol className="spi-breadcrumb">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li className="spi-breadcrumb-separator" aria-hidden="true">&rsaquo;</li>
              <li className="spi-breadcrumb-current" aria-current="page">Products</li>
            </ol>
          </nav>

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

          {/* Title and Subtitle */}
          <header className="spi-header-section">
            <h1 className="spi-main-title">
              All <span className="spi-italic-accent">Products</span>
            </h1>
            <div className="spi-title-divider" />
            <p className="spi-subtitle">
              Browse 72 electronics components, boards, and accessories.
            </p>
          </header>

          {/* Search and Sort Controls */}
          <div className="spi-controls-row">
            <div className="spi-search-wrapper">
              <span className="spi-search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                className="spi-search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
            </div>

            <div className="spi-sort-wrapper">
              <label htmlFor="sort-select" className="spi-sort-label">Sort:</label>
              <select
                id="sort-select"
                className="spi-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Featured">Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Name: A-Z">Name: A-Z</option>
                <option value="Highest Discount">Highest Discount</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="spi-categories-pills" role="tablist" aria-label="Category Filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={`spi-category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Count */}
          <div className="spi-count-label">
            Showing {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="spi-products-grid">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id || prod._id}
                  product={prod}
                  onView={handleOpenModal}
                />
              ))}
            </div>
          ) : (
            <div className="spi-empty-state">
              <span className="spi-empty-icon" aria-hidden="true">🔍</span>
              <h3 className="spi-empty-title">No products found</h3>
              <p className="spi-empty-desc">
                No components matched your search "{searchQuery}" in the selected category.
              </p>
              <button
                type="button"
                className="spi-reset-btn"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Quick View Modal */}
        {selectedProduct && (
          <div className="spi-modal-overlay" onClick={handleCloseModal}>
            <div
              className="spi-modal-content"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-product-title"
            >
              <button
                type="button"
                className="spi-modal-close"
                onClick={handleCloseModal}
                aria-label="Close product view"
              >
                ✕
              </button>

              <div className="spi-modal-body">
                <div className="spi-modal-image-col">
                  <img
                    src={resolveProductImage(selectedProduct)}
                    alt={selectedProduct.name}
                    className="spi-modal-img"
                  />
                </div>

                <div className="spi-modal-info-col">
                  <div className="spi-modal-header">
                    <span className="spi-modal-category">
                      {selectedProduct.category?.toUpperCase() || 'COMPONENTS'}
                    </span>
                    <h2 id="modal-product-title" className="spi-modal-title">
                      {selectedProduct.name}
                    </h2>
                    <p style={{ margin: 0, fontSize: '13px', color: '#78716c' }}>
                      Brand: <strong>SIPL</strong> &nbsp;|&nbsp;
                      <span style={{ color: '#16a34a', fontWeight: '600' }}>
                        {' '}In Stock
                      </span>
                    </p>
                  </div>

                  <p className="spi-modal-desc">
                    {selectedProduct.description || selectedProduct.short_description}
                  </p>

                  <div className="spi-modal-prices">
                    <span className="spi-modal-current-price">
                      ₹{Number(selectedProduct.price).toLocaleString('en-IN')}
                    </span>
                    {selectedProduct.original_price && selectedProduct.original_price > selectedProduct.price && (
                      <span className="spi-modal-original-price">
                        ₹{Number(selectedProduct.original_price).toLocaleString('en-IN')}
                      </span>
                    )}
                    {selectedProduct.discount && (
                      <span className="spi-modal-discount-tag">
                        {selectedProduct.discount}
                      </span>
                    )}
                  </div>

                  {/* Quantity selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                    <span style={{ fontSize: '13.5px', color: '#57534e', fontWeight: '500' }}>Quantity:</span>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #d6cfc4', borderRadius: '6px', overflow: 'hidden' }}>
                      <button
                        type="button"
                        style={{ border: 'none', background: '#f5f5f4', padding: '6px 12px', cursor: 'pointer', fontWeight: '700' }}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        -
                      </button>
                      <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                        {quantity}
                      </span>
                      <button
                        type="button"
                        style={{ border: 'none', background: '#f5f5f4', padding: '6px 12px', cursor: 'pointer', fontWeight: '700' }}
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="spi-modal-actions">
                    <button
                      type="button"
                      className="spi-add-cart-btn"
                      onClick={() => handleAddToCart(selectedProduct, quantity)}
                    >
                      Add to Cart (₹{(selectedProduct.price * quantity).toLocaleString('en-IN')})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Products;