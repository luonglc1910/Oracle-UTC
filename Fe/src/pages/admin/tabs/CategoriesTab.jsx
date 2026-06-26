import { getTeaEmoji } from '../../../utils/helpers'

export default function CategoriesTab({ categories }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))',
        gap: 16,
      }}
    >
      {categories.map(c => (
        <div
          key={c.MA_DANH_MUC}
          style={{
            background: 'white',
            borderRadius: 14,
            padding: 20,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>
            {getTeaEmoji(c.MA_DANH_MUC)}
          </div>
          <div style={{ fontWeight: 700, color: 'var(--green-dark)', marginBottom: 4 }}>
            {c.TEN_DANH_MUC}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-light)' }}>{c.MO_TA}</div>
          <div style={{ marginTop: 8, fontSize: 12 }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 20,
                background: c.TRANG_THAI ? '#f0fdf4' : '#fef2f2',
                color: c.TRANG_THAI ? '#16a34a' : '#dc2626',
                fontWeight: 600,
              }}
            >
              {c.TRANG_THAI ? '✅ Hoạt động' : '⏸ Ẩn'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
