import Link from 'next/link';

export default function WelcomeEmployeePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', background: '#f9fafb' }}>
      <div style={{ background: 'white', padding: '2.5rem 3rem', borderRadius: '1rem', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: 340, textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Welcome to Employee Page</h1>
        <p style={{ marginBottom: '2rem', color: '#555' }}>You have successfully logged in. Explore your dashboard and available features.</p>
        <Link href="/employee-portal/profile">
          <button style={{ background: '#2563eb', color: 'white', padding: '0.9rem 2.2rem', borderRadius: '8px', fontSize: '1.1rem', border: 'none', cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            View My Profile
          </button>
        </Link>
      </div>
    </div>
  );
}
