// components/ProductCard.jsx
function ProductCard({ product }) {
  const {
    name,
    price,
    original_price,
    thumbnail,
    category_id,
    is_featured,
    stock_status
  } = product;

  const discountPercent = original_price && original_price > price
    ? Math.round((1 - price / original_price) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="card-image-wrap">
        {is_featured && <span className="badge badge-featured">FEATURED</span>}
        {discountPercent > 0 && (
          <span className="badge badge-discount">{discountPercent}% OFF</span>
        )}
        <img src={thumbnail} alt={name} />
      </div>

      <div className="card-body">
        <p className="card-category">{category_id?.name?.toUpperCase()}</p>
        <h3 className="card-name">{name}</h3>

        <div className="card-price-row">
          <span className="card-price">₹{price}</span>
          {discountPercent > 0 && (
            <span className="card-price-original">₹{original_price}</span>
          )}
          <button className="btn-view" disabled={stock_status === 'out_of_stock'}>
            {stock_status === 'out_of_stock' ? 'Out of stock' : 'View'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;