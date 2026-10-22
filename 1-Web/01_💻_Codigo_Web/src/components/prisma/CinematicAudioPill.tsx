import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Radio } from "lucide-react";
import sounds from "./soundEffects";

export const CinematicAudioPill: React.FC = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  useEffect(() => {
    sounds.setMuted(!isAudioEnabled);
  }, [isAudioEnabled]);

  const toggleSound = () => {
    const nextState = !isAudioEnabled;
    setIsAudioEnabled(nextState);
    sounds.setMuted(!nextState);
    if (!nextState && isAmbientPlaying) {
      sounds.toggleAmbientSoundscape();
      setIsAmbientPlaying(false);
    } else if (nextState) {
      sounds.playClick();
    }
  };

  const toggleAmbient = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAudioEnabled) {
      setIsAudioEnabled(true);
      sounds.setMuted(false);
    }
    const playing = sounds.toggleAmbientSoundscape();
    setIsAmbientPlaying(playing);
    sounds.playClick();
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 select-none">
      {/* Main Sound FX Toggle */}
      <button
        onClick={toggleSound}
        className={`px-3.5 py-2 rounded-full border backdrop-blur-md transition-all duration-300 flex items-center gap-2 text-xs font-mono shadow-2xl cursor-pointer ${
          isAudioEnabled
            ? "bg-[#DEDBC8] text-black border-[#DEDBC8] font-semibold"
            : "bg-black/80 hover:bg-black/95 text-gray-400 hover:text-white border-white/10"
        }`}
        title={isAudioEnabled ? "Silenciar efectos de sonido" : "Activar efectos de sonido cinemáticos"}
      >
        {isAudioEnabled ? (
          <>
            <Volume2 className="w-3.5 h-3.5" />
            <span>SFX: ON</span>
            {/* Animated Equalizer Bars */}
            <span className="flex items-end gap-0.5 h-3 ml-1">
              <span className="w-0.5 bg-black rounded-full h-2 animate-pulse" />
              <span className="w-0.5 bg-black rounded-full h-3 animate-ping" />
              <span className="w-0.5 bg-black rounded-full h-1.5 animate-pulse" />
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span>SFX: OFF</span>
          </>
        )}
      </button>

      {/* Ambient Soundscape Toggle */}
      {isAudioEnabled && (
        <button
          onClick={toggleAmbient}
          className={`px-3 py-2 rounded-full border backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 text-xs font-mono shadow-2xl cursor-pointer animate-fadeIn ${
            isAmbientPlaying
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              : "bg-black/70 hover:bg-black text-gray-400 hover:text-gray-200 border-white/10"
          }`}
          title="Música ambiental analógica a 432Hz"
        >
          <Radio className={`w-3.5 h-3.5 ${isAmbientPlaying ? "animate-spin text-emerald-400" : ""}`} />
          <span>{isAmbientPlaying ? "Atmósfera 432Hz: ON" : "Atmósfera: OFF"}</span>
        </button>
      )}
    </div>
  );
};

export default CinematicAudioPill;
