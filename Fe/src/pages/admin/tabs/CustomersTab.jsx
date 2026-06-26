export default function CustomersTab({ customers }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--cream)' }}>
          <tr>
            {['Mã KH', 'Họ tên', 'Email', 'Điện thoại', 'Địa chỉ'].map(h => (
              <th
                key={h}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: 13,
                  color: 'var(--text-mid)',
                  fontWeight: 600,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.MA_KH} style={{ borderTop: '1px solid var(--cream-dark)' }}>
              <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>{c.MA_KH}</td>
              <td style={{ padding: '12px 16px', fontWeight: 600 }}>👤 {c.HO_TEN}</td>
              <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.EMAIL}</td>
              <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.DIEN_THOAI}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-light)' }}>
                {c.DIA_CHI}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
