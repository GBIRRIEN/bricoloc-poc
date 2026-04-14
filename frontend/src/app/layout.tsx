export const metadata = {
  title: 'BricoLoc - Gestion des Stocks'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f5f5f5' }}>
        <header style={{
          background: '#1a237e', color: 'white', padding: '1rem 2rem',
          display: 'flex', alignItems: 'center', gap: '1rem'
        }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🔧 BricoLoc</span>
        </header>
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  )
}