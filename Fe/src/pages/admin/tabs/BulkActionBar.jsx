import { statusMeta } from '../utils/statusHelpers.jsx'

export default function BulkActionBar ({
  selectedCount,
  commonNexts,
  bulkUpdating,
  onBulk,
  onClear
}) {
  if (selectedCount === 0) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: '#eff6ff',
        borderRadius: 12,
        marginBottom: 16,
        flexWrap: 'wrap'
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: '#1d4ed8' }}>
        ☑️ Đã chọn {selectedCount} đơn
      </span>

      {bulkUpdating ? (
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          ⏳ Đang cập nhật...
        </span>
      ) : commonNexts.length > 0 ? (
        <>
          <span style={{ fontSize: 12, color: '#6b7280' }}>
            Chuyển tất cả sang:
          </span>
          {commonNexts.map(nk => {
            const nm = statusMeta(nk)
            return (
              <button
                key={nk}
                onClick={() => onBulk(nk)}
                style={{
                  padding: '6px 14px',
                  border: `1.5px solid ${nm.color}`,
                  borderRadius: 8,
                  background: nm.bg,
                  color: nm.color,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700
                }}
              >
                {nm.label}
              </button>
            )
          })}
        </>
      ) : (
        <span style={{ fontSize: 12, color: '#9ca3af' }}>
          Các đơn đã chọn không có trạng thái kế tiếp chung
        </span>
      )}

      <button
        onClick={onClear}
        style={{
          marginLeft: 'auto',
          fontSize: 12,
          color: '#6b7280',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        ✕ Bỏ chọn
      </button>
    </div>
  )
}
