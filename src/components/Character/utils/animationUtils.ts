import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { eyebrowBoneNames, typingBoneNames } from "../../../data/boneData";

const setAnimations = (gltf: GLTF) => {
  const character = gltf.scene;
  const mixer = new THREE.AnimationMixer(character);
  const typingAction = createBoneAction(gltf, mixer, "typing", typingBoneNames);
  const idleActions = ["key1", "key2", "key5", "key6"]
    .map((name) => THREE.AnimationClip.findByName(gltf.animations, name))
    .filter((clip): clip is THREE.AnimationClip => Boolean(clip))
    .map((clip) => {
      const action = mixer.clipAction(clip);
      action.enabled = true;
      action.setEffectiveWeight(0.78);
      action.timeScale = 0.92;
      return action;
    });

  if (typingAction) {
    typingAction.enabled = true;
    typingAction.setEffectiveWeight(0.86);
    typingAction.timeScale = 0.96;
  }

  const torso = ["spine003", "spine004", "spine002"]
    .map((name) => character.getObjectByName(name))
    .find(Boolean);
  const shoulders = ["upper_armL", "upper_armR"]
    .map((name) => character.getObjectByName(name))
    .filter((bone): bone is THREE.Object3D => Boolean(bone));
  const restingHeight = character.position.y;
  const torsoRestRotation = torso?.rotation.x ?? 0;
  const shoulderRestRotations = shoulders.map((shoulder) => shoulder.rotation.z);

  const startIntro = () => {
    const introClip = THREE.AnimationClip.findByName(gltf.animations, "introAnimation");
    const introAction = introClip ? mixer.clipAction(introClip) : null;
    if (introAction) {
      introAction.reset().setLoop(THREE.LoopOnce, 1).play();
      introAction.clampWhenFinished = true;
    }
    window.setTimeout(() => {
      idleActions.forEach((action, index) => action.reset().fadeIn(0.55 + index * 0.05).play());
      typingAction?.reset().fadeIn(0.7).play();
      const blink = THREE.AnimationClip.findByName(gltf.animations, "Blink");
      if (blink) mixer.clipAction(blink).reset().fadeIn(0.35).play();
    }, 1550);
  };

  const update = (delta: number, elapsed: number) => {
    mixer.update(Math.min(delta, 0.05));
    // Movimiento mínimo: respiración y ajuste de hombros sin competir con el scroll.
    character.position.y = restingHeight + Math.sin(elapsed * 1.15) * 0.018;
    if (torso) torso.rotation.x = torsoRestRotation + Math.sin(elapsed * 1.15) * 0.0018;
    shoulders.forEach((shoulder, index) => {
      shoulder.rotation.z = shoulderRestRotations[index] + Math.sin(elapsed * 1.6 + index * Math.PI) * 0.0008;
    });
  };

  const hover = (_: GLTF, hoverDiv: HTMLDivElement) => {
    const eyebrowAction = createBoneAction(gltf, mixer, "browup", eyebrowBoneNames);
    let isHovering = false;
    if (!eyebrowAction || !hoverDiv) return;
    eyebrowAction.setLoop(THREE.LoopOnce, 1);
    eyebrowAction.clampWhenFinished = true;
    eyebrowAction.setEffectiveWeight(1.25);
    const enter = () => {
      if (!isHovering) {
        isHovering = true;
        eyebrowAction.reset().fadeIn(0.25).play();
      }
    };
    const leave = () => {
      isHovering = false;
      eyebrowAction.fadeOut(0.4);
    };
    hoverDiv.addEventListener("mouseenter", enter);
    hoverDiv.addEventListener("mouseleave", leave);
    return () => {
      hoverDiv.removeEventListener("mouseenter", enter);
      hoverDiv.removeEventListener("mouseleave", leave);
    };
  };

  return { startIntro, hover, update };
};

const createBoneAction = (
  gltf: GLTF,
  mixer: THREE.AnimationMixer,
  clip: string,
  boneNames: string[]
) => {
  const animation = THREE.AnimationClip.findByName(gltf.animations, clip);
  if (!animation) return null;
  const tracks = animation.tracks.filter((track) => boneNames.some((bone) => track.name.includes(bone)));
  return mixer.clipAction(new THREE.AnimationClip(`${clip}_filtered`, animation.duration, tracks));
};

export default setAnimations;