import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPaw, FaHeart, FaHandsHelping, FaHome, FaInfoCircle, FaCalendarCheck } from "react-icons/fa";
import { getAnimals } from "../api/animals";

// Assets
import heroBg from "../assets/homebg.jpg";
import shelterImg from "../assets/shelter.jpg";
import facilityImg from "../assets/facility.png";
import userIcon from "../assets/userIcon.png";
import pawIcon from "../assets/pawIcon.png";
import step1Icon from "../assets/step1.png";
import step2Icon from "../assets/step2.png";
import step3Icon from "../assets/step3.png";
import step4Icon from "../assets/step4.png";

// Developer photos
import devJb from "../assets/jb.jpg";
import devJosh from "../assets/josh.jpg";
import devRochelle from "../assets/rochelle.jpg";
import devJizel from "../assets/jizel.jpg";

// Fallback pet photos
import prio1 from "../assets/farquad.jpg";
import prio2 from "../assets/blacky.jpg";
import prio3 from "../assets/beverly.webp";
import norm1 from "../assets/abdul.jpg";
import norm2 from "../assets/lee.jpg";
import norm3 from "../assets/ismail.jpg";

// Modals
import PetModal from "../components/PetModal";
import AdoptionModal from "../components/AdoptionModal";

import "../styles/home.css";

