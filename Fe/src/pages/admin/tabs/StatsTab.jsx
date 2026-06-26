import { formatPrice } from '../../../utils/helpers'
import { normalizeStatus } from '../utils/statusHelpers.jsx'
import { REVENUE_STATUSES } from '../constants/statusConfig.jsx'
import RevenueChart from './RevenueChart'
import StatusDistribution from './StatusDistribution'
import TopProducts from './TopProducts'

export default function StatsTab ({ stats }) {
  if (!stats)
    return (
      <div className='loading'>
        <div className='spinner' />
      </div>
    )

  const totalRevenue = (stats.byStatus || [])
    .filter(r => REVENUE_STATUSES.includes(normalizeStatus(r.TRANG_THAI)))
    .reduce((s, r) => s + (r.TONG_TIEN || 0), 0)

  const totalOrders = (stats.byStatus || []).reduce(
    (s, r) => s + (r.SO_LUONG || 0),
    0
  )

  const kpis = [
    {
      icon: '💰',
      label: 'Tổng doanh thu',
      value: formatPrice(totalRevenue),
      color: '#16a34a'
    },
    {
      icon: '📦',
      label: 'Tổng đơn hàng',
      value: totalOrders,
      color: '#3b82f6'
    },
    {
      icon: '✅',
      label: 'Hoàn thành',
      value:
        (stats.byStatus.find(s => s.TRANG_THAI === 'hoan_thanh') || {})
          .SO_LUONG || 0,
      color: '#10b981'
    },
    {
      icon: '❌',
      label: 'Đã huỷ',
      value:
        (stats.byStatus.find(s => s.TRANG_THAI === 'huy') || {}).SO_LUONG || 0,
      color: '#ef4444'
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: 16
        }}
      >
        {kpis.map(k => (
          <div
            key={k.label}
            style={{
              background: 'white',
              borderRadius: 14,
              padding: 20,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              borderLeft: `4px solid ${k.color}`
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: k.color }}>
              {k.value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-light)' }}>
              {k.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <RevenueChart revenueByMonth={stats.revenueByMonth} />
        <StatusDistribution
          byStatus={stats.byStatus}
          totalOrders={totalOrders}
        />
      </div>

      <TopProducts topProducts={stats.topProducts} />
    </div>
  )
}
