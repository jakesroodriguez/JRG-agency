import "./styles/About.css";
import { config } from "../config";

const About = () => {
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
      </div>
    </div>
  );
};

export default About;
