import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';

// ⚠️ CSS Import to apply floating animations and layout fixes
import './App.css';

// Import components from components folder
import MusicPlayer from './components/MusicPlayer';
import VenueGuide from './components/VenueGuide';
import PhotoGallery from './components/PhotoGallery';
import AdminDashboard from './components/AdminDashboard';

// Dynamic API Base URL fallback configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'; 

export default function App() {
  // Read personalized guest name and admin view flag from URL query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const customGuestName = queryParams.get('guest');
  const isAdminView = queryParams.get('admin') === 'true';

  const [rsvpStatus, setRsvpStatus] = useState('attending');
  const [plusOnes, setPlusOnes] = useState(0);
  const [dietary, setDietary] = useState('Non-Vegetarian');
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [wishName, setWishName] = useState('');
  const [wishMsg, setWishMsg] = useState('');
  const [wishes, setWishes] = useState([]);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (customGuestName) {
      setGuestName(customGuestName);
    }
  }, [customGuestName]);

  useEffect(() => {
    const eventDate = new Date("2026-11-20T18:00:00");
    const timer = setInterval(() => {
      const diff = eventDate - new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    fetchWishes();
    return () => clearInterval(timer);
  }, []);

  const fetchWishes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishes`);
      if (res.ok) {
        const data = await res.json();
        setWishes(data || []);
      }
    } catch (err) {
      console.error("Error fetching wishes:", err);
    }
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: guestName || 'Honored Guest',
          email: email,
          rsvp_status: rsvpStatus,
          plus_ones: parseInt(plusOnes) || 0,
          dietary_preference: dietary
        })
      });

      if (res.ok) {
        setIsSubmitted(true);
        confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
      } else {
        const errorData = await res.json();
        alert(`Submission failed: ${errorData.detail?.[0]?.msg || 'Invalid data submitted'}`);
      }
    } catch (err) {
      console.error("Network or connection error:", err);
      alert("Cannot reach the backend server. Please make sure FastAPI is running on port 8000.");
    }
  };

  const handleWishSubmit = async (e) => {
    e.preventDefault();
    if (!wishName || !wishMsg) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          guest_name: wishName, 
          message: wishMsg 
        })
      });
      if (res.ok) {
        setWishName('');
        setWishMsg('');
        await fetchWishes();
      } else {
        const errData = await res.json();
        console.error("Wish submission error:", errData);
        alert("Failed to post wish. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting wish:", err);
      alert("Cannot reach the server to submit your wish.");
    }
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Wedding Ceremony")}&dates=20261120T120000Z/20261120T170000Z&details=${encodeURIComponent("Celebrating our special day!")}&location=${encodeURIComponent("Grand Palace Convention Center, Dhaka")}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Grand+Palace+Convention+Center+Dhaka`;

  return (
    <>
      {/* 🧚✨ Fullscreen Floating Fairy Sparkles Overlay */}
      <div className="fairy-container">
        <div className="fairy-sparkle" style={{ top: '10%', left: '10%', fontSize: '20px', animationDuration: '4s' }}>✨</div>
        <div className="fairy-sparkle" style={{ top: '20%', right: '12%', fontSize: '24px', animationDuration: '5s', animationDelay: '1s' }}>🧚✨</div>
        <div className="fairy-sparkle" style={{ top: '38%', left: '8%', fontSize: '18px', animationDuration: '3.5s', animationDelay: '0.5s' }}>⭐</div>
        <div className="fairy-sparkle" style={{ top: '50%', right: '10%', fontSize: '22px', animationDuration: '6s', animationDelay: '2s' }}>💫</div>
        <div className="fairy-sparkle" style={{ top: '68%', left: '12%', fontSize: '20px', animationDuration: '4.5s', animationDelay: '1.5s' }}>🧚✨</div>
        <div className="fairy-sparkle" style={{ top: '82%', right: '15%', fontSize: '18px', animationDuration: '3.8s', animationDelay: '0.8s' }}>✨</div>
        <div className="fairy-sparkle" style={{ top: '92%', left: '18%', fontSize: '22px', animationDuration: '5.2s', animationDelay: '2.5s' }}>🌟</div>
      </div>

      {/* Main App Container */}
      <div style={{ maxWidth: '480px', width: '100%', padding: '20px 16px', margin: '0 auto', position: 'relative' }}>
        
        {/* Floating Background Music Control */}
        <MusicPlayer />

        {/* Header Banner Section */}
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ letterSpacing: '3px', fontSize: '11px', textTransform: 'uppercase', color: '#8c7a6b' }}>
            Please Join Us For The Wedding
          </p>

          {customGuestName && (
            <div style={{ margin: '14px 0 10px 0', padding: '10px 16px', background: '#faf8f5', borderRadius: '12px', border: '1px solid #f0e8df' }}>
              <h3 className="font-serif" style={{ fontSize: '20px', color: '#6b2d39', margin: 0 }}>
                Dear {customGuestName},
              </h3>
              <p style={{ fontSize: '12px', color: '#8c7a6b', margin: '2px 0 0 0' }}>
                You are cordially invited to celebrate with us!
              </p>
            </div>
          )}

          <h1 className="font-serif" style={{ fontSize: '38px', color: '#6b2d39', margin: '12px 0 6px 0', fontWeight: '400' }}>
            Munni & Jungkook
          </h1>
          <p style={{ fontSize: '13px', color: '#8c7a6b', fontStyle: 'italic' }}>
            November 20, 2026 • Grand Palace, Dhaka
          </p>

          {/* Live Countdown Timer */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
            {Object.entries(timeLeft).map(([label, val]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <span className="font-serif" style={{ fontSize: '22px', color: '#6b2d39', fontWeight: 'bold' }}>{val}</span>
                <span style={{ display: 'block', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: '#8c7a6b' }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '24px' }}>
            <a href={googleCalendarUrl} target="_blank" rel="noreferrer" className="btn-outline">
              🗓️ Add to Calendar
            </a>
            <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="btn-outline">
              📍 Directions
            </a>
          </div>
        </div>

        {/* Event Schedule Timeline Section */}
        <div className="card">
          <h2 className="font-serif" style={{ fontSize: '24px', color: '#6b2d39', textAlign: 'center', margin: '0 0 16px 0' }}>
            Event Schedule
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#faf8f5', borderRadius: '8px', borderLeft: '3px solid #6b2d39' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b2d39' }}>6:00 PM</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#4a3b32' }}>Welcome Drinks & Reception</p>
            </div>
            <div style={{ padding: '12px', background: '#faf8f5', borderRadius: '8px', borderLeft: '3px solid #6b2d39' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b2d39' }}>7:30 PM</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#4a3b32' }}>Wedding Ceremony</p>
            </div>
            <div style={{ padding: '12px', background: '#faf8f5', borderRadius: '8px', borderLeft: '3px solid #6b2d39' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b2d39' }}>8:30 PM</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#4a3b32' }}>Dinner & Celebration</p>
            </div>
          </div>
        </div>

        {/* RSVP Section */}
        <div className="card">
          <h2 className="font-serif" style={{ fontSize: '26px', color: '#6b2d39', textAlign: 'center', margin: '0 0 4px 0' }}>
            Kindly Reply
          </h2>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#8c7a6b', marginBottom: '24px' }}>
            Please let us know your plans so we may prepare.
          </p>

          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '24px 16px', background: '#faf8f5', borderRadius: '16px', border: '1px solid #f0e8df' }}>
              <p className="font-serif" style={{ fontSize: '22px', color: '#6b2d39', margin: 0 }}>Thank You!</p>
              <p style={{ fontSize: '12px', color: '#8c7a6b', marginTop: '4px', marginBottom: '20px' }}>
                Your response has been saved successfully.
              </p>

              {/* Clean VIP Pass QR Code */}
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', display: 'inline-block', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid #f0e6dd' }}>
                <QRCodeSVG 
                  value={
`🎟️ VIP PASS - WEDDING INVITATION
=============================
Guest Name : ${guestName || 'Honored Guest'}
Status     : ${rsvpStatus === 'attending' ? 'Attending (Joyfully Accepted)' : 'Declined'}
Plus Ones  : ${plusOnes} Guest(s)
Meal Choice: ${dietary}
=============================
Verified Access Code: WED-2026-${Math.floor(1000 + Math.random() * 9000)}`
                  } 
                  size={160}
                  fgColor="#6b2d39"
                />
              </div>
              <p style={{ fontSize: '11px', color: '#8c7a6b', marginTop: '12px', letterSpacing: '0.5px' }}>
                🎟️ Please present this QR Code pass at the entry venue.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8c7a6b', fontWeight: '600' }}>Full Name</label>
                <input type="text" required value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="e.g. Eleanor Vance" className="input-field" />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8c7a6b', fontWeight: '600' }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="input-field" />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8c7a6b', fontWeight: '600' }}>Attendance</label>
                <div className="radio-group">
                  <div className={`radio-btn ${rsvpStatus === 'attending' ? 'active' : ''}`} onClick={() => setRsvpStatus('attending')}>
                    Accepts with Joy
                  </div>
                  <div className={`radio-btn ${rsvpStatus === 'declined' ? 'active' : ''}`} onClick={() => setRsvpStatus('declined')}>
                    Regretfully Declines
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8c7a6b', fontWeight: '600' }}>Meal Preference</label>
                <select value={dietary} onChange={e => setDietary(e.target.value)} className="input-field">
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Halal">Halal</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8c7a6b', fontWeight: '600' }}>Plus Ones (Guests)</label>
                <input type="number" min="0" max="5" value={plusOnes} onChange={e => setPlusOnes(e.target.value)} className="input-field" />
              </div>

              <button type="submit" className="btn-burgundy">
                Submit Response
              </button>
            </form>
          )}
        </div>

        {/* Embedded Google Maps & Venue Info Section */}
        <VenueGuide />

        {/* Photo Gallery Section */}
        <PhotoGallery />

        {/* Guestbook Section */}
        <div className="card">
          <h2 className="font-serif" style={{ fontSize: '24px', color: '#6b2d39', textAlign: 'center', margin: '0 0 16px 0' }}>
            Warm Wishes
          </h2>

          <form onSubmit={handleWishSubmit} style={{ marginBottom: '20px' }}>
            <input type="text" placeholder="Your Name" value={wishName} onChange={e => setWishName(e.target.value)} className="input-field" style={{ marginBottom: '10px' }} />
            <textarea placeholder="Write your wishes for the couple..." value={wishMsg} onChange={e => setWishMsg(e.target.value)} rows="3" className="input-field" style={{ marginBottom: '10px', resize: 'none' }} />
            <button type="submit" className="btn-burgundy" style={{ padding: '10px', fontSize: '11px' }}>
              Send Message
            </button>
          </form>

          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {wishes.map((w, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid #f0e8df', padding: '10px 0' }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: '#6b2d39' }}>{w.guest_name}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#8c7a6b' }}>{w.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Render Organizer Dashboard when ?admin=true is present in the URL */}
        {isAdminView && <AdminDashboard />}

      </div>
    </>
  );
}