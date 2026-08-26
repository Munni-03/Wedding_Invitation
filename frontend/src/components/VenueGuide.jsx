import React from 'react';

export default function VenueGuide() {
  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h2 className="font-serif" style={{ fontSize: '22px', color: '#6b2d39', textAlign: 'center', margin: '0 0 12px 0' }}>
        📍 Venue & Guide
      </h2>
      
      {/* Embedded Google Map */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', height: '180px', marginBottom: '14px' }}>
        <iframe
          title="Venue Map"
          src="https://maps.google.com/maps?q=Grand%20Palace%20Convention%20Center%20Dhaka&t=&z=13&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>

      <div style={{ fontSize: '12px', color: '#4a3b32', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div><b>👔 Dress Code:</b> Traditional / Formal (Burgundy & Gold)</div>
        <div><b>🅿️ Parking:</b> Valet parking is available at Gate 2.</div>
      </div>
    </div>
  );
}