import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { config } from "../config";
import "./MyWorks.css";

const MyWorks = () => {
  return (
    <div className="myworks-page">
      <div className="myworks-header">
        <Link to="/" className="myworks-back-btn" data-cursor="disable">
          <ArrowLeft size={16} className="back-arrow" />
          <span>Volver al Inicio</span>
        </Link>
        <div className="myworks-kicker-wrap">
          <span className="myworks-kicker">
            <Sparkles size={13} className="kicker-icon" />
            SHOWCASE & PORTFOLIO
          </span>
        </div>
        <h1>
          Todos los <span>Proyectos</span>
        </h1>
        <p className="myworks-subtitle">
          Casos de éxito, plataformas web interactivas y experiencias de alto rendimiento desarrolladas con precisión por JRG Agency.
        </p>
        <div className="myworks-meta-bar">
          <span className="myworks-count-pill">
            {config.projects.length} Proyectos Destacados
          </span>
        </div>
      </div>

      <div className="myworks-grid">
        {config.projects.map((project, index) => {
          const isInternalLink = Boolean(project.link?.startsWith("/"));
          const techList = project.technologies
            ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
            : [];

          const cardContent = (
            <div className="myworks-card-inner">
              <div className="myworks-card-image-wrap">
                <span className="myworks-card-number">0{index + 1}</span>
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                />
                <div className="myworks-card-overlay">
                  <span className="myworks-overlay-btn">
                    <span>Ver proyecto</span>
                    {isInternalLink ? (
                      <ArrowRight size={14} className="overlay-arrow" />
                    ) : (
                      <ArrowUpRight size={14} className="overlay-arrow" />
                    )}
                  </span>
                </div>
              </div>

              <div className="myworks-card-info">
                <div className="myworks-card-header-row">
                  <span className="myworks-card-category">{project.category}</span>
                  <span className="myworks-card-arrow-pill">
                    {isInternalLink ? (
                      <ArrowRight size={14} />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}
                  </span>
                </div>

                <h3 className="myworks-card-title">{project.title}</h3>

                <p className="myworks-card-description">{project.description}</p>

                <div className="myworks-card-tech-wrapper">
                  <div className="myworks-card-tags">
                    {techList.map((tech, idx) => (
                      <span key={idx} className="myworks-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );

          if (isInternalLink) {
            return (
              <Link
                className="myworks-card"
                key={project.id}
                data-cursor="disable"
                to={project.link}
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <a
              className="myworks-card"
              key={project.id}
              data-cursor="disable"
              href={project.link || undefined}
              target={project.link ? "_blank" : undefined}
              rel={project.link ? "noopener noreferrer" : undefined}
            >
              {cardContent}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default MyWorks;
