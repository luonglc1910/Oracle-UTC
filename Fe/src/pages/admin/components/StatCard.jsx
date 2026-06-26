export default function StatCard({ icon, label, value, color }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color,
          fontFamily: 'Playfair Display,serif',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-light)', marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}
