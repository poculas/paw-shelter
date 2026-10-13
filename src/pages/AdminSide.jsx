import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaPaw, 
  FaClipboardList, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSyncAlt, 
  FaSignOutAlt, 
  FaExternalLinkAlt, 
  FaCheck, 
  FaTimes, 
  FaClock, 
  FaEye, 
  FaCamera, 
  FaSpinner 
} from "react-icons/fa";

import { 
  getAnimals, 
  createAnimal, 
  updateAnimal, 
  deleteAnimal, 
  getAdoptionRequests, 
  updateAdoptionRequestStatus, 
  deleteAdoptionRequest 
} from "../api/animals";

import "../styles/AdminSide.css";

export default function AdminSide() {
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      navigate("/admin");
    }
  }, [navigate]);

  // Tab State: 'adoptions' | 'pets'
  const [activeTab, setActiveTab] = useState("adoptions");

  // Data states
  const [animals, setAnimals] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Status Filter for Adoptions
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null); // null = Add, object = Edit
  const [petForm, setPetForm] = useState({
    name: "",
    breed: "",
    weight: "",
    age: "",
    gender: "Female",
    category: "normal",
    description: "",
    personality: "",
  });
  const [petImageFile, setPetImageFile] = useState(null);
  const [petImagePreview, setPetImagePreview] = useState(null);

  // Detail Modal for Adoption Application
  const [inspectRequest, setInspectRequest] = useState(null);

  // Fetch all data
  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [animalsData, requestsData] = await Promise.all([
        getAnimals().catch(() => []),
        getAdoptionRequests().catch(() => []),
      ]);
      setAnimals(Array.isArray(animalsData) ? animalsData : []);
      setAdoptionRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out of the Admin Console?")) {
      localStorage.removeItem("admin_auth");
      navigate("/");
    }
  };

  /* ===================================================
     PET CRUD ACTIONS
     =================================================== */
  const handleOpenAddPet = () => {
    setEditingPet(null);
    setPetForm({
      name: "",
      breed: "",
      weight: "",
      age: "",
      gender: "Female",
      category: "normal",
      description: "",
      personality: "",
    });
    setPetImageFile(null);
    setPetImagePreview(null);
    setShowPetModal(true);
  };

  const handleOpenEditPet = (animal) => {
    setEditingPet(animal);
    setPetForm({
      name: animal.name || "",
      breed: animal.breed || "",
      weight: animal.weight ? String(animal.weight) : "",
      age: animal.age ? String(animal.age) : "",
      gender: animal.gender || "Female",
      category: animal.category || "normal",
      description: animal.description || "",
      personality: animal.personality || "",
    });
    setPetImageFile(null);
    setPetImagePreview(animal.image_url || animal.image || null);
    setShowPetModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetImageFile(file);
      setPetImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSavePet = async (e) => {
    e.preventDefault();
    if (!petForm.name.trim() || !petForm.breed.trim() || !petForm.weight) {
      alert("Please enter pet Name, Breed, and Weight.");
      return;
    }

    setActionLoading(true);
    try {
      const form = new FormData();
      form.append("name", petForm.name.trim());
      form.append("breed", petForm.breed.trim());
      form.append("weight", petForm.weight);
      if (petForm.age) form.append("age", petForm.age);
      form.append("gender", petForm.gender);
      form.append("category", petForm.category);
      form.append("description", petForm.description.trim());
      form.append("personality", petForm.personality.trim());

      if (petImageFile) {
        form.append("image", petImageFile);
      }

      if (editingPet) {
        await updateAnimal(editingPet.id, form);
      } else {
        await createAnimal(form);
      }

      setShowPetModal(false);
      await loadAllData();
    } catch (err) {
      console.error("Save pet failed", err);
      alert("Failed to save pet record. Please check the backend connection.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this animal? This will also remove any associated adoption requests.")) {
      return;
    }
    setActionLoading(true);
    try {
      await deleteAnimal(id);
      await loadAllData();
    } catch (err) {
      console.error("Delete pet failed", err);
      alert("Failed to delete animal.");
    } finally {
      setActionLoading(false);
    }
  };

  /* ===================================================
     ADOPTION REQUESTS ACTIONS
     =================================================== */
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateAdoptionRequestStatus(id, newStatus);
      // Update local state smoothly
      setAdoptionRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (inspectRequest && inspectRequest.id === id) {
        setInspectRequest((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Could not update adoption request status.");
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this adoption request?")) {
      return;
    }
    try {
      await deleteAdoptionRequest(id);
      setAdoptionRequests((prev) => prev.filter((r) => r.id !== id));
      if (inspectRequest?.id === id) {
        setInspectRequest(null);
      }
    } catch (err) {
      console.error("Failed to delete request", err);
      alert("Could not delete adoption request.");
    }
  };

  const filteredRequests = adoptionRequests.filter((r) => {
    if (statusFilter === "Pending") return r.status === "Pending";
    if (statusFilter === "Approved") return r.status === "Approved";
    if (statusFilter === "Rejected") return r.status === "Rejected";
    return true;
  });

  return (
    <div className="admin-console-root">
      {/* Top Bar */}
      <header className="admin-console-nav">
        <div className="admin-brand">
          <FaPaw className="brand-icon" />
          <div>
            <h1>Paw Shelter <span>Admin</span></h1>
            <span className="admin-badge-sub">Staff Management System</span>
          </div>
        </div>

        <div className="admin-nav-actions">
          <button 
            className="admin-action-btn"
            onClick={loadAllData}
            title="Refresh Data"
            disabled={loading}
            id="admin-btn-refresh"
          >
            <FaSyncAlt className={loading ? "spinner" : ""} /> Refresh
          </button>
          <button 
            className="admin-action-btn"
            onClick={() => navigate("/")}
            title="View Public Website"
            id="admin-btn-view-site"
          >
            <FaExternalLinkAlt /> Public Site
          </button>
          <button 
            className="admin-logout-btn"
            onClick={handleLogout}
            id="admin-btn-logout"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-console-main">
        {/* Navigation Tabs */}
        <div className="admin-tabs-bar">
          <button
            className={`admin-tab-btn ${activeTab === "adoptions" ? "active" : ""}`}
            onClick={() => setActiveTab("adoptions")}
            id="admin-tab-adoptions"
          >
            <FaClipboardList /> Adoption Submissions
            <span className="tab-count-badge">
              {adoptionRequests.filter((r) => r.status === "Pending").length} Pending
            </span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "pets" ? "active" : ""}`}
            onClick={() => setActiveTab("pets")}
            id="admin-tab-pets"
          >
            <FaPaw /> Manage Pets ({animals.length})
          </button>
        </div>

        {/* ===================================================
            TAB 1: ADOPTION REQUESTS SUBMISSIONS
            =================================================== */}
        {activeTab === "adoptions" && (
          <section className="admin-content-section" id="admin-section-adoptions">
            <div className="admin-section-header">
              <div>
                <h2>Adoption Applications</h2>
                <p>Review, verify, update statuses, or archive incoming adoption requests.</p>
              </div>

              {/* Status Filter */}
              <div className="filter-group">
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Filter:</span>
                {["all", "Pending", "Approved", "Rejected"].map((st) => (
                  <button
                    key={st}
                    className={`status-filter-btn ${statusFilter === st ? "active" : ""}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st === "all" ? "All" : st}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="admin-loading-state">
                <FaSpinner className="spinner" /> Loading submissions...
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="admin-empty-state">
                <FaClipboardList className="empty-icon" />
                <h3>No adoption applications found</h3>
                <p>Applications submitted on the public website will appear here in real time.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Applicant</th>
                      <th>Target Pet</th>
                      <th>Contact Info</th>
                      <th>Residence</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => (
                      <tr key={req.id}>
                        <td>#{req.id}</td>
                        <td>
                          <strong>{req.applicant_name}</strong>
                        </td>
                        <td>
                          <span className="table-pet-badge">
                            🐾 {req.animal?.name || `Pet #${req.animal_id}`}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.88rem" }}>{req.email}</div>
                          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{req.phone}</div>
                        </td>
                        <td style={{ fontSize: "0.88rem" }}>{req.housing_type}</td>
                        <td>
                          <span className={`status-pill status-${(req.status || "Pending").toLowerCase()}`}>
                            {req.status === "Pending" && <FaClock />}
                            {req.status === "Approved" && <FaCheck />}
                            {req.status === "Rejected" && <FaTimes />}
                            {req.status || "Pending"}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                          {new Date(req.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className="table-actions">
                            <button
                              className="btn-action view"
                              onClick={() => setInspectRequest(req)}
                              title="Inspect Full Application"
                              id={`btn-inspect-request-${req.id}`}
                            >
                              <FaEye /> Inspect
                            </button>
                            <button
                              className="btn-action delete"
                              onClick={() => handleDeleteRequest(req.id)}
                              title="Delete Record"
                              id={`btn-delete-request-${req.id}`}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ===================================================
            TAB 2: AVAILABLE PETS CRUD
            =================================================== */}
        {activeTab === "pets" && (
          <section className="admin-content-section" id="admin-section-pets">
            <div className="admin-section-header">
              <div>
                <h2>Manage Shelter Animals</h2>
                <p>Create new pet listings with Cloudinary photos, update details, or remove adopted pets.</p>
              </div>

              <button 
                className="btn-primary" 
                onClick={handleOpenAddPet}
                id="btn-admin-add-new-pet"
              >
                <FaPlus /> Add New Animal
              </button>
            </div>

            {loading ? (
              <div className="admin-loading-state">
                <FaSpinner className="spinner" /> Loading animals...
              </div>
            ) : animals.length === 0 ? (
              <div className="admin-empty-state">
                <FaPaw className="empty-icon" />
                <h3>No animals registered yet</h3>
                <p>Click "Add New Animal" above to list your first rescue pet.</p>
              </div>
            ) : (
              <div className="admin-pets-grid">
                {animals.map((animal) => {
                  const imageSrc = animal.image_url || animal.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80";
                  return (
                    <div className="admin-pet-card" key={animal.id} id={`admin-pet-card-${animal.id}`}>
                      <div className="admin-pet-thumb-wrap">
                        <img src={imageSrc} alt={animal.name} />
                        {animal.category === "priority" && (
                          <span className="thumb-priority-tag">★ Priority</span>
                        )}
                      </div>

                      <div className="admin-pet-card-info">
                        <div className="admin-pet-card-title">
                          <h3>{animal.name}</h3>
                          <span className="pet-id-tag">ID: #{animal.id}</span>
                        </div>
                        <p className="admin-pet-breed">{animal.breed}</p>
                        
                        <div className="admin-pet-meta">
                          <span>{animal.age ? `${animal.age} yrs` : "Age -"}</span>
                          <span>•</span>
                          <span>{animal.gender || "Gender -"}</span>
                          <span>•</span>
                          <span>{animal.weight ? `${animal.weight} kg` : "-"}</span>
                        </div>

                        <p className="admin-pet-desc-snip">
                          {animal.description || "No description provided."}
                        </p>

                        <div className="admin-pet-card-actions">
                          <button
                            className="btn-secondary btn-sm"
                            onClick={() => handleOpenEditPet(animal)}
                            id={`btn-edit-pet-${animal.id}`}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => handleDeletePet(animal.id)}
                            id={`btn-delete-pet-${animal.id}`}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* ===================================================
          MODAL: ADD / EDIT PET (Cloudinary Image Upload)
          =================================================== */}
      {showPetModal && (
        <div className="modal-overlay" onClick={() => setShowPetModal(false)}>
          <div 
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
            id="admin-pet-form-modal"
          >
            <button className="pet-modal-close" onClick={() => setShowPetModal(false)}>
              <FaTimes />
            </button>

            <form onSubmit={handleSavePet} className="admin-pet-form">
              <div className="admin-modal-header">
                <h2>{editingPet ? `Edit Pet: ${editingPet.name}` : "Add New Rescue Pet"}</h2>
                <p>Upload a photo (hosted on Cloudinary) and provide details for public display.</p>
              </div>

              {/* Image Upload Area */}
              <div className="image-upload-dropzone">
                {petImagePreview ? (
                  <div className="preview-wrap">
                    <img src={petImagePreview} alt="Preview" className="img-preview" />
                    <label htmlFor="pet-img-input" className="change-img-overlay">
                      <FaCamera /> Change Photo
                    </label>
                  </div>
                ) : (
                  <label htmlFor="pet-img-input" className="upload-prompt">
                    <FaCamera className="upload-icon" />
                    <span>Upload Pet Photo</span>
                    <small>Cloudinary CDN will host and optimize this image</small>
                  </label>
                )}
                <input
                  id="pet-img-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </div>

              {/* Form Grid */}
              <div className="form-row">
                <div className="form-group">
                  <label>Pet Name *</label>
                  <input
                    type="text"
                    required
                    value={petForm.name}
                    onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Farquad"
                  />
                </div>
                <div className="form-group">
                  <label>Breed *</label>
                  <input
                    type="text"
                    required
                    value={petForm.breed}
                    onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Aspin, Shih Tzu Mix"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={petForm.weight}
                    onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })}
                    className="form-control"
                    placeholder="e.g. 12.5"
                  />
                </div>
                <div className="form-group">
                  <label>Age (years)</label>
                  <input
                    type="number"
                    value={petForm.age}
                    onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
                    className="form-control"
                    placeholder="e.g. 2"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={petForm.gender}
                    onChange={(e) => setPetForm({ ...petForm, gender: e.target.value })}
                    className="form-control"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={petForm.category}
                    onChange={(e) => setPetForm({ ...petForm, category: e.target.value })}
                    className="form-control"
                  >
                    <option value="normal">Normal (Companion)</option>
                    <option value="priority">Priority Rescue</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Background & Description</label>
                <textarea
                  rows="3"
                  value={petForm.description}
                  onChange={(e) => setPetForm({ ...petForm, description: e.target.value })}
                  className="form-control"
                  placeholder="Where was this pet found? Special medical or rescue notes..."
                ></textarea>
              </div>

              <div className="form-group">
                <label>Personality Profile</label>
                <textarea
                  rows="2"
                  value={petForm.personality}
                  onChange={(e) => setPetForm({ ...petForm, personality: e.target.value })}
                  className="form-control"
                  placeholder="e.g. Energetic, loves kids, quiet, house-trained..."
                ></textarea>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowPetModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={actionLoading}
                  id="btn-admin-submit-pet"
                >
                  {actionLoading ? (
                    <>
                      <FaSpinner className="spinner" /> Saving...
                    </>
                  ) : editingPet ? (
                    "Save Changes"
                  ) : (
                    "Add Animal"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================
          MODAL: INSPECT ADOPTION APPLICATION
          =================================================== */}
      {inspectRequest && (
        <div className="modal-overlay" onClick={() => setInspectRequest(null)}>
          <div 
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
            id="admin-inspect-modal"
          >
            <button className="pet-modal-close" onClick={() => setInspectRequest(null)}>
              <FaTimes />
            </button>

            <div className="inspect-header">
              <span className="section-badge">Application #{inspectRequest.id}</span>
              <h2>Adoption Application Review</h2>
              <p>Submitted on {new Date(inspectRequest.created_at).toLocaleString()}</p>
            </div>

            {/* Target Pet Box */}
            <div className="inspect-pet-box">
              <div className="inspect-pet-title">
                <span>Selected Animal:</span>
                <strong>{inspectRequest.animal?.name || `Pet ID #${inspectRequest.animal_id}`}</strong>
              </div>
              <p>{inspectRequest.animal?.breed} • {inspectRequest.animal?.gender} • {inspectRequest.animal?.category === "priority" ? "Priority Rescue" : "Standard Companion"}</p>
            </div>

            {/* Applicant Details Grid */}
            <div className="inspect-details-grid">
              <div className="detail-item">
                <span className="detail-label">Applicant Name</span>
                <span className="detail-value">{inspectRequest.applicant_name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{inspectRequest.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone Number</span>
                <span className="detail-value">{inspectRequest.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Residence Type</span>
                <span className="detail-value">{inspectRequest.housing_type}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Home Address</span>
                <span className="detail-value">{inspectRequest.address}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Past Pet Experience</span>
                <span className="detail-value">{inspectRequest.pet_experience || "None specified"}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Applicant Questions / Remarks</span>
                <span className="detail-value">{inspectRequest.notes || "None provided"}</span>
              </div>
            </div>

            {/* Status Control Actions */}
            <div className="inspect-status-actions">
              <div className="current-status-display">
                <span>Current Status:</span>
                <span className={`status-pill status-${(inspectRequest.status || "Pending").toLowerCase()}`}>
                  {inspectRequest.status || "Pending"}
                </span>
              </div>

              <div className="status-change-buttons">
                <button
                  className="btn-status-action btn-approve"
                  onClick={() => handleUpdateStatus(inspectRequest.id, "Approved")}
                  disabled={inspectRequest.status === "Approved"}
                >
                  <FaCheck /> Mark as Approved
                </button>
                <button
                  className="btn-status-action btn-reject"
                  onClick={() => handleUpdateStatus(inspectRequest.id, "Rejected")}
                  disabled={inspectRequest.status === "Rejected"}
                >
                  <FaTimes /> Mark as Rejected
                </button>
                <button
                  className="btn-status-action btn-pending"
                  onClick={() => handleUpdateStatus(inspectRequest.id, "Pending")}
                  disabled={inspectRequest.status === "Pending"}
                >
                  <FaClock /> Set to Pending
                </button>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                className="btn-danger btn-sm"
                onClick={() => handleDeleteRequest(inspectRequest.id)}
              >
                <FaTrash /> Delete Application
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setInspectRequest(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
