
import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ProductCategories.css";



// Backend URLs
const API_URL = "http://localhost:5000/api/category";
// --------------------------------------------------
// FORMAT DATE
// --------------------------------------------------

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });


// --------------------------------------------------
// STATUS PILL
// --------------------------------------------------

function StatusPill({ status }) {
  const active = status === "Active" || status === "active";

  return (
    <span
      className={`pc-badge ${
        active
          ? "pc-badge-active"
          : "pc-badge-inactive"
      }`}
    >
      <i
        className={`bi ${
          active
            ? "bi-check-circle-fill"
            : "bi-dash-circle-fill"
        } me-1`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}


// --------------------------------------------------
// IMAGE PICKER
// --------------------------------------------------

function ImagePicker({ value, onChange }) {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    onChange(file);
  };

  const getPreviewUrl = () => {
    if (!value) return null;
    if (value instanceof File) return URL.createObjectURL(value);
    if (typeof value === "string") {
      return value.startsWith("http")
        ? value
        : `http://localhost:5000/uploads/${value}`;
    }
    return null;
  };

  const previewUrl = getPreviewUrl();

  return (
    <div className="d-flex align-items-center gap-3">
      <div className="pc-image-preview">
        {previewUrl ? (
          <img src={previewUrl} alt="Category" />
        ) : (
          <i
            className="bi bi-image"
            style={{
              fontSize: "1.25rem",
              color: "var(--text-muted)",
            }}
          />
        )}
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="d-none"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn btn-outline-orangered btn-sm"
        >
          <i className="bi bi-upload me-1" />
          {value ? "Replace image" : "Upload image"}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="btn btn-link btn-sm text-danger text-decoration-none ms-2"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}


// --------------------------------------------------
// CATEGORY MODAL
// --------------------------------------------------

function CategoryModal({
  initial,
  onClose,
  onSave,
}) {

  const [name, setName] =
    useState(initial?.category ?? "");


  const [description, setDescription] =
    useState(
      initial?.description ?? ""
    );


  const [status, setStatus] =
    useState(
      initial?.status ?? "Active"
    );


  const [image, setImage] =
    useState(null);
  const existingPhoto = initial?.photo ?? null;

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Category validation
    if (!name.trim()) {
      setError(
        "Category name is required"
      );
      return;
    }

    // Image validation: required for new categories
    if (!initial && !image) {
      alert(
        "Please upload a category image."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append(
        "category",
        name.trim()
      );
      formData.append(
        "description",
        description.trim()
      );
      formData.append(
        "status",
        status
      );

      if (image) {
        formData.append(
          "photo",
          image
        );
      }

      const url = initial ? `${API_URL}/${initial._id}` : `${API_URL}`;
      const method = initial ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      const data = await response.json();

      console.log(
        "Backend response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.msg ||
            data.error ||
            "Server error"
        );
      }

      alert(data.msg || (initial ? "Category updated" : "Category registered"));

      if (data.data) {
        onSave(data.data);
      }

      onClose();

    } catch (error) {
      console.log(error);
      alert(
        error.message || "Server error. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pc-overlay" onClick={onClose}>
      <div className="pc-modal p-4" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
          <h5 className="mb-0 fw-bold" style={{ color: "var(--text-primary)" }}>
            {initial ? "Edit Category" : "Add New Category"}
          </h5>

          <button
            onClick={onClose}
            className="btn-close"
            type="button"
            aria-label="Close"
          />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* IMAGE */}
          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: "var(--text-secondary)" }}>
              Category Image
            </label>
            <ImagePicker
              value={image || existingPhoto}
              onChange={setImage}
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: "var(--text-secondary)" }}>
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Microcontrollers"
              className={`form-control ${error ? "is-invalid" : ""}`}
              style={{
                backgroundColor: "var(--bg-input)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
            {error && <div className="invalid-feedback">{error}</div>}
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: "var(--text-secondary)" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a short description of the category..."
              rows={3}
              className="form-control"
              style={{
                backgroundColor: "var(--bg-input)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          </div>

          {/* STATUS */}
          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: "var(--text-secondary)" }}>
              Status
            </label>
            <div className="d-flex gap-2">
              {["Active", "Inactive"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`btn btn-sm flex-fill ${
                    status === s
                      ? s === "Active"
                        ? "pc-status-btn-active"
                        : "pc-status-btn-inactive"
                      : "btn-outline-secondary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="d-flex justify-content-end gap-2 border-top pt-3 mt-3">
            <button
              onClick={onClose}
              className="btn btn-outline-orangered"
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-orangered"
              disabled={loading}
            >
              {loading ? "Saving..." : initial ? "Save changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function ProductCategories() {


  // Backend data will be stored here

  const [categories, setCategories] =
    useState([]);


  const [search, setSearch] =
    useState("");


  const [statusFilter, setStatusFilter] =
    useState("All Status");


  const [modalOpen, setModalOpen] =
    useState(false);


  const [editing, setEditing] =
    useState(null);


  const [deleteTarget, setDeleteTarget] =
    useState(null);


  const [loading, setLoading] =
    useState(false);



  // --------------------------------------------------
  // GET ALL CATEGORIES
  // --------------------------------------------------

  const getCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/show`);
      const data = await response.json();

      console.log("Categories:", data);

      if (!response.ok) {
        throw new Error(data.msg || "Unable to get categories");
      }

      setCategories(
        Array.isArray(data.data) ? data.data : []
      );

    } catch (error) {
      console.log(error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Get categories when page loads
  useEffect(() => {
    getCategories();
  }, []);

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const total =
    categories.length;

  const activeCount =
    categories.filter(
      (c) =>
        c.status === "Active"
    ).length;

  const inactiveCount =
    categories.filter(
      (c) =>
        c.status === "Inactive"
    ).length;

  // --------------------------------------------------
  // SEARCH + FILTER
  // --------------------------------------------------

  const filtered =
    categories.filter((c) => {
      const categoryName =
        c.category ?? "";

      const categoryDescription =
        c.description ?? "";

      const matchesSearch =
        categoryName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        categoryDescription
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        statusFilter ===
          "All Status" ||
        c.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // --------------------------------------------------
  // AFTER SAVE
  // --------------------------------------------------

  const handleSave = (category) => {
    if (!category) return;
    setCategories((prev) => {
      const exists = prev.some((c) => c._id === category._id);
      if (exists) {
        return prev.map((c) => (c._id === category._id ? category : c));
      }
      return [category, ...prev];
    });
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

const handleDelete = async () => {
    if (!deleteTarget) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/${deleteTarget._id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        console.log("Delete response:", data);

        if (!response.ok) {
            throw new Error(data.msg || "Delete failed");
        }

        // alert(data.msg);

        // Remove from React state
        setCategories((prev) =>
            prev.filter(
                (c) => c._id !== deleteTarget._id
            )
        );

        setDeleteTarget(null);

    } catch (error) {
        console.log(error);
        alert("Unable to delete category");
    }
};



  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="pc-page p-4">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="page-title mb-1">
            Product <span className="italic-accent">Categories</span>
          </h1>
          <p className="page-subtitle mb-0">
            Manage, organize and add categories for your product store
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          {/* REFRESH */}
          <button
            onClick={getCategories}
            className="btn btn-outline-orangered d-flex align-items-center gap-2"
            type="button"
            disabled={loading}
            style={{ fontSize: "13.5px", padding: "8px 16px" }}
          >
            <i className={`bi bi-arrow-clockwise ${loading ? "spin" : ""}`} />
            {loading ? "Loading..." : "Refresh"}
          </button>

          {/* ADD */}
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="btn btn-orangered d-flex align-items-center gap-2"
            type="button"
            style={{ fontSize: "13.5px", padding: "8px 18px" }}
          >
            <i className="bi bi-plus-lg" />
            + Add Category
          </button>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="row g-3 mb-4">
        {/* TOTAL */}
        <div className="col-12 col-sm-4">
          <div className="pc-stat-card p-3">
            <div className="d-flex align-items-center justify-content-between">
              <span className="pc-stat-label">TOTAL CATEGORIES</span>
              <i className="bi bi-tags" style={{ color: "var(--spi-orange)", fontSize: "1.1rem" }} />
            </div>
            <div className="pc-stat-value">{total}</div>
          </div>
        </div>

        {/* ACTIVE */}
        <div className="col-12 col-sm-4">
          <div className="pc-stat-card pc-stat-card-active p-3">
            <div className="d-flex align-items-center justify-content-between">
              <span className="pc-stat-label">ACTIVE IN STORE</span>
              <i className="bi bi-check-circle-fill" style={{ color: "#16a34a", fontSize: "1.1rem" }} />
            </div>
            <div className="pc-stat-value" style={{ color: "#16a34a" }}>
              {activeCount}
            </div>
          </div>
        </div>

        {/* INACTIVE */}
        <div className="col-12 col-sm-4">
          <div className="pc-stat-card p-3">
            <div className="d-flex align-items-center justify-content-between">
              <span className="pc-stat-label">INACTIVE / DRAFT</span>
              <i className="bi bi-dash-circle-fill" style={{ color: "var(--text-muted)", fontSize: "1.1rem" }} />
            </div>
            <div className="pc-stat-value" style={{ color: "var(--text-muted)" }}>
              {inactiveCount}
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="pc-table-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="pc-search">
              <i className="bi bi-search" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search category or description..."
                className="form-control form-control-sm"
              />
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-md-end align-items-center gap-2">
            <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600" }}>
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select form-select-sm"
              style={{
                width: "160px",
                backgroundColor: "var(--bg-input)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="pc-table-card">
        <div className="table-responsive">
          <table className="table pc-table mb-0">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>#</th>
                <th style={{ width: "80px" }}>IMAGE</th>
                <th>CATEGORY NAME</th>
                <th>DESCRIPTION</th>
                <th>STATUS</th>
                <th>CREATED</th>
                <th style={{ textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {/* LOADING */}
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    Loading categories...
                  </td>
                </tr>
              )}

              {/* DATA */}
              {!loading &&
                filtered.map((c, i) => (
                  <tr key={c._id}>
                    {/* NUMBER */}
                    <td style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>
                      {i + 1}
                    </td>

                    {/* IMAGE */}
                    <td>
                      <div className="pc-image-preview pc-image-preview-sm">
                        {c.photo ? (
                          <img
                            src={`http://localhost:5000/uploads/${c.photo}`}
                            alt={c.category}
                          />
                        ) : (
                          <i className="bi bi-image" style={{ color: "var(--text-muted)" }} />
                        )}
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td>
                      <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "14px" }}>
                        {c.category}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                        ID: {c._id}
                      </div>
                    </td>

                    {/* DESCRIPTION */}
                    <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                      {c.description || "—"}
                    </td>

                    {/* STATUS */}
                    <td>
                      <StatusPill status={c.status} />
                    </td>

                    {/* DATE */}
                    <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                      {formatDate(c.createdAt)}
                    </td>

                    {/* ACTIONS */}
                    <td style={{ textAlign: "right" }}>
                      <div className="d-inline-flex align-items-center gap-1">
                        {/* EDIT */}
                        <button
                          onClick={() => {
                            setEditing(c);
                            setModalOpen(true);
                          }}
                          className="btn btn-sm btn-outline-secondary p-1 px-2"
                          type="button"
                          title="Edit Category"
                        >
                          <i className="bi bi-pencil" />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="btn btn-sm btn-outline-danger p-1 px-2"
                          type="button"
                          title="Delete Category"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {/* NO DATA */}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-5">
                    No categories found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CATEGORY MODAL */}
      {modalOpen && (
        <CategoryModal
          initial={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* DELETE MODAL */}
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
                <i className="bi bi-trash" style={{ fontSize: "1.3rem" }} />
              </div>
              <h5 className="fw-bold mb-1" style={{ color: "var(--text-primary)" }}>
                Delete category?
              </h5>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px" }} className="mb-0">
                This will permanently remove{" "}
                <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                  {deleteTarget.category}
                </span>
                .
              </p>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn btn-outline-orangered"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
