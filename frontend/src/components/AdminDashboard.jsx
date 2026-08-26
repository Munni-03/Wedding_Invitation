import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8001/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  const handleDownloadCSV = () => {
    window.location.href = 'http://127.0.0.1:8001/api/admin/export-csv';
  };

  if (!stats) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading Dashboard...</div>;

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', marginTop: '20px', border: '1px solid #f0e6dd' }}>
      <h3 style={{ color: '#6b2d39', textAlign: 'center', marginTop: 0 }}>📊 Organizer Dashboard</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div style={statBoxStyle}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b2d39' }}>{stats.total_expected_guests}</span>
          <span style={statLabelStyle}>Total Expected Guests</span>
        </div>
        <div style={statBoxStyle}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32' }}>{stats.attending_count}</span>
          <span style={statLabelStyle}>Confirmed RSVPs</span>
        </div>
      </div>

      <div style={{ background: '#faf8f5', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6b2d39' }}>🍲 Catering Breakup:</h4>
        <p style={dietaryTextStyle}>Halal: <b>{stats.dietary_stats.Halal}</b></p>
        <p style={dietaryTextStyle}>Non-Veg: <b>{stats.dietary_stats['Non-Vegetarian']}</b></p>
        <p style={dietaryTextStyle}>Veg: <b>{stats.dietary_stats.Vegetarian}</b></p>
      </div>

      <button onClick={handleDownloadCSV} className="btn-burgundy" style={{ width: '100%', padding: '10px' }}>
        📥 Export Guest List (CSV)
      </button>
    </div>
  );
}

const statBoxStyle = { background: '#faf8f5', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid #f0e8df' };
const statLabelStyle = { display: 'block', fontSize: '10px', color: '#8c7a6b', textTransform: 'uppercase', marginTop: '4px' };
const dietaryTextStyle = { margin: '4px 0', fontSize: '12px', color: '#4a3b32' };