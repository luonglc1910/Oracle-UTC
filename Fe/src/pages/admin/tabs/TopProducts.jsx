import { formatPrice } from '../../../utils/helpers'

const RANK_ICONS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

export default function TopProducts({ topProducts }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <h3 style={{ marginBottom: 16, color: 'var(--green-dark)', fontSize: 16 }}>
        🏆 Top 5 sản phẩm bán chạy
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Hạng', 'Tên sản phẩm', 'Số lượng bán', 'Doanh thu'].map(h => (
              <th
                key={h}
                style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontSize: 13,
                  color: 'var(--text-mid)',
                  fontWeight: 600,
                  borderBottom: '1px solid var(--cream-dark)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topProducts.map((p, i) => (
            <tr key={p.TEN_SP} style={{ borderTop: '1px solid var(--cream-dark)' }}>
              <td style={{ padding: '10px 12px', fontSize: 18 }}>{RANK_ICONS[i]}</td>
              <td style={{ padding: '10px 12px', fontWeight: 600 }}>🍵 {p.TEN_SP}</td>
              <td style={{ padding: '10px 12px', color: 'var(--green-mid)', fontWeight: 700 }}>
                {p.TONG_BAN}
              </td>
              <td style={{ padding: '10px 12px', color: 'var(--gold)', fontWeight: 700 }}>
                {formatPrice(p.DOANH_THU)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
