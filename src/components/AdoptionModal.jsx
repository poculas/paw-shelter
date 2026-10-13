import React, { useState } from "react";
import { FaTimes, FaPaw, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { createAdoptionRequest } from "../api/animals";

export default function AdoptionModal({ animal, availableAnimals = [], onClose, onSuccess }) {
  const [selectedAnimalId, setSelectedAnimalId] = useState(animal?.id || (availableAnimals[0]?.id || ""));
  const [formData, setFormData] = useState({
    applicant_name: "",
    email: "",
    phone: "",
    address: "",
    housing_type: "House with fenced yard",
    pet_experience: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const chosenAnimal = availableAnimals.find((a) => String(a.id) === String(selectedAnimalId)) || animal;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedAnimalId) {
      setError("Please select an available pet to adopt.");
      return;
    }

    if (!formData.applicant_name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError("Please fill out all required fields marked with *.");
      return;
    }

    setLoading(true);
    try {
      await createAdoptionRequest({
        animal_id: selectedAnimalId,
        applicant_name: formData.applicant_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        housing_type: formData.housing_type,
        pet_experience: formData.pet_experience.trim(),
        notes: formData.notes.trim(),
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Adoption submission error", err);
      setError("Failed to submit your application. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="adoption-modal-overlay">
      <div 
        className="adoption-modal-card" 
        onClick={(e) => e.stopPropagation()}
        id="adoption-modal-dialog"
      >
        <button className="pet-modal-close" onClick={onClose} id="adoption-modal-close-btn" aria-label="Close modal">
          <FaTimes />
        </button>

        {submitted ? (
          <div className="adoption-success-state">
            <FaCheckCircle className="success-icon" />
            <h2>Application Received!</h2>
            <p>
              Thank you for applying to give <strong>{chosenAnimal?.name || "a rescue pet"}</strong> a loving home.
            </p>
            <div className="success-details-card">
              <p>✓ Your application has been logged into our system.</p>
              <p>✓ Shelter staff will review your details and contact you via phone or email within <strong>24 to 48 hours</strong>.</p>
              <p>✓ Please prepare a valid government ID and photos of your pet space for your scheduled visit.</p>
            </div>
            <button className="btn-primary" onClick={onClose} id="btn-adoption-success-close">
              Back to Available Pets
            </button>
          </div>
        ) : (
          <form className="adoption-form" onSubmit={handleSubmit} id="native-adoption-form">
            <div className="adoption-form-header">
              <span className="section-badge"><FaPaw /> Adoption Application</span>
              <h2>Pet Adoption Request</h2>
              <p>Fill out the application below to begin the adoption process for your chosen rescue animal.</p>
            </div>

            {error && <div className="form-alert-error" role="alert">{error}</div>}

            {/* Target Animal Selector */}
            <div className="form-group">
              <label htmlFor="animal_id">Pet You Wish to Adopt *</label>
              <select
                id="animal_id"
                name="animal_id"
                value={selectedAnimalId}
                onChange={(e) => setSelectedAnimalId(e.target.value)}
                required
                className="form-control"
              >
                {availableAnimals.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.breed} - {a.gender || "Rescue"})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="applicant_name">Your Full Name *</label>
                <input
                  type="text"
                  id="applicant_name"
                  name="applicant_name"
                  placeholder="e.g. Maria Santos"
                  value={formData.applicant_name}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="e.g. maria@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone / Mobile Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="e.g. 0917 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="housing_type">Type of Residence *</label>
                <select
                  id="housing_type"
                  name="housing_type"
                  value={formData.housing_type}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="House with fenced yard">House with fenced yard</option>
                  <option value="House without yard">House without yard</option>
                  <option value="Apartment (Pet-friendly)">Apartment (Pet-friendly)</option>
                  <option value="Condominium (Pet-friendly)">Condominium (Pet-friendly)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Complete Home Address *</label>
              <textarea
                id="address"
                name="address"
                rows="2"
                placeholder="Street address, Barangay, City, Province, Postal Code"
                value={formData.address}
                onChange={handleChange}
                required
                className="form-control"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="pet_experience">Previous Pet Experience (Optional)</label>
              <textarea
                id="pet_experience"
                name="pet_experience"
                rows="2"
                placeholder="Tell us about pets you currently have or have previously cared for..."
                value={formData.pet_experience}
                onChange={handleChange}
                className="form-control"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Questions or Remarks (Optional)</label>
              <input
                type="text"
                id="notes"
                name="notes"
                placeholder="Preferred visit times or questions for the shelter..."
                value={formData.notes}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="adoption-form-footer">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                id="btn-submit-adoption-form"
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner" /> Submitting...
                  </>
                ) : (
                  "Submit Adoption Application"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
