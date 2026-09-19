import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  useEffect(() => {
    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 95%",
        toggleActions: "play none none none",
      },
    });

    // Animate title and contact boxes smoothly
    contactTimeline.fromTo(
      ".contact-section h3, .contact-box",
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      }
    );

    // Clean up
    return () => {
      contactTimeline.kill();
    };
  }, []);

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>{config.developer.fullName}</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${config.contact.email}`} data-cursor="disable">
                {config.contact.email}
              </a>
            </p>
            <h4>WhatsApp & Teléfono</h4>
            <p>
              <a href={config.contact.whatsapp} target="_blank" rel="noopener noreferrer" data-cursor="disable">
                {config.contact.phone}
              </a>
            </p>
            <h4>Ubicación</h4>
            <p>
              <span>{config.social.location}</span>
            </p>
          </div>
          <div className="contact-box">
            <h4>Canales & Enlaces</h4>
            <a
              href={config.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              WhatsApp Directo <MdArrowOutward />
            </a>
            <a
              href={config.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Web JRG Estudio <MdArrowOutward />
            </a>
            <a
              href={config.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href={config.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box contact-box-brand">
            <img src="/logo.png" alt="JRG Agency Logo" className="contact-logo-img" />
            <h2>
              Diseñado y Desarrollado <br /> por <span>{config.developer.fullName}</span>
              <br /><small style={{ fontSize: '0.65em', opacity: 0.8 }}>Fundado por {config.developer.founder}</small>
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()} JRG Agency · Todos los derechos reservados
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
