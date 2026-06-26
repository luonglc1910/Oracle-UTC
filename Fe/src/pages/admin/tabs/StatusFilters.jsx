import { STATUS_LIST } from '../constants/statusConfig.jsx'
import { normalizeStatus } from '../utils/statusHelpers.jsx'

export default function StatusFilters ({ orders, filterStatus, onFilter }) {
  return (
    <div
      style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}
    >
      <button
        onClick={() => onFilter('all')}
        style={{
          padding: '6px 14px',
          borderRadius: 20,
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 13,
          background: filterStatus === 'all' ? 'var(--green-mid)' : '#e5e7eb',
          color: filterStatus === 'all' ? 'white' : '#374151'
        }}
      >
        Tất cả ({orders.length})
      </button>

      {STATUS_LIST.map(s => {
        const cnt = orders.filter(
          o => normalizeStatus(o.TRANG_THAI) === s.key
        ).length
        return (
          <button
            key={s.key}
            onClick={() => onFilter(s.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              background: filterStatus === s.key ? s.color : s.bg,
              color: filterStatus === s.key ? 'white' : s.color
            }}
          >
            {s.label} ({cnt})
          </button>
        )
      })}
    </div>
  )
}
