import { formatPrice } from '../../../utils/helpers'

export default function RevenueChart({ revenueByMonth }) {
  const maxRevenue = Math.max(...revenueByMonth.map(r => r.DOANH_THU || 0), 1)

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <h3 style={{ marginBottom: 20, color: 'var(--green-dark)', fontSize: 16 }}>
        📈 Doanh thu 12 tháng gần nhất
      </h3>

      {revenueByMonth.length === 0 ? (
        <p style={{ color: 'var(--text-light)' }}>Chưa có dữ liệu</p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160 }}>
          {revenueByMonth.map(r => {
            const pct = Math.max(4, ((r.DOANH_THU || 0) / maxRevenue) * 140)
            return (
              <div
                key={r.THANG}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 9, color: 'var(--text-light)', textAlign: 'center' }}>
                  {formatPrice(r.DOANH_THU).replace('₫', '').trim()}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: pct,
                    background: 'linear-gradient(to top,var(--green-mid),var(--green-light))',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s',
                  }}
                  title={`${r.THANG}: ${formatPrice(r.DOANH_THU)}`}
                />
                <div
                  style={{
                    fontSize: 9,
                    color: 'var(--text-light)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.THANG}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
