import React from "react";
import { FaTimes, FaHeart, FaPaw, FaVenusMars, FaWeightHanging, FaBirthdayCake } from "react-icons/fa";

export default function PetModal({ animal, onClose, onAdoptClick }) {
  if (!animal) return null;

  const imageSrc = animal.image_url || animal.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="modal-overlay" onClick={onClose} id="pet-details-modal-overlay">
      <div 
        className="pet-modal-card" 
        onClick={(e) => e.stopPropagation()}
        id={`pet-modal-${animal.id}`}
      >
        <button className="pet-modal-close" onClick={onClose} id="pet-modal-close-btn" aria-label="Close modal">
          <FaTimes />
        </button>

        <div className="pet-modal-grid">
          {/* Left: Image with Badges */}
          <div className="pet-modal-media">
            <img src={imageSrc} alt={animal.name} className="pet-modal-img" />
            <div className="pet-modal-badges">
              {animal.category === "priority" && (
                <span className="badge-priority">★ Priority Rescue</span>
              )}
              <span className="badge-status">Ready for Adoption</span>
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="pet-modal-body">
            <div className="pet-modal-header">
              <span className="pet-modal-tagline">Meet Your Future Companion</span>
              <h2 className="pet-modal-name">{animal.name}</h2>
              <p className="pet-modal-breed"><FaPaw /> {animal.breed}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="pet-stats-grid">
              <div className="pet-stat-item">
                <FaBirthdayCake className="stat-icon" />
                <div>
                  <span className="stat-label">AGE</span>
                  <span className="stat-value">{animal.age ? `${animal.age} yrs` : "Unknown"}</span>
                </div>
              </div>
              <div className="pet-stat-item">
                <FaVenusMars className="stat-icon" />
                <div>
                  <span className="stat-label">GENDER</span>
                  <span className="stat-value">{animal.gender || "Not specified"}</span>
                </div>
              </div>
              <div className="pet-stat-item">
                <FaWeightHanging className="stat-icon" />
                <div>
                  <span className="stat-label">WEIGHT</span>
                  <span className="stat-value">{animal.weight ? `${animal.weight} kg` : "-"}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pet-modal-section">
              <h4>About {animal.name}</h4>
              <p>{animal.description || "No specific background description recorded yet."}</p>
            </div>

            {/* Personality */}
            <div className="pet-modal-section">
              <h4>Personality & Behavior</h4>
              <p>{animal.personality || "Friendly, gentle, and ready to meet a loving human companion."}</p>
            </div>

            {/* Actions */}
            <div className="pet-modal-actions">
              <button 
                className="btn-primary pet-modal-adopt-btn"
                id={`btn-adopt-pet-${animal.id}`}
                onClick={() => onAdoptClick(animal)}
              >
                <FaHeart /> Apply to Adopt {animal.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
