import React from 'react';

export default function PhotoGallery() {
  return (
    <div className="card" style={{ marginTop: '20px', textAlign: 'center' }}>
      <h2 className="font-serif" style={{ fontSize: '22px', color: '#6b2d39', margin: '0 0 12px 0' }}>
        ✨ Our Memories
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" alt="Couple 1" style={imgStyle} />
        <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80" alt="Couple 2" style={imgStyle} />
      </div>
    </div>
  );
}

const imgStyle = { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px' };