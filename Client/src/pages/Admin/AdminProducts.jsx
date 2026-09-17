import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  Plus,
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  Image as ImageIcon,
  Layers,
  Sparkles,
} from "lucide-react";
import { PRODUCTS_DATA, resolveProductImage } from "../../data/productsData";
import "./ProductCategories.css";

const API_BASE = "http://localhost:5000/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    category_id: "",
    category: "",
    price: "",
    original_price: "",
    stock_quantity: 10,
    stock_status: "in_stock",
    short_description: "",
    description: "",
    thumbnail: "",
    height: 80,
    width: 80,
    is_featured: false,
    status: "active",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 3500);
  };

  // Fetch Categories & Products from Backend
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Categories
      const catRes = await axios.get(`${API_BASE}/category/show`);
      let catList = [];
      if (catRes.data && Array.isArray(catRes.data.data)) {
        catList = catRes.data.data;
        setCategories(catList);
      }

      // 2. Fetch Products
      const prodRes = await axios.get(`${API_BASE}/product/products`);
      if (Array.isArray(prodRes.data) && prodRes.data.length > 0) {
        setProducts(prodRes.data);
      } else {
        // Fallback to seeded products data if DB is initializing
        setProducts(PRODUCTS_DATA);
      }
    } catch (err) {
      console.warn("Backend fetch failed, using catalog:", err.message);
      setProducts(PRODUCTS_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Products
  const filteredProducts = products.filter((item) => {
    // Search Filter
    const q = search.toLowerCase().trim();
    const nameMatch = item.name?.toLowerCase().includes(q);
    const skuMatch = (item._id || item.id || "").toLowerCase().includes(q);
    const descMatch = (item.description || item.short_description || "")
      .toLowerCase()
      .includes(q);
    const matchesSearch = !q || nameMatch || skuMatch || descMatch;

    // Category Filter
    let itemCat = "";
    if (typeof item.category_id === "object" && item.category_id?.category) {
      itemCat = item.category_id.category;
    } else if (typeof item.category_id === "string") {
      const foundCat = categories.find((c) => c._id === item.category_id);
      itemCat = foundCat ? foundCat.category : item.category;
    } else {
      itemCat = item.category || "Components";
    }

    const matchesCategory =
      selectedCategory === "All" ||
      itemCat.toLowerCase() === selectedCategory.toLowerCase();

    // Status Filter
    const itemStatus = item.status || "active";
    const matchesStatus =
      selectedStatus === "All" ||
      itemStatus.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Metric Computations
  const totalProducts = products.length;
  const activeCount = products.filter((p) => (p.status || "active") === "active").length;
  const inactiveCount = totalProducts - activeCount;

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditMode(false);
    const defaultCatId = categories.length > 0 ? categories[0]._id : "";
    setCurrentProduct({
      name: "",
      category_id: defaultCatId,
      category: categories[0]?.category || "Displays",
      price: "",
      original_price: "",
      stock_quantity: 10,
      stock_status: "in_stock",
      short_description: "",
      description: "",
      thumbnail: "",
      height: 80,
      width: 80,
      is_featured: false,
      status: "active",
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setIsEditMode(true);
    const catId = typeof product.category_id === "object" ? product.category_id?._id : product.category_id;
    setCurrentProduct({
      _id: product._id || product.id,
      name: product.name || "",
      category_id: catId || (categories[0]?._id || ""),
      category: product.category || (categories[0]?.category || "Displays"),
      price: product.price || "",
      original_price: product.original_price || "",
      stock_quantity: product.stock_quantity ?? 10,
      stock_status: product.stock_status || "in_stock",
      short_description: product.short_description || "",
      description: product.description || "",
      thumbnail: product.thumbnail || product.image || "",
      height: product.height || 80,
      width: product.width || 80,
      is_featured: product.is_featured || false,
      status: product.status || "active",
    });
    setShowModal(true);
  };

  // Handle Form Submit (Create / Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.price) {
      alert("Product name and price are required.");
      return;
    }

    try {
      if (isEditMode) {
        // Update Product
        const id = currentProduct._id;
        await axios.put(`${API_BASE}/product/products/${id}`, currentProduct);
        setProducts((prev) =>
          prev.map((p) => (p._id === id || p.id === id ? { ...p, ...currentProduct } : p))
        );
        showAlert(`Product "${currentProduct.name}" updated successfully!`);
      } else {
        // Create Product
        const res = await axios.post(`${API_BASE}/product/products`, currentProduct);
        const created = res.data || {
          ...currentProduct,
          _id: `prod-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setProducts((prev) => [created, ...prev]);
        showAlert(`Product "${currentProduct.name}" created successfully!`);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Save product error:", err);
      // Local fallback for offline mode
      if (isEditMode) {
        const id = currentProduct._id;
        setProducts((prev) =>
          prev.map((p) => (p._id === id || p.id === id ? { ...p, ...currentProduct } : p))
        );
        showAlert(`Product "${currentProduct.name}" updated locally!`);
      } else {
        const localCreated = {
          ...currentProduct,
          _id: `prod-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setProducts((prev) => [localCreated, ...prev]);
        showAlert(`Product "${currentProduct.name}" added to catalog!`);
      }
      setShowModal(false);
    }
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id || deleteTarget.id;
    try {
      await axios.delete(`${API_BASE}/product/products/${id}`);
    } catch (err) {
      console.warn("Delete API error:", err.message);
    }

    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    showAlert(`Product "${deleteTarget.name}" deleted.`);
    setDeleteTarget(null);
  };

  return (
    <div className="pc-page p-4">
      {/* Toast Alert */}
      {alertMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "var(--spi-orange)",
            color: "#ffffff",
            padding: "12px 22px",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            zIndex: 2000,
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          ✓ {alertMsg}
        </div>
      )}

      {/* Page Title & Actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="page-title mb-1">
            Store <span className="italic-accent">Products</span>
          </h1>
          <p className="page-subtitle mb-0">
            Manage, organize, and add electronic components for your online store
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          <button
            type="button"
            onClick={fetchData}
            className="btn btn-outline-orangered d-flex align-items-center gap-2"
            style={{ fontSize: "13.5px", padding: "8px 16px" }}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
          </button>
          <button
            type="button"
            className="btn btn-orangered d-flex align-items-center gap-2"
            style={{ fontSize: "13.5px", padding: "8px 18px" }}
            onClick={handleOpenCreate}
          >
            <Plus size={16} /> + Add Product
          </button>
        </div>
      </div>

      {/* Metric Cards Row (Matching Product Categories Template) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">TOTAL PRODUCTS</span>
              <Package size={18} color="var(--spi-orange)" />
            </div>
            <div className="pc-stat-value">{totalProducts}</div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="pc-stat-card pc-stat-card-active p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">ACTIVE IN STORE</span>
              <CheckCircle size={18} color="#16a34a" />
            </div>
            <div className="pc-stat-value" style={{ color: "#16a34a" }}>
              {activeCount}
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="pc-stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="pc-stat-label">INACTIVE / DRAFT</span>
              <AlertCircle size={18} color="var(--text-muted)" />
            </div>
            <div className="pc-stat-value" style={{ color: "var(--text-muted)" }}>
              {inactiveCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="pc-table-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="pc-search">
              <Search size={16} />
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search product by name, SKU, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              style={{
                backgroundColor: "var(--bg-input)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.category}>
                  {c.category}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              style={{
                backgroundColor: "var(--bg-input)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="pc-table-card">
        <div className="table-responsive">
          <table className="table pc-table mb-0">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>#</th>
                <th style={{ width: "80px" }}>IMAGE</th>
                <th>PRODUCT NAME</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>CREATED</th>
                <th style={{ textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    Loading store products...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((prod, idx) => {
                  const imgUrl = resolveProductImage(prod);
                  const catLabel =
                    typeof prod.category_id === "object" && prod.category_id?.category
                      ? prod.category_id.category
                      : prod.category || "Components";

                  const isActive = (prod.status || "active") === "active";
                  const prodIdDisplay = prod._id || prod.id || `PROD-${idx + 1}`;

                  return (
                    <tr key={prodIdDisplay}>
                      <td style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>
                        {idx + 1}
                      </td>
                      <td>
                        <div className="pc-image-preview">
                          {imgUrl ? (
                            <img src={imgUrl} alt={prod.name} />
                          ) : (
                            <ImageIcon size={22} color="var(--text-muted)" />
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "14px" }}>
                          {prod.name}
                          {prod.is_featured && (
                            <span
                              className="ms-2"
                              style={{
                                fontSize: "10px",
                                backgroundColor: "var(--spi-orange)",
                                color: "#ffffff",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: "700",
                              }}
                            >
                              FEATURED
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                          ID: {prodIdDisplay}
                        </div>
                      </td>
                      <td>
                        <span
                          className="user-status-pill"
                          style={{
                            backgroundColor: "var(--bg-surface-secondary)",
                            color: "var(--spi-orange)",
                            border: "1px solid var(--border-color)",
                            fontWeight: "600",
                          }}
                        >
                          {catLabel}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "14px" }}>
                          ₹{Number(prod.price || 0).toLocaleString("en-IN")}
                        </div>
                        {prod.original_price && prod.original_price > prod.price && (
                          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                            ₹{Number(prod.original_price).toLocaleString("en-IN")}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: "600", fontSize: "13px" }}>
                          {prod.stock_quantity ?? 10} units
                        </div>
                        <small style={{ color: (prod.stock_quantity ?? 10) > 5 ? "#16a34a" : "#ef4444" }}>
                          {(prod.stock_quantity ?? 10) > 0 ? "In Stock" : "Out of Stock"}
                        </small>
                      </td>
                      <td>
                        <span
                          className={`pc-badge ${
                            isActive ? "pc-badge-active" : "pc-badge-inactive"
                          }`}
                        >
                          <i
                            className={`bi ${
                              isActive
                                ? "bi-check-circle-fill"
                                : "bi-dash-circle-fill"
                            } me-1`}
                          />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          {prod.createdAt
                            ? new Date(prod.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                            : "Sep 15, 2026"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="d-inline-flex align-items-center gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary p-1 px-2"
                            onClick={() => handleOpenEdit(prod)}
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger p-1 px-2"
                            onClick={() => setDeleteTarget(prod)}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    No products match your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="pc-overlay" onClick={() => setShowModal(false)}>
          <div
            className="pc-modal p-4"
            style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="mb-0" style={{ fontWeight: "700" }}>
                {isEditMode ? "Edit Product" : "Add New Store Product"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              />
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="row g-3 mb-3">
                <div className="col-12">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Raspberry Pi 5 8GB Board"
                    value={currentProduct.name}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Category *
                  </label>
                  <select
                    className="form-select"
                    value={currentProduct.category_id}
                    onChange={(e) => {
                      const selected = categories.find((c) => c._id === e.target.value);
                      setCurrentProduct({
                        ...currentProduct,
                        category_id: e.target.value,
                        category: selected ? selected.category : currentProduct.category,
                      });
                    }}
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Status
                  </label>
                  <select
                    className="form-select"
                    value={currentProduct.status}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, status: e.target.value })
                    }
                  >
                    <option value="active">Active (Visible in Store)</option>
                    <option value="inactive">Inactive / Draft</option>
                  </select>
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="4077"
                    value={currentProduct.price}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="4530"
                    value={currentProduct.original_price}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        original_price: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Stock Units
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="10"
                    value={currentProduct.stock_quantity}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        stock_quantity: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Featured Item?
                  </label>
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="featuredSwitch"
                      checked={currentProduct.is_featured}
                      onChange={(e) =>
                        setCurrentProduct({ ...currentProduct, is_featured: e.target.checked })
                      }
                      style={{ accentColor: "var(--spi-orange)" }}
                    />
                    <label className="form-check-label" htmlFor="featuredSwitch">
                      Yes
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Product Description
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Provide detailed component description and specifications..."
                    value={currentProduct.description}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, description: e.target.value })
                    }
                  />
                </div>

                <div className="col-6">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="80"
                    value={currentProduct.height}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, height: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="col-6">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="80"
                    value={currentProduct.width}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, width: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Image URL or Relative Path
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 6 Displays & Indicators/WS2812 RGB LEDS.png"
                    value={currentProduct.thumbnail}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, thumbnail: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-outline-orangered"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-orangered">
                  {isEditMode ? "Update Product" : "Save Product to Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="pc-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="pc-modal pc-modal-sm p-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-3">
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                  color: "#ef4444",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <Trash2 size={24} />
              </div>
              <h5 className="mb-1" style={{ fontWeight: "700" }}>
                Delete Product?
              </h5>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", margin: 0 }}>
                Are you sure you want to permanently delete "{deleteTarget.name}"? This action cannot be undone.
              </p>
            </div>

            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-outline-orangered"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
