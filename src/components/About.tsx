import "./styles/About.css";
import { config } from "../config";

const About = () => {
  const openModal = () => {
    window.dispatchEvent(new CustomEvent("open-detail-modal", { detail: "about" }));
  };

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <div className="about-title-row">
          <img src="/logo.png" alt="JRG Logo" className="about-logo-badge" />
          <h3 className="title">{config.about.title}</h3>
        </div>
        <p className="para">
          {config.about.description}
        </p>

        {/* Mobile Interactive Action */}
        <div className="about-mobile-actions">
          <div className="about-highlights-pills">
            <span className="about-pill">Lighthouse 100/100</span>
            <span className="about-pill">Three.js WebGL</span>
            <span className="about-pill">Urretxu</span>
          </div>
          <button
            type="button"
            className="about-interactive-btn"
            onClick={openModal}
          >
            <span>Conocer más sobre JRG Agency</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