/* ── Scroll Reveal Hook ────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Skeleton Card ─────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-content">
        <div className="skeleton-line wide" />
        <div className="skeleton-line short" />
        <div className="skeleton-line wide" style={{ marginTop: 16 }} />
      </div>
    </div>
  );
}

export default function Home() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Modal states
  const [selectedPet, setSelectedPet] = useState(null);
  const [adoptionModalOpen, setAdoptionModalOpen] = useState(false);
  const [petForAdoption, setPetForAdoption] = useState(null);

  // Trigger reveal after content loads
  useReveal();

  useEffect(() => {
    loadAnimals();
  }, []);

  async function loadAnimals() {
    setLoading(true);
    try {
      const data = await getAnimals();
      if (Array.isArray(data) && data.length > 0) {
        setAnimals(data);
      } else {
        setAnimals(getDemoAnimals());
      }
    } catch (err) {
      console.warn("Could not load from API, using demo data fallback", err);
      setAnimals(getDemoAnimals());
    } finally {
      setLoading(false);
    }
  }

  function getDemoAnimals() {
    return [
      { id: 1, name: "Farquad", breed: "Shih Tzu Mix", weight: 5.2, age: 2, gender: "Male", category: "priority", description: "Rescued from an abandoned building in Manila. Gentle-natured, loves treats, and gets along well with other small dogs.", personality: "Affectionate, quiet, couch-potato, easygoing with humans.", image: prio1 },
      { id: 2, name: "Blacky", breed: "Aspin (Native)", weight: 14.5, age: 3, gender: "Male", category: "priority", description: "High-energy rescue found wandering near Quezon City circle. Fully vaccinated and eager to find an active family.", personality: "Loyal, energetic, great watch-companion, highly trainable.", image: prio2 },
      { id: 3, name: "Beverly", breed: "Domestic Shorthair", weight: 3.8, age: 1, gender: "Female", category: "priority", description: "Playful kitten rescued from a drainage pipe. She loves feather wands, warm laps, and window watching.", personality: "Curious, purrs constantly, friendly with children.", image: prio3 },
      { id: 4, name: "Abdul", breed: "Labrador Mix", weight: 21.0, age: 4, gender: "Male", category: "normal", description: "Rescued as a stray pup, now a gentle giant who walks smoothly on a leash and loves belly rubs.", personality: "Calm, patient, friendly with dogs and kids alike.", image: norm1 },
      { id: 5, name: "Lee", breed: "Tabby Cat", weight: 4.2, age: 2, gender: "Male", category: "normal", description: "Calm feline rescued near our Katipunan shelter. Fully neutered and litter-trained.", personality: "Independent, serene, loves sunbathing and chin scratches.", image: norm2 },
      { id: 6, name: "Ismail", breed: "Calico Cat", weight: 3.5, age: 2, gender: "Female", category: "normal", description: "Sweet and social calico looking for a calm home. Gets along well with other friendly pets.", personality: "Gentle, vocal when dinner is served, cuddly.", image: norm3 },
    ];
  }

  const imageFor = (animal) => {
    if (!animal) return norm1;
    if (animal.image_url) return animal.image_url;
    if (animal.image) return animal.image;
    return norm1;
  };

  const filteredAnimals = animals.filter((animal) => {
    if (activeFilter === "priority") return animal.category === "priority";
    if (activeFilter === "normal") return animal.category === "normal" || !animal.category;
    return true;
  });

  const handleOpenAdopt = (animal) => {
    setSelectedPet(null);
    setPetForAdoption(animal);
    setAdoptionModalOpen(true);
  };

  const handleOpenAdoptionGeneral = () => {
    setPetForAdoption(animals[0] || null);
    setAdoptionModalOpen(true);
  };

  return (
    <div className="single-page-wrapper">

      {/* ========================================
          1. HERO SECTION (#home)
          ======================================== */}
      <section
        className="hero-banner"
        id="home"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-tag">
              <FaPaw /> Compassionate Animal Welfare &amp; Rescue
            </span>

            <h1 className="hero-title">
              Giving Rescued Pets a <span>Second Chance.</span>
            </h1>

            <p className="hero-description">
              Meet our loving rescue dogs and cats awaiting forever homes. Learn their stories, explore their personalities, and submit your adoption application online today.
            </p>

            <div className="hero-actions">
              <a href="#pets" className="btn-primary" id="hero-btn-meet-pets" onClick={(e) => { e.preventDefault(); document.getElementById("pets")?.scrollIntoView({ behavior: "smooth" }); }}>
                <FaHeart /> Meet Our Pets
              </a>
              <a href="#adoption" className="btn-secondary" id="hero-btn-how-to-adopt" onClick={(e) => { e.preventDefault(); document.getElementById("adoption")?.scrollIntoView({ behavior: "smooth" }); }}>
                <FaInfoCircle /> Adoption Guide
              </a>
            </div>

            <div className="hero-highlights">
              <div className="hero-stat">
                <strong>100%</strong>
                <span>Volunteer &amp; Rescue Driven</span>
              </div>
              <div className="hero-stat">
                <strong>No-Kill</strong>
                <span>Advocacy &amp; Shelter</span>
              </div>
              <div className="hero-stat">
                <strong>Free</strong>
                <span>Vaccinated &amp; Sterilized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          2. ADOPTABLE PETS SECTION (#pets)
          ======================================== */}
      <section className="pets-section" id="pets">
        <div className="section-container" style={{ padding: "0 28px 20px" }}>
          <div className="section-header reveal">
            <span className="section-badge"><FaPaw /> Ready for Adoption</span>
            <h2 className="section-title">Meet Our Rescued Animals</h2>
            <p className="section-subtitle">
              Every pet here has a unique story of recovery and resilience. Click any card to view their full profile and start your adoption journey.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar reveal">
            <button
              className={`filter-pill ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
              id="filter-all-pets"
            >
              All Available ({animals.length})
            </button>
            <button
              className={`filter-pill ${activeFilter === "priority" ? "active" : ""}`}
              onClick={() => setActiveFilter("priority")}
              id="filter-priority-pets"
            >
              ★ Priority Rescues ({animals.filter((a) => a.category === "priority").length})
            </button>
            <button
              className={`filter-pill ${activeFilter === "normal" ? "active" : ""}`}
              onClick={() => setActiveFilter("normal")}
              id="filter-normal-pets"
            >
              Friendly Companions ({animals.filter((a) => a.category !== "priority").length})
            </button>
          </div>

          {/* Pets Grid */}
          {loading ? (
            <div className="pets-loading-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="pets-grid">
              {filteredAnimals.map((animal, idx) => (
                <div
                  className="pet-card reveal"
                  style={{ animationDelay: `${idx * 0.06}s`, transitionDelay: `${idx * 0.06}s` }}
                  key={animal.id}
                  onClick={() => setSelectedPet(animal)}
                  id={`pet-card-${animal.id}`}
                >
                  <div className="pet-card-image-wrap">
                    <img src={imageFor(animal)} alt={animal.name} loading="lazy" />
                    {animal.category === "priority" && (
                      <span className="priority-tag">★ Priority</span>
                    )}
                  </div>

                  <div className="pet-card-content">
                    <h3 className="pet-card-name">{animal.name}</h3>
                    <p className="pet-card-breed">{animal.breed}</p>

                    <div className="pet-card-badges">
                      {animal.age && <span className="pet-badge">{animal.age} yrs</span>}
                      {animal.gender && <span className="pet-badge">{animal.gender}</span>}
                      {animal.weight && <span className="pet-badge">{animal.weight} kg</span>}
                    </div>

                    <button
                      className="pet-card-btn"
                      onClick={(e) => { e.stopPropagation(); setSelectedPet(animal); }}
                      id={`btn-view-profile-${animal.id}`}
                    >
                      <FaPaw /> View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          3. ABOUT US SECTION (#about)
          ======================================== */}
      <section className="about-section" id="about">
        <div className="section-container" style={{ padding: "0 28px" }}>
          <div className="section-header reveal">
            <span className="section-badge"><FaHandsHelping /> Who We Are</span>
            <h2 className="section-title">About Paw Shelter</h2>
            <p className="section-subtitle">
              Founded in 2025, our team is the result of passionate animal lovers coming together to improve the lives of cats and dogs in the Philippines.
            </p>
          </div>

          {/* Story */}
          <div className="about-story-grid" style={{ marginBottom: "64px" }}>
            <img src={shelterImg} alt="Paw Shelter rescues" className="about-story-img reveal-left" />
            <div className="about-story-text reveal-right">
              <h3>Our Compassionate Story</h3>
              <p>
                As a non-profit, non-government advocacy, we operate independently of government funding and rely on dedicated volunteer efforts and compassionate adopters.
              </p>
              <p>
                Every day, our rescue team rehabilitates injured, abandoned, and surrendered pets — ensuring they receive medical care, sterilization, nutritious food, and emotional warmth before matching them with responsible guardians.
              </p>
              <div style={{ marginTop: "28px" }}>
                <a href="#pets" className="btn-primary" id="about-btn-view-pets" onClick={(e) => { e.preventDefault(); document.getElementById("pets")?.scrollIntoView({ behavior: "smooth" }); }}>
                  <FaPaw /> See Rescued Animals
                </a>
              </div>
            </div>
          </div>

          {/* Vision / Mission */}
          <div className="values-grid">
            {[
              { emoji: "🎯", title: "Our Vision", text: "A society where humans, cats, and dogs coexist safely and compassionately, free from stray animal neglect and cruelty." },
              { emoji: "🌱", title: "Our Mission", text: "To strengthen communities by advocating for accessible sterilization, veterinary care, rehabilitation, and responsible rehoming for stray cats and dogs." },
              { emoji: "🐾", title: "Core Goals", text: "Promote Catch–Neuter–Vaccinate–Return (CNVR) initiatives, advocate for no-kill shelters, and educate the public on lifelong pet ownership." },
            ].map((item, i) => (
              <div className="value-card reveal" style={{ transitionDelay: `${i * 0.1}s` }} key={item.title}>
                <h4>{item.emoji} {item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Facility */}
          <div className="facility-card reveal" style={{ marginBottom: "72px", marginTop: "0" }}>
            <img src={facilityImg} alt="Paw Shelter Animal Welfare Facility" />
            <div className="facility-info">
              <h3>The Paw Shelter Animal Welfare Facility</h3>
              <p>
                Our shelter features dedicated canine runs, feline recovery suites, and bonded visitation areas designed to provide a calm, enriched environment for rescues.
              </p>
              <div className="facility-location-tag">
                📍 Aurora Boulevard cor. Katipunan Avenue, Loyola Heights, Quezon City, Philippines 1108
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="faqs-container">
            <div className="section-header reveal" style={{ marginBottom: "36px" }}>
              <span className="section-badge">Helpful Information</span>
              <h3 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontFamily: "var(--font-heading)", fontWeight: 800 }}>Frequently Asked Questions</h3>
            </div>
            <div className="faq-list">
              {[
                { q: "How does the adoption process work?", a: "Submit our online form, bond with your chosen pet during two shelter visits, and complete our friendly screening interview to ensure a safe, lifelong match." },
                { q: "Can Paw Shelter take in my pet?", a: "Unfortunately, we focus strictly on rescued strays from critical circumstances. We are unable to accept owned pets, but can guide you to rehoming communities." },
                { q: "Can people outside Metro Manila adopt?", a: "Yes! We welcome adopters from the provinces or overseas. Let us know your location so we can arrange virtual meetings and transportation coordination." },
              ].map((faq, i) => (
                <div className="faq-card reveal" style={{ transitionDelay: `${i * 0.1}s` }} key={i}>
                  <h4>{faq.q}</h4>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Developers */}
          <div className="devs-section reveal">
            <span className="section-badge">Built With Care</span>
            <h3 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", marginTop: "8px", marginBottom: "8px" }}>Meet Our Developers</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "8px" }}>
              The passionate team behind Paw Shelter's digital platform.
            </p>
            <div className="devs-grid">
              {[
                { name: "Jay Bhie Bite", img: devJb },
                { name: "Josh Kenneth Carpio", img: devJosh },
                { name: "Rochelle Ann Salucop", img: devRochelle },
                { name: "Jizel Vergara", img: devJizel },
              ].map((dev, i) => (
                <div key={dev.name} className="dev-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <img src={dev.img} alt={dev.name} />
                  <h5>{dev.name}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          4. ADOPTION PROCESS SECTION (#adoption)
          ======================================== */}
      <section className="adoption-section" id="adoption">
        <div className="section-container" style={{ padding: "0 28px" }}>
          <div className="section-header reveal">
            <span className="section-badge"><FaHome /> Forever Families</span>
            <h2 className="section-title">The Pet Adoption Process</h2>
            <p className="section-subtitle">
              Four straightforward steps to welcoming your new rescue companion into your home.
            </p>
          </div>

          {/* Steps */}
          <div className="steps-grid">
            {[
              { num: "01", icon: step1Icon, title: "1. Browse Pets", desc: "Explore our available dogs and cats online and select the companion that matches your lifestyle." },
              { num: "02", icon: step2Icon, title: "2. Apply Online", desc: "Complete our native online adoption request form with your contact and residence details." },
              { num: "03", icon: step3Icon, title: "3. Meet & Bond", desc: "Visit our facility in Quezon City to bond with the animal and meet with our adoption counselor." },
              { num: "04", icon: step4Icon, title: "4. Welcome Home", desc: "Upon approval, finalize your adoption agreement and officially welcome your new pet home!" },
            ].map((step, i) => (
              <div className="step-card reveal" style={{ transitionDelay: `${i * 0.1}s` }} key={step.num}>
                <span className="step-number">{step.num}</span>
                <img src={step.icon} alt={step.title} className="step-icon" />
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="reqs-grid">
            <div className="req-panel reveal-left">
              <h3><img src={userIcon} alt="" style={{ height: "22px" }} /> Requirements</h3>
              <ul>
                {["Valid Government-Issued ID", "1×1 ID photo of the primary adopter", "Proof of residence (billing statement or lease agreement)", "Photos of your home interior and designated pet space", "Commitment to humane care and lifelong companionship"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="req-panel reveal-right">
              <h3><img src={pawIcon} alt="" style={{ height: "22px" }} /> Necessary Pet Equipment</h3>
              <ul>
                {["Secure crate or pet carrier (appropriate for pet size)", "Sturdy collar, ID tag, and non-retractable leash", "Food and water bowls", "Designated pet bed or resting blanket", "Age-appropriate starter pet food"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="adoption-cta-box reveal">
            <h3>Ready to Make a Difference?</h3>
            <p>By adopting, you save a life and create space in our shelter to rescue another animal in need.</p>
            <button
              className="btn-white"
              onClick={handleOpenAdoptionGeneral}
              id="btn-open-general-adoption-form"
            >
              <FaCalendarCheck /> Submit Adoption Application
            </button>
          </div>
        </div>
      </section>

      {/* ── MODALS ── */}
      {selectedPet && (
        <PetModal
          animal={selectedPet}
          onClose={() => setSelectedPet(null)}
          onAdoptClick={(pet) => handleOpenAdopt(pet)}
        />
      )}

      {adoptionModalOpen && (
        <AdoptionModal
          animal={petForAdoption}
          availableAnimals={animals}
          onClose={() => setAdoptionModalOpen(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
