import StatCard from '../components/StatCard'
import { formatPrice } from '../../../utils/helpers'
import { getTeaEmoji } from '../../../utils/helpers'

export default function Overview({ data, revenue }) {
  const statusCount = data.orders.reduce((acc, o) => {
    acc[o.TRANG_THAI] = (acc[o.TRANG_THAI] || 0) + 1
    return acc
  }, {})

  return (
    <>
      {/* KPI cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
          gap: 20,
          marginBottom: 32,
        }}
      >
        <StatCard icon='🍵' label='Sản phẩm'   value={data.products.length}  color='var(--green-mid)' />
        <StatCard icon='📦' label='Đơn hàng'   value={data.orders.length}    color='var(--gold)'      />
        <StatCard icon='👥' label='Khách hàng' value={data.customers.length} color='#9b59b6'          />
        <StatCard icon='💰' label='Doanh thu'  value={formatPrice(revenue)}  color='#e74c3c'          />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Trạng thái đơn hàng */}
        <div
          style={{
            background: 'white',
            borderRadius: 14,
            padding: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <h3 style={{ marginBottom: 16, color: 'var(--green-dark)' }}>
            📊 Trạng thái đơn hàng
          </h3>
          {Object.entries(statusCount).map(([s, n]) => (
            <div
              key={s}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--cream-dark)',
                fontSize: 14,
              }}
            >
              <span>{s}</span>
              <strong>{n}</strong>
            </div>
          ))}
        </div>

        {/* Tồn kho thấp */}
        <div
          style={{
            background: 'white',
            borderRadius: 14,
            padding: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <h3 style={{ marginBottom: 16, color: 'var(--green-dark)' }}>
            🍵 Sản phẩm tồn kho thấp
          </h3>
          {data.products
            .filter(p => p.SO_LUONG < 20)
            .slice(0, 5)
            .map(p => (
              <div
                key={p.MA_SP}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--cream-dark)',
                  fontSize: 14,
                }}
              >
                <span>
                  {getTeaEmoji(p.MA_DANH_MUC)} {p.TEN_SP.slice(0, 30)}...
                </span>
                <strong style={{ color: p.SO_LUONG < 5 ? '#e74c3c' : 'var(--gold)' }}>
                  {p.SO_LUONG}
                </strong>
              </div>
            ))}
          {data.products.filter(p => p.SO_LUONG < 20).length === 0 && (
            <p style={{ color: 'var(--text-light)' }}>✅ Tất cả đều có đủ hàng</p>
          )}
        </div>
      </div>
    </>
  )
}
