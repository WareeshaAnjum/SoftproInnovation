
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
  const active = status === "Active";

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

      {status}
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


    // Store actual File
    onChange(file);
  };


  return (
    <div className="d-flex align-items-center gap-3">

      <div className="pc-image-preview">

        {value ? (

          <img
            src={URL.createObjectURL(value)}
            alt="Category"
          />

        ) : (

          <i
            className="bi bi-image text-secondary"
            style={{
              fontSize: "1.25rem",
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
          onChange={(e) =>
            handleFile(
              e.target.files?.[0]
            )
          }
        />


        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          className="btn btn-outline-secondary btn-sm"
        >

          <i className="bi bi-upload me-1" />

          {value
            ? "Replace image"
            : "Upload image"}

        </button>


        {value && (

          <button
            type="button"
            onClick={() =>
              onChange(null)
            }
            className="btn btn-link btn-sm text-danger"
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


    // Image validation
    if (!image) {

      alert(
        "Please upload a category image."
      );

      return;
    }


    try {

      setLoading(true);


      // Create FormData
      const formData =
        new FormData();


      // These names MUST match backend

      formData.append(
        "category",
        name
      );


      formData.append(
        "description",
        description
      );


      formData.append(
        "status",
        status
      );


      formData.append(
        "photo",
        image
      );


      // Send to backend

      const response =
        await fetch(
          `${API_URL}`,
          {
            method: "POST",
            body: formData,
          }
        );


      const data =
        await response.json();


      console.log(
        "Backend response:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.msg ||
            "Server error"
        );
      }


      alert(data.msg);


      // Send saved category
      // to parent state

      onSave(data.data);


      onClose();


    } catch (error) {

      console.log(error);

      alert(
        "Server error. Check your backend."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="pc-overlay">

      <div className="pc-modal card shadow">


        {/* HEADER */}

        <div className="d-flex align-items-center justify-content-between border-bottom px-4 py-3">

          <h5 className="mb-0 fw-semibold">

            {initial
              ? "Edit Category"
              : "Add Category"}

          </h5>


          <button
            onClick={onClose}
            className="btn btn-sm btn-light"
            type="button"
          >

            <i className="bi bi-x-lg" />

          </button>

        </div>



        {/* FORM */}

        <form
          onSubmit={handleSubmit}
        >

          <div className="px-4 py-4">


            {/* IMAGE */}

            <div className="mb-3">

              <label className="form-label small fw-medium text-secondary">

                Category image

              </label>


              <ImagePicker
                value={image}
                onChange={setImage}
              />

            </div>



            {/* CATEGORY */}

            <div className="mb-3">

              <label className="form-label small fw-medium text-secondary">

                Category name

              </label>


              <input
                type="text"
                value={name}
                onChange={(e) => {

                  setName(
                    e.target.value
                  );

                  if (error) {
                    setError("");
                  }

                }}
                placeholder="e.g. Laptops"
                className={`form-control ${
                  error
                    ? "is-invalid"
                    : ""
                }`}
              />


              {error && (

                <div className="invalid-feedback">

                  {error}

                </div>

              )}

            </div>



            {/* DESCRIPTION */}

            <div className="mb-3">

              <label className="form-label small fw-medium text-secondary">

                Description

              </label>


              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="What belongs in this category?"
                rows={3}
                className="form-control"
              />

            </div>



            {/* STATUS */}

            <div className="mb-1">

              <label className="form-label small fw-medium text-secondary">

                Status

              </label>


              <div className="d-flex gap-2">

                {[
                  "Active",
                  "Inactive",
                ].map((s) => (

                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      setStatus(s)
                    }
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

          </div>



          {/* FOOTER */}

          <div className="d-flex justify-content-end gap-2 border-top px-4 py-3">

            <button
              onClick={onClose}
              className="btn btn-light"
              type="button"
            >
              Cancel
            </button>


            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >

              {loading
                ? "Saving..."
                : initial
                ? "Save changes"
                : "Add Category"}

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

// const getCategories = async () => {
//     try {
//         setLoading(true);

//         const response = await fetch(`${API_URL}/show`);

//         const data = await response.json();

//         console.log("Categories:", data);

//         if (!response.ok) {
//             throw new Error(data.msg || "Unable to get categories");
//         }

//         setCategories(
//             Array.isArray(data.data) ? data.data : []
//         );

//     } catch (error) {
//         console.log(error);
//         alert("Unable to get categories");
//         setCategories([]);
//     } finally {
//         setLoading(false);
//     }
// };



  // Get categories when page loads

  useEffect(() => {
    // getCategories();
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
    setCategories((prev) => [
        category,
        ...prev,
    ]);
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

    <div className="pc-page">

      <div className="container-xl py-4 py-md-5">


        {/* HEADER */}

        <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">

          <div>

            <h1 className="h3 fw-semibold mb-1">

              Product{" "}

              <span className="text-primary">

                Categories

              </span>

            </h1>


            <p className="text-secondary mb-0">

              Manage, organize and add
              categories for your product
              store

            </p>

          </div>


          <div className="d-flex gap-2">


            {/* REFRESH */}

            <button
              onClick={getCategories}
              className="btn btn-outline-secondary"
              type="button"
              disabled={loading}
            >

              <i className="bi bi-arrow-clockwise me-1" />

              {loading
                ? "Loading..."
                : "Refresh"}

            </button>



            {/* ADD */}

            <button
              onClick={() => {

                setEditing(null);

                setModalOpen(true);

              }}
              className="btn btn-primary"
              type="button"
            >

              <i className="bi bi-plus-lg me-1" />

              Add Category

            </button>

          </div>

        </div>



        {/* STATISTICS */}

        <div className="row g-3 mb-4">


          {/* TOTAL */}

          <div className="col-12 col-sm-4">

            <div className="card pc-stat-card h-100">

              <div className="card-body">

                <div className="d-flex align-items-center justify-content-between">

                  <span className="pc-stat-label">

                    Total Categories

                  </span>


                  <i className="bi bi-tags text-primary" />

                </div>


                <div className="pc-stat-value">

                  {total}

                </div>

              </div>

            </div>

          </div>



          {/* ACTIVE */}

          <div className="col-12 col-sm-4">

            <div className="card pc-stat-card pc-stat-card-active h-100">

              <div className="card-body">

                <div className="d-flex align-items-center justify-content-between">

                  <span className="pc-stat-label">

                    Active in Store

                  </span>


                  <i className="bi bi-check-circle-fill text-success" />

                </div>


                <div className="pc-stat-value text-success">

                  {activeCount}

                </div>

              </div>

            </div>

          </div>



          {/* INACTIVE */}

          <div className="col-12 col-sm-4">

            <div className="card pc-stat-card h-100">

              <div className="card-body">

                <div className="d-flex align-items-center justify-content-between">

                  <span className="pc-stat-label">

                    Inactive / Draft

                  </span>


                  <i className="bi bi-dash-circle-fill text-secondary" />

                </div>


                <div className="pc-stat-value">

                  {inactiveCount}

                </div>

              </div>

            </div>

          </div>

        </div>



        {/* TABLE */}

        <div className="card pc-table-card">


          {/* SEARCH */}

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom px-4 py-3">

            <div className="pc-search">

              <i className="bi bi-search" />


              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search category or description..."
                className="form-control"
              />

            </div>


            <div className="d-flex align-items-center gap-2">

              <span className="text-secondary small">

                Status:

              </span>


              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="form-select form-select-sm"
              >

                <option>
                  All Status
                </option>

                <option>
                  Active
                </option>

                <option>
                  Inactive
                </option>
              </select>

            </div>

          </div>



          {/* TABLE */}

          <div className="table-responsive">

            <table className="table pc-table align-middle mb-0">

              <thead>

                <tr>

                  <th>#</th>

                  <th>Image</th>

                  <th>Category Name</th>

                  <th>Description</th>

                  <th>Status</th>

                  <th>Created</th>

                  <th className="text-end">

                    Actions

                  </th>

                </tr>

              </thead>


              <tbody>


                {/* LOADING */}

                {loading && (

                  <tr>

                    <td
                      colSpan={7}
                      className="text-center py-5"
                    >

                      Loading categories...

                    </td>

                  </tr>

                )}



                {/* DATA */}

                {!loading &&
                  filtered.map(
                    (c, i) => (

                      <tr key={c._id}>


                        {/* NUMBER */}

                        <td className="text-secondary">

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

                              <i className="bi bi-image text-secondary" />

                            )}

                          </div>

                        </td>



                        {/* CATEGORY */}

                        <td>

                          <div className="fw-medium">

                            {c.category}

                          </div>


                          <div className="text-secondary small">

                            ID: {c._id}

                          </div>

                        </td>



                        {/* DESCRIPTION */}

                        <td className="text-secondary">

                          {c.description ||
                            "—"}

                        </td>



                        {/* STATUS */}

                        <td>

                          <StatusPill
                            status={
                              c.status
                            }
                          />

                        </td>



                        {/* DATE */}

                        <td className="text-secondary">

                          {formatDate(
                            c.createdAt
                          )}

                        </td>



                        {/* ACTIONS */}

                        <td>

                          <div className="d-flex justify-content-end gap-2">


                            {/* EDIT */}

                            <button
                              onClick={() => {

                                setEditing(c);

                                setModalOpen(
                                  true
                                );

                              }}
                              className="btn btn-sm btn-outline-secondary"
                              type="button"
                            >

                              <i className="bi bi-pencil" />

                            </button>



                            {/* DELETE */}

                            <button
                              onClick={() =>
                                setDeleteTarget(
                                  c
                                )
                              }
                              className="btn btn-sm btn-outline-danger"
                              type="button"
                            >

                              <i className="bi bi-trash" />

                            </button>


                          </div>

                        </td>

                      </tr>

                    )
                  )}



                {/* NO DATA */}

                {!loading &&
                  filtered.length ===
                    0 && (

                    <tr>

                      <td
                        colSpan={7}
                        className="text-center text-secondary py-5"
                      >

                        No categories
                        found.

                      </td>

                    </tr>

                  )}

              </tbody>

            </table>

          </div>

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

        <div className="pc-overlay">

          <div className="pc-modal pc-modal-sm card shadow">

            <div className="p-4">

              <h5 className="fw-semibold mb-1">

                Delete category?

              </h5>


              <p className="text-secondary mb-0">

                This will permanently
                remove{" "}

                <span className="fw-medium text-dark">

                  {deleteTarget.category}

                </span>

                .

              </p>


              <div className="d-flex justify-content-end gap-2 mt-4">

                <button
                  onClick={() =>
                    setDeleteTarget(
                      null
                    )
                  }
                  className="btn btn-light"
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

        </div>

      )}

    </div>

  );
}
