import { useState, useEffect } from 'react'
import { donHangApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { formatPrice, formatDate, getTeaEmoji } from '../utils/helpers'

const STATUS_LABELS = {
  cho_xac_nhan:   'Chờ xác nhận',
  da_xac_nhan:    'Đã xác nhận',
  cho_giao_hang:  'Chờ giao hàng',
  dang_giao_hang: 'Đang giao hàng',
  da_giao_hang:   'Đã giao hàng',
  danh_gia:       'Chờ đánh giá',
  hoan_thanh:     'Hoàn thành',
  huy:            'Đã huỷ',
  da_giao: 'Đã giao hàng', dang_giao: 'Đang giao hàng',
  cho_giao: 'Chờ giao hàng', dang_xu_ly: 'Đang xử lý', da_huy: 'Đã huỷ',
}

const STATUS_NORM = {
  da_giao: 'da_giao_hang', dang_giao: 'dang_giao_hang',
  cho_giao: 'cho_giao_hang', dang_xu_ly: 'da_xac_nhan', da_huy: 'huy'
}
function normStatus(raw) {
  const k = (raw || '').toLowerCase()
  return STATUS_NORM[k] || k
}

export default function MyOrders() {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [maKh, setMaKh]           = useState('')
  const [searched, setSearched]   = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [details, setDetails]     = useState({})   // { maDh: [chiTiet...] }
  const [loadingDetail, setLoadingDetail] = useState(null)
  const { user, khachHang } = useCart()
  const currentKh = khachHang

  const fetchOrders = async (id) => {
    setLoading(true)
    try {
      const res = await donHangApi.getByKhachHang(id)
      setOrders(res.data)
    } catch { setOrders([]) }
    finally { setLoading(false); setSearched(true) }
  }

  useEffect(() => {
    const id = currentKh?.MA_KH || user?.MA_KH
    if (id) { setMaKh(id); fetchOrders(id) }
    else setLoading(false)
  }, [currentKh, user])

  const toggleDetail = async (maDh) => {
    if (expandedId === maDh) { setExpandedId(null); return }
    setExpandedId(maDh)
    if (details[maDh]) return   // đã load rồi
    setLoadingDetail(maDh)
    try {
      const res = await donHangApi.getChiTiet(maDh)
      setDetails(d => ({ ...d, [maDh]: res.data }))
    } catch { setDetails(d => ({ ...d, [maDh]: [] })) }
    finally { setLoadingDetail(null) }
  }

  return (
    <>
      <div className="page-header">
        <h1>📦 Đơn hàng của tôi</h1>
        <p>Tra cứu và theo dõi đơn hàng</p>
      </div>
      <div className="orders-page">
        <div style={{ display:'flex', gap:12, marginBottom:28 }}>
          <input type="number" placeholder="Nhập mã khách hàng..."
            value={maKh} onChange={e => setMaKh(e.target.value)}
            style={{ flex:1, maxWidth:280, padding:'10px 14px', border:'1px solid var(--cream-dark)', borderRadius:10, fontSize:14, outline:'none' }} />
          <button className="btn-primary" onClick={() => fetchOrders(maKh)} style={{ padding:'10px 20px' }}>Tra cứu</button>
        </div>

        {loading && <div className="loading"><div className="spinner"/></div>}
        {!loading && searched && orders.length === 0 && (
          <div style={{ textAlign:'center', padding:48, color:'var(--text-light)' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
            <p>Không tìm thấy đơn hàng nào</p>
          </div>
        )}

        {orders.map(o => {
          const isOpen = expandedId === o.MA_DH
          const chiTiet = details[o.MA_DH] || []
          const isLoadingThis = loadingDetail === o.MA_DH
          return (
            <div key={o.MA_DH} className="order-card" style={{ marginBottom: 16, cursor: 'default' }}>
              {/* HEADER — bấm để mở/đóng */}
              <div
                className="order-header"
                onClick={() => toggleDetail(o.MA_DH)}
                style={{ cursor:'pointer', userSelect:'none' }}
              >
                <div>
                  <span className="order-id">Đơn #{o.MA_DH}</span>
                  <span style={{ marginLeft:12, fontSize:13, color:'var(--text-light)' }}>{formatDate(o.NGAY_DAT)}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span className={`order-status status-${normStatus(o.TRANG_THAI)}`}>
                    {STATUS_LABELS[(o.TRANG_THAI||'').toLowerCase()] || o.TRANG_THAI}
                  </span>
                  <span style={{ fontSize:18, color:'var(--text-light)', transition:'transform 0.25s', display:'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </span>
                </div>
              </div>

              {/* SUMMARY ROW */}
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, marginTop:4 }}>
                <div style={{ color:'var(--text-mid)' }}>
                  {o.DIA_CHI_GIAO && <div>📍 {o.DIA_CHI_GIAO}</div>}
                  {o.GHI_CHU && <div>📝 {o.GHI_CHU}</div>}
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ color:'var(--gold)', fontWeight:700, fontSize:18 }}>{formatPrice(o.TONG_TIEN)}</div>
                  {o.PHI_VAN_CHUYEN > 0 && <div style={{ fontSize:12, color:'var(--text-light)' }}>+ ship {formatPrice(o.PHI_VAN_CHUYEN)}</div>}
                  {o.GIAM_GIA > 0 && <div style={{ fontSize:12, color:'var(--green-light)' }}>- giảm {formatPrice(o.GIAM_GIA)}</div>}
                </div>
              </div>

              {/* DETAIL PANEL */}
              {isOpen && (
                <div style={{ marginTop:16, borderTop:'1px solid var(--cream-dark)', paddingTop:16 }}>
                  {isLoadingThis ? (
                    <div style={{ textAlign:'center', padding:16 }}><div className="spinner" style={{ margin:'0 auto' }}/></div>
                  ) : chiTiet.length === 0 ? (
                    <p style={{ color:'var(--text-light)', fontSize:13 }}>Không có sản phẩm</p>
                  ) : (
                    <>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--green-dark)', marginBottom:10 }}>🛒 Sản phẩm đã đặt</div>
                      {chiTiet.map((ct, i) => (
                        <div key={ct.MA_CTDH || i} style={{
                          display:'flex', alignItems:'center', gap:12, padding:'10px 0',
                          borderBottom: i < chiTiet.length-1 ? '1px solid var(--cream-dark)' : 'none'
                        }}>
                          <span style={{ fontSize:28 }}>{getTeaEmoji(ct.MA_DANH_MUC)}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:600, fontSize:14 }}>{ct.TEN_SP || `Sản phẩm #${ct.MA_SP}`}</div>
                            <div style={{ fontSize:12, color:'var(--text-light)' }}>
                              {formatPrice(ct.DON_GIA)} × {ct.SO_LUONG}
                            </div>
                          </div>
                          <div style={{ fontWeight:700, color:'var(--gold)' }}>
                            {formatPrice((ct.TONG_TIEN) || ct.DON_GIA * ct.SO_LUONG)}
                          </div>
                        </div>
                      ))}
                      <div style={{ textAlign:'right', marginTop:12, paddingTop:12, borderTop:'1px solid var(--cream-dark)', display:'flex', justifyContent:'flex-end', gap:24, fontSize:13 }}>
                        <span style={{ color:'var(--text-mid)' }}>Phí ship: <strong>{formatPrice(o.PHI_VAN_CHUYEN || 0)}</strong></span>
                        {o.GIAM_GIA > 0 && <span style={{ color:'var(--green-light)' }}>Giảm: <strong>-{formatPrice(o.GIAM_GIA)}</strong></span>}
                        <span style={{ color:'var(--green-dark)', fontWeight:700, fontSize:15 }}>Tổng: {formatPrice(o.TONG_TIEN)}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}


