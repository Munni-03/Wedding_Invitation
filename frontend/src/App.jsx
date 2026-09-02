import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';

// Import Supabase Client
import { supabase } from './supabaseClient';

// ⚠️ CSS Import to apply floating animations and layout fixes
import './App.css';

// Import components from components folder
import MusicPlayer from './components/MusicPlayer';
import VenueGuide from './components/VenueGuide';
import PhotoGallery from './components/PhotoGallery';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const customGuestName = queryParams.get('guest');
  const isAdminView = queryParams.get('admin') === 'true';
  const isPassScanned = queryParams.get('viewPass') === 'true';
  
  const scannedStatus = queryParams.get('status');
  const scannedPlusOnes = queryParams.get('plusOnes');
  const scannedDietary = queryParams.get('dietary');

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

  // Fetch all wishes from Supabase on initial component mount
  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wishes:', error);
    } else if (data) {
      setWishes(data);
    }
  };

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
    return () => clearInterval(timer);
  }, []);

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
  };

  // Insert wish directly into Supabase database
  const handleWishSubmit = async (e) => {
    e.preventDefault();
    if (!wishName || !wishMsg) return;

    const newWish = { guest_name: wishName, message: wishMsg };

    const { data, error } = await supabase
      .from('wishes')
      .insert([newWish])
      .select();

    if (error) {
      console.error('Error submitting wish:', error);
      alert('Could not send wish. Please try again!');
    } else {
      setWishes((prev) => [data[0], ...prev]);
      setWishName('');
      setWishMsg('');
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    }
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Wedding Ceremony")}&dates=20261120T120000Z/20261120T170000Z&details=${encodeURIComponent("Celebrating our special day!")}&location=${encodeURIComponent("Grand Palace Convention Center, Dhaka")}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Grand+Palace+Convention+Center+Dhaka`;

  const liveDomain = 'https://wedding-invitation-seven-psi-48.vercel.app'; 
  const scanPassUrl = `${liveDomain}/?viewPass=true&guest=${encodeURIComponent(guestName || 'Honored Guest')}&status=${encodeURIComponent(rsvpStatus)}&plusOnes=${plusOnes}&dietary=${encodeURIComponent(dietary)}`;

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
            Sarah & Kabir
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

          {isPassScanned ? (
            <div style={{
              background: 'radial-gradient(circle at center, #2b0b14 0%, #120307 100%)',
              borderRadius: '24px',
              padding: '32px 20px',
              border: '1px solid #d4af3755',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 0 15px rgba(212,175,55,0.15)',
              color: '#f8f1e5',
              textAlign: 'center',
              position: 'relative',
              fontFamily: "'Playfair Display', Georgia, serif",
              maxWidth: '380px',
              margin: '0 auto'
            }}>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#f3e5ab', margin: '0 0 2px 0', fontWeight: 'normal', letterSpacing: '1px' }}>
                Munni & Jungkook
              </h1>
              <p style={{ fontSize: '9px', letterSpacing: '3px', color: '#d4af37', textTransform: 'uppercase', margin: '0 0 16px 0', opacity: 0.9 }}>
                FOREVER & ALWAYS
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #d4af37)' }}></div>
                <div style={{ width: '4px', height: '4px', background: '#d4af37', transform: 'rotate(45deg)' }}></div>
                <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to left, transparent, #d4af37)' }}></div>
              </div>

              <p style={{ fontSize: '10px', letterSpacing: '2px', color: '#e0c080', textTransform: 'uppercase', margin: '0 0 2px 0' }}>
                WEDDING INVITATION
              </p>
              <h2 style={{ fontSize: '22px', color: '#fdf6e2', letterSpacing: '3px', margin: '0 0 20px 0', fontWeight: 'bold' }}>
                VIP PASS
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px', opacity: 0.8 }}>👤</span>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#c5a059' }}>Guest Name:</span>
                    <span style={{ fontSize: '16px', color: '#ffffff', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                      {guestName || 'Honored Guest'}
                    </span>
                  </div>
                </div>

                <div style={{ 
                  background: scannedStatus === 'declined' ? 'linear-gradient(90deg, #3f0909 0%, #4b1b1b 100%)' : 'linear-gradient(90deg, #09203f 0%, #1b3a4b 100%)', 
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  border: scannedStatus === 'declined' ? '1px solid #6b1e1e' : '1px solid #1e4d6b'
                }}>
                  <div style={{ background: scannedStatus === 'declined' ? '#bf2020' : '#206bbf', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff' }}>
                    {scannedStatus === 'declined' ? '✕' : '✓'}
                  </div>
                  <span style={{ fontSize: '13px', color: '#d0e8ff', fontWeight: '500' }}>
                    Status: <strong style={{ color: scannedStatus === 'declined' ? '#ff4d4d' : '#4da6ff' }}>
                      {scannedStatus === 'declined' ? 'Declined' : 'Accepted Joyfully'}
                    </strong>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '2px' }}>
                  <span style={{ fontSize: '18px', opacity: 0.8 }}>👥</span>
                  <span style={{ fontSize: '14px', color: '#f0e6d2' }}>
                    Plus Ones: <strong>{scannedPlusOnes !== null ? scannedPlusOnes : plusOnes} Guest(s)</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '2px' }}>
                  <span style={{ fontSize: '18px', opacity: 0.8 }}>🍽️</span>
                  <span style={{ fontSize: '14px', color: '#f0e6d2' }}>
                    Meal Choice: <strong>{scannedDietary || dietary}</strong>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #d4af37)' }}></div>
                <div style={{ width: '4px', height: '4px', background: '#d4af37', transform: 'rotate(45deg)' }}></div>
                <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to left, transparent, #d4af37)' }}></div>
              </div>

              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <p style={{ fontSize: '9px', letterSpacing: '2px', color: '#c5a059', textTransform: 'uppercase', marginBottom: '8px' }}>
                  VERIFIED ACCESS CODE
                </p>
                
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: '1px solid #d4af3788',
                  borderRadius: '20px',
                  padding: '6px 20px',
                  background: 'rgba(212,175,55,0.08)'
                }}>
                  <span style={{ fontSize: '12px', color: '#f3e5ab' }}>🛡️</span>
                  <span style={{ fontSize: '12px', color: '#f3e5ab', letterSpacing: '1.5px', fontWeight: 'bold' }}>
                    WED-2026-9722
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{
                  background: 'linear-gradient(180deg, #581825 0%, #310a12 100%)',
                  border: '1px solid #d4af37',
                  color: '#f3e5ab',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}>
                  VIEW INVITATION
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => window.open('https://www.google.com', '_blank')} style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    color: '#d4af37',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}>
                    🌐 Search Web
                  </button>

                  <button onClick={() => navigator.clipboard.writeText('WED-2026-9722')} style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    color: '#d4af37',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}>
                    📋 Copy Code
                  </button>
                </div>
              </div>
            </div>
          ) : isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                background: '#faf8f5',
                padding: '24px',
                borderRadius: '20px',
                border: '1px solid #f0e8df',
                display: 'inline-block',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
              }}>
                <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#8c7a6b', fontWeight: 'bold', marginBottom: '16px' }}>
                  SCAN QR CODE TO OPEN VIP PASS
                </p>
                
                <div style={{
                  background: '#ffffff',
                  padding: '16px',
                  borderRadius: '16px',
                  display: 'inline-block',
                  border: '1px solid #e2d7cb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                }}>
                  <QRCodeSVG value={scanPassUrl} size={180} fgColor="#2b0b14" />
                </div>

                <p style={{ fontSize: '12px', color: '#6b2d39', marginTop: '16px', fontStyle: 'italic' }}>
                  Scan with phone camera to view your pass interface
                </p>
              </div>
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

        <VenueGuide />

        <PhotoGallery />

        {/* Guestbook Section connected to Supabase */}
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
              <div key={w.id || idx} style={{ borderBottom: '1px solid #f0e8df', padding: '10px 0' }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: '#6b2d39' }}>{w.guest_name}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#8c7a6b' }}>{w.message}</p>
              </div>
            ))}
          </div>
        </div>

        {isAdminView && <AdminDashboard />}

      </div>
    </>
  );
}