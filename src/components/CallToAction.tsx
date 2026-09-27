import { Link } from "react-router-dom";
import { config } from "../config";
import "./styles/CallToAction.css";

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="cta-buttons">
        <Link to="/play" className="cta-btn cta-btn-play" data-cursor="disable">
          Juega Conmigo →
        </Link>
        
        <a 
          href={config.contact.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cta-btn cta-btn-hire"
          data-cursor="disable"
        >
          Contactar por WhatsApp →
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
