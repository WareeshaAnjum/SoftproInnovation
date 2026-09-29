import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveProductImage } from '../../data/productsData';

const ProductCard = ({ product, onView }) => {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const {
    name,
    price,
    original_price,
    badge,
    discount,
    brand = 'SIPL',
    category,
    category_id,
    is_featured,
    stock_status = 'in_stock',
  } = product;

  // Resolve category name (from object if populated or string)
  const categoryLabel = typeof category_id === 'object' && category_id?.category
    ? category_id.category
    : (category || 'COMPONENTS');

  // Compute discount tag if not given
  let discountTag = discount;
  if (!discountTag && original_price && original_price > price) {
    const percent = Math.round(((original_price - price) / original_price) * 100);
    discountTag = `${percent}% OFF`;
  }

  // Badge text (FEATURED or POPULAR)
  const badgeLabel = badge || (is_featured ? 'FEATURED' : null);

  // Image source
  const imageUrl = resolveProductImage(product);

  const formatPrice = (val) => {
    return Number(val).toLocaleString('en-IN');
  };

  const handleCardClick = () => {
    const targetId = product.id || product._id || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/products/${targetId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    try {
      const existing = JSON.parse(localStorage.getItem('cart') || '[]');
      const productId = product.id || product._id;
      const itemIndex = existing.findIndex((i) => i.id === productId);
      if (itemIndex > -1) {
        existing[itemIndex].quantity = (existing[itemIndex].quantity || 1) + 1;
      } else {
        existing.push({
          id: productId,
          name: name,
          price: price,
          image: imageUrl,
          quantity: 1,
        });
      }
      localStorage.setItem('cart', JSON.stringify(existing));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  return (
    <div
      className="spi-product-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Image Wrap & Separated Badges */}
      <div className="spi-image-box">
        {badgeLabel && (
          <span className="spi-card-badge">{badgeLabel}</span>
        )}

        {discountTag && (
          <span className="spi-discount-badge">{discountTag}</span>
        )}

        <img
          src={imageUrl}
          alt={name}
          className="spi-product-img"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="spi-card-content">
        <span className="spi-category-tag">{categoryLabel.toUpperCase()}</span>
        <h3 className="spi-product-title" title={name}>{name}</h3>
        <p className="spi-brand-tag">{brand}</p>

        <div className="spi-price-row">
          <div className="spi-prices">
            <span className="spi-current-price">₹{formatPrice(price)}</span>
            {original_price && original_price > price && (
              <span className="spi-original-price">₹{formatPrice(original_price)}</span>
            )}
          </div>
          <div className="spi-card-actions" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              type="button"
              className={`spi-cart-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              aria-label={`Add ${name} to Cart`}
            >
              {added ? '✓ Added' : '+ Cart'}
            </button>
            <button
              type="button"
              className="spi-view-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              aria-label={`View ${name}`}
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;