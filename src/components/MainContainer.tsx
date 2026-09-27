import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import setSplitText from "./utils/splitText";
import { MobileDetailModal, ModalType } from "./MobileDetailModal";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [shouldRenderCharacter] = useState(true);
  const [modalType, setModalType] = useState<ModalType>(null);

  useEffect(() => {
    const resizeHandler = () => setSplitText();
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<ModalType>;
      if (customEvent.detail) {
        setModalType(customEvent.detail);
      }
    };
    window.addEventListener("open-detail-modal", handleOpen as EventListener);
    return () => window.removeEventListener("open-detail-modal", handleOpen as EventListener);
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {shouldRenderCharacter && children}
      <div className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStackNew />
        <Contact />
      </div>
      <MobileDetailModal type={modalType} onClose={() => setModalType(null)} />
    </div>
  );
};

export default MainContainer;