import { formatPrice } from '../../utils/helpers'
import { getTeaEmoji } from '../../utils/helpers'

export default function ProductTable({ products, onEdit, onDelete }) {
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
            {['#', 'Ảnh', 'Tên sản phẩm', 'Danh mục', 'Giá bán', 'Tồn kho', ''].map(h => (
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
          {products.map(p => (
            <tr key={p.MA_SP} style={{ borderTop: '1px solid var(--cream-dark)' }}>
              <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-light)' }}>
                {p.MA_SP}
              </td>
              <td style={{ padding: '8px 16px' }}>
                {p.HINH_ANH ? (
                  <img
                    src={p.HINH_ANH}
                    alt={p.TEN_SP}
                    style={{
                      width: 44,
                      height: 44,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: 'var(--cream)',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                    }}
                  >
                    🍃
                  </div>
                )}
              </td>
              <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                {getTeaEmoji(p.MA_DANH_MUC)} {p.TEN_SP}
              </td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--green-mid)' }}>
                {p.TEN_DANH_MUC}
              </td>
              <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--gold)' }}>
                {formatPrice(p.GIA_BAN)}
              </td>
              <td style={{ padding: '12px 16px' }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: p.SO_LUONG < 10 ? '#fef2f2' : '#f0fdf4',
                    color: p.SO_LUONG < 10 ? '#dc2626' : '#16a34a',
                  }}
                >
                  {p.SO_LUONG}
                </span>
              </td>
              <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onEdit(p)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
                  title='Sửa'
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(p.MA_SP)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
                  title='Xóa'
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
