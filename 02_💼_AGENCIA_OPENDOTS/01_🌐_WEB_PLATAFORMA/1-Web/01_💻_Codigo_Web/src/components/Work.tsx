import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { config } from "../config";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  useEffect(() => {
    // Disable pinning on mobile to allow scrolling
    if (window.innerWidth <= 768) return;

    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      const padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        id: "work",
        invalidateOnRefresh: true,
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    // Refresh ScrollTrigger after layout settles
    ScrollTrigger.refresh();

    // Clean up
    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Proyectos <span>Destacados</span>
        </h2>
        <div className="work-flex">
          {config.projects.slice(0, 5).map((project, index) => {
            const isExternal = Boolean(project.link && !project.link.startsWith("/"));
            const techList = project.technologies
              ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <div className="work-box" key={project.id}>
                <div className="work-info">
                  <div className="work-title">
                    <span className="work-index">0{index + 1}</span>

                    <div className="work-title-meta">
                      <span className="work-category">{project.category}</span>
                      <h4>{project.title}</h4>
                    </div>
                  </div>

                  <div className="work-tech-section">
                    <span className="work-tech-title">Stack & Tecnologías</span>
                    <div className="work-tech-chips">
                      {techList.map((tech, i) => (
                        <span key={i} className="work-tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.link && (
                    <div className="work-link-wrapper">
                      {isExternal ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="work-explore-btn"
                          data-cursor="disable"
                        >
                          <span>Ver proyecto</span>
                          <ArrowUpRight size={14} className="work-arrow" />
                        </a>
                      ) : (
                        <Link
                          to={project.link}
                          className="work-explore-btn"
                          data-cursor="disable"
                        >
                          <span>Explorar</span>
                          <ArrowRight size={14} className="work-arrow" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                <WorkImage image={project.image} alt={project.title} link={project.link} />
              </div>
            );
          })}
          {/* See All Works Button */}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <span className="see-all-badge">PORTFOLIO COMPLETO</span>
              <h3>¿Quieres ver más?</h3>
              <p>Explora todos nuestros proyectos, integraciones y creaciones interactivas</p>
              <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                <span>Ver Todos los Trabajos</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
