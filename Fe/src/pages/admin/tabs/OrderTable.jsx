import { formatPrice, formatDate } from '../../../utils/helpers'
import { normalizeStatus, statusMeta } from '../utils/statusHelpers.jsx'
import { NEXT_MAP } from '../constants/statusConfig.jsx'

export default function OrderTable ({
  orders,
  selected,
  updating,
  onToggleAll,
  onToggleOne,
  onNext
}) {
  const allIds = orders.map(o => o.MA_DH)
  const isAllChecked =
    allIds.length > 0 && allIds.every(id => selected.includes(id))
  const isIndeterminate = selected.length > 0 && !isAllChecked

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--cream)' }}>
          <tr>
            <th style={{ padding: '12px 14px', width: 40 }}>
              <input
                type='checkbox'
                checked={isAllChecked}
                ref={el => {
                  if (el) el.indeterminate = isIndeterminate
                }}
                onChange={onToggleAll}
                style={{
                  accentColor: 'var(--green-mid)',
                  width: 16,
                  height: 16,
                  cursor: 'pointer'
                }}
              />
            </th>
            {[
              'Mã ĐH',
              'Khách hàng',
              'Tổng tiền',
              'Ngày đặt',
              'Trạng thái',
              'Chuyển sang'
            ].map(h => (
              <th
                key={h}
                style={{
                  padding: '12px 14px',
                  textAlign: 'left',
                  fontSize: 13,
                  color: 'var(--text-mid)',
                  fontWeight: 600
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => {
            const normStatus = normalizeStatus(o.TRANG_THAI)
            const sm = statusMeta(o.TRANG_THAI)
            const nexts = NEXT_MAP[normStatus] || []
            const isUpdating = updating === o.MA_DH
            const isChecked = selected.includes(o.MA_DH)

            return (
              <tr
                key={o.MA_DH}
                style={{
                  borderTop: '1px solid var(--cream-dark)',
                  background: isChecked ? '#f0f9ff' : 'white'
                }}
              >
                <td style={{ padding: '12px 14px' }}>
                  <input
                    type='checkbox'
                    checked={isChecked}
                    onChange={() => onToggleOne(o.MA_DH)}
                    style={{
                      accentColor: 'var(--green-mid)',
                      width: 16,
                      height: 16,
                      cursor: 'pointer'
                    }}
                  />
                </td>
                <td
                  style={{
                    padding: '12px 14px',
                    fontWeight: 700,
                    color: 'var(--green-dark)'
                  }}
                >
                  #{o.MA_DH}
                </td>
                <td style={{ padding: '12px 14px', fontSize: 13 }}>
                  {o.HO_TEN || `KH#${o.MA_KH}`}
                </td>
                <td
                  style={{
                    padding: '12px 14px',
                    fontWeight: 700,
                    color: 'var(--gold)'
                  }}
                >
                  {formatPrice(o.TONG_TIEN)}
                </td>
                <td
                  style={{
                    padding: '12px 14px',
                    fontSize: 12,
                    color: 'var(--text-light)'
                  }}
                >
                  {formatDate(o.NGAY_DAT)}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: sm.bg,
                      color: sm.color
                    }}
                  >
                    {sm.label}
                  </span>
                  {normStatus === 'danh_gia' && (
                    <div
                      style={{ fontSize: 11, color: '#f97316', marginTop: 2 }}
                    >
                      ⏱ Tự hoàn thành sau 30s
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {isUpdating ? (
                    <span style={{ fontSize: 13 }}>⏳</span>
                  ) : (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {nexts.map(nk => {
                        const nm = statusMeta(nk)
                        return (
                          <button
                            key={nk}
                            onClick={() => onNext(o, nk)}
                            style={{
                              padding: '4px 10px',
                              border: `1px solid ${nm.color}`,
                              borderRadius: 8,
                              background: 'white',
                              color: nm.color,
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: 600
                            }}
                          >
                            {nm.label}
                          </button>
                        )
                      })}
                      {nexts.length === 0 && (
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>
                          —
                        </span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
          {orders.length === 0 && (
            <tr>
              <td
                colSpan={7}
                style={{
                  padding: 32,
                  textAlign: 'center',
                  color: 'var(--text-light)'
                }}
              >
                Không có đơn hàng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
