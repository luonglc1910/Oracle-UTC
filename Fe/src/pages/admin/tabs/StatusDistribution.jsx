import { statusMeta } from '../utils/statusHelpers.jsx'

export default function StatusDistribution ({ byStatus, totalOrders }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}
    >
      <h3
        style={{ marginBottom: 16, color: 'var(--green-dark)', fontSize: 16 }}
      >
        🔄 Phân bổ trạng thái
      </h3>
      {byStatus.map(s => {
        const sm = statusMeta(s.TRANG_THAI)
        const pct =
          totalOrders > 0 ? Math.round((s.SO_LUONG / totalOrders) * 100) : 0
        return (
          <div key={s.TRANG_THAI} style={{ marginBottom: 12 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                marginBottom: 4
              }}
            >
              <span style={{ fontWeight: 600, color: sm.color }}>
                {sm.label}
              </span>
              <span style={{ color: 'var(--text-light)' }}>
                {s.SO_LUONG} đơn ({pct}%)
              </span>
            </div>
            <div style={{ background: '#f3f4f6', borderRadius: 4, height: 8 }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: sm.color,
                  borderRadius: 4,
                  transition: 'width 0.5s'
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
