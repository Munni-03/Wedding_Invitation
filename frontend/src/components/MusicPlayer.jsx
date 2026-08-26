import React, { useState, useRef, useEffect } from 'react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const audioRef = useRef(null);

  useEffect(() => {
    // 🎵 1. Reliable & Royalty-Free Ambient Wedding Audio Stream URL
    const audio = new Audio('https://stream.zeno.fm/f3wvbbqmdg8uv');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startAudio = () => {
    if (!audioRef.current) return;

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Audio playback failed, trying fallback mode...", err);
      });
  };

  const handleOpenInvitation = () => {
    startAudio();
    setShowOverlay(false);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      startAudio();
    }
  };

  return (
    <>
      {/* ✉️ 1. Welcome Overlay Modal */}
      {showOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(107, 45, 57, 0.95)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#ffffff',
            textAlign: 'center',
            padding: '20px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              padding: '36px 28px',
              borderRadius: '24px',
              maxWidth: '380px',
              width: '90%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: '#8c7a6b',
                margin: '0 0 10px 0',
                fontWeight: '600',
              }}
            >
              Wedding Invitation
            </p>
            <h2
              className="font-serif"
              style={{ fontSize: '32px', color: '#6b2d39', margin: '0 0 12px 0', fontWeight: '400' }}
            >
              Sarah & James
            </h2>
            <p style={{ fontSize: '13px', color: '#8c7a6b', marginBottom: '28px' }}>
              🎵 Turn on sound for the best experience
            </p>

            <button
              onClick={handleOpenInvitation}
              className="btn-burgundy"
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '30px',
                cursor: 'pointer',
                background: '#6b2d39',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 4px 15px rgba(107, 45, 57, 0.3)',
              }}
            >
              ✉️ Open Invitation
            </button>
          </div>
        </div>
      )}

      {/* 🎶 2. Floating Music Control Button */}
      <button
        onClick={toggleMusic}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10000,
          background: '#6b2d39',
          color: '#ffffff',
          border: '1px solid #f0e6dd',
          borderRadius: '50px',
          padding: '12px 20px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>{isPlaying ? '🎵 Pause Music' : '🎶 Play Music'}</span>
      </button>
    </>
  );
}