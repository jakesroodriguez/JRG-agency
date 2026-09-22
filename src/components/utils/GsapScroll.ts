import * as THREE from "three";
import gsap from "gsap";

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  const width = typeof window !== "undefined" ? window.innerWidth : 1200;
  const isTablet = width > 768 && width <= 1024;
  const isDesktop = width > 1024;

  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: isDesktop ? "top top" : isTablet ? "top top" : "top 80%",
      end: isDesktop ? "+=140%" : isTablet ? "+=100%" : "bottom top",
      pin: isDesktop || isTablet,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: isDesktop ? "top top" : isTablet ? "top top" : "top 70%",
      end: isDesktop ? "+=140%" : isTablet ? "+=100%" : "bottom top",
      pin: isDesktop || isTablet,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  let monitor: any;
  character?.children.forEach((object: any) => {
    if (object.name === "Plane004" || object.name === "Plane.004") {
      object.children.forEach((child: any) => {
        child.material.transparent = true;
        child.material.opacity = 0;
        if (child.material.name === "Material.027") {
          monitor = child;
          child.material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      object.visible = false;
      if (object.material) {
        object.material.transparent = true;
        object.material.opacity = 0;
        object.material.visible = false;
      }
    }
  });

  const neckBone = character?.getObjectByName("spine005");

  if (!character) return;

  if (isDesktop) {
    // ─── DESKTOP SCROLL TIMELINE ───
    tl1
      .fromTo(character.rotation, { y: 0 }, { y: 0.55, duration: 1 }, 0)
      .to(camera.position, { z: 22 }, 0)
      .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
      .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
      .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
      .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

    tl2
      .fromTo(".about-section", { opacity: 1 }, { opacity: 1, duration: 4.5 }, 0)
      .to(
        camera.position,
        { z: 75, y: 8.4, duration: 2.5, delay: 4.5, ease: "power2.inOut" },
        0
      )
      .to(
        ".about-section",
        { opacity: 0, y: "-20%", delay: 4.8, duration: 2.2, ease: "power2.inOut" },
        0
      )
      .fromTo(
        ".character-model",
        { pointerEvents: "inherit" },
        { pointerEvents: "none", x: "-12%", delay: 4.5, duration: 2.5 },
        0
      )
      .to(character.rotation, { y: 0.8, x: 0.06, delay: 4.5, duration: 2.5 }, 0)
      .to(neckBone ? neckBone.rotation : {}, { x: 0.45, delay: 4.5, duration: 2.2 }, 0)
      .to(monitor ? monitor.material : {}, { opacity: 1, duration: 1.0, delay: 5.0 }, 0)
      .fromTo(
        monitor ? monitor.position : {},
        { y: -10, z: 2 },
        { y: 0, z: 0, delay: 4.5, duration: 2.2 },
        0
      )
      .fromTo(
        ".character-rim",
        { opacity: 1, scaleX: 1.4 },
        { opacity: 0, scale: 0, y: "-70%", duration: 2.5, delay: 4.5 },
        0
      );

    tl3
      .fromTo(".what-box", { opacity: 1, y: 0 }, { opacity: 1, y: 0, duration: 4.5 }, 0)
      .fromTo(
        ".character-model",
        { opacity: 1, y: "0%" },
        { opacity: 1, y: "0%", duration: 4.5 },
        0
      )
      .to(
        character.rotation,
        { x: -0.04, duration: 2.0, delay: 4.5, ease: "power2.inOut" },
        0
      )
      .to(
        ".character-model",
        { y: "-100%", autoAlpha: 0, duration: 2.5, delay: 4.5, ease: "power2.inOut" },
        0
      )
      .to(
        ".what-box",
        { opacity: 0, y: "-15%", duration: 2.2, delay: 4.8, ease: "power2.inOut" },
        0
      );
  } else if (isTablet) {
    // ─── TABLET SCROLL TIMELINE (768px - 1024px) ───
    tl1
      .fromTo(character.rotation, { y: 0 }, { y: 0.45, duration: 1 }, 0)
      .to(camera.position, { z: 26 }, 0)
      .fromTo(".character-model", { x: 0 }, { x: "-18%", duration: 1 }, 0)
      .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
      .to(".landing-container", { y: "30%", duration: 0.8 }, 0);

    tl2
      .fromTo(".about-section", { opacity: 1 }, { opacity: 1, duration: 3.5 }, 0)
      .to(
        camera.position,
        { z: 78, y: 8.8, duration: 2.0, delay: 3.5, ease: "power2.inOut" },
        0
      )
      .to(
        ".about-section",
        { opacity: 0, y: "-15%", delay: 3.8, duration: 1.8, ease: "power2.inOut" },
        0
      )
      .to(
        ".character-model",
        { x: "-8%", delay: 3.5, duration: 2.0 },
        0
      )
      .to(character.rotation, { y: 0.8, x: 0.05, delay: 3.5, duration: 2.0 }, 0)
      .to(neckBone ? neckBone.rotation : {}, { x: 0.45, delay: 3.5, duration: 1.8 }, 0)
      .to(monitor ? monitor.material : {}, { opacity: 1, duration: 0.8, delay: 3.8 }, 0)
      .fromTo(
        monitor ? monitor.position : {},
        { y: -10, z: 2 },
        { y: 0, z: 0, delay: 3.5, duration: 1.8 },
        0
      );

    tl3
      .fromTo(".what-box", { opacity: 1 }, { opacity: 1, duration: 3.5 }, 0)
      .to(
        ".character-model",
        { y: "-100%", autoAlpha: 0, duration: 2.0, delay: 3.5, ease: "power2.inOut" },
        0
      )
      .to(
        ".what-box",
        { opacity: 0, y: "-15%", duration: 1.8, delay: 3.8, ease: "power2.inOut" },
        0
      );
  } else {
    // ─── MOBILE SCROLL TIMELINE (< 768px) ───
    tl1
      .fromTo(character.rotation, { y: 0 }, { y: 0.35, duration: 1 }, 0)
      .to(camera.position, { z: 32 }, 0)
      .to(".landing-container", { opacity: 0, duration: 0.5 }, 0)
      .to(".landing-container", { y: "20%", duration: 0.8 }, 0);

    tl2
      .to(
        camera.position,
        { z: 80, y: 8.6, duration: 1.2, ease: "power2.inOut" },
        0
      )
      .to(character.rotation, { y: 0.75, x: 0.04, duration: 1.2 }, 0)
      .to(neckBone ? neckBone.rotation : {}, { x: 0.4, duration: 1.0 }, 0)
      .to(monitor ? monitor.material : {}, { opacity: 1, duration: 0.6, delay: 0.4 }, 0)
      .fromTo(
        monitor ? monitor.position : {},
        { y: -8, z: 2 },
        { y: 0, z: 0, duration: 1.0 },
        0
      );

    tl3
      .to(
        ".character-model",
        { y: "-60%", autoAlpha: 0, duration: 1.0, ease: "power2.inOut" },
        0
      );
  }
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 50%",
      end: "bottom 30%",
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "0%" },
      { maxHeight: "100%", duration: 1, ease: "none" },
      0
    )
    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.2 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  careerTimeline.fromTo(
    ".career-section",
    { y: 0 },
    { y: 0, duration: 0.5, delay: 0.2 },
    0
  );
}
