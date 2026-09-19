import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Bienvenido a</h2>
            <div className="landing-brand-header">
              <img
                src="/logo.png"
                alt="JRG Agency Logo"
                className="landing-title-logo"
                loading="eager"
              />
              <h1>
                {firstName.toUpperCase()}
                {' '}
                <br />
                {lastName && <span>{lastName.toUpperCase()}</span>}
              </h1>
            </div>
          </div>
          <div className="landing-info">
            <h3>Estudio de</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Diseño & 3D Web</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Desarrollo Frontend</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
