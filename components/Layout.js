import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div>
      <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', marginBottom: '2rem' }}>
        <Link href="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link href="/submit" style={{ marginRight: '1rem' }}>Submit Complaint</Link>
        <Link href="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
      </nav>
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}