import { useState, useEffect } from 'react'
import { donHangApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { formatPrice, formatDate } from '../utils/helpers'

const STATUS_LABELS = {
  // Chuẩn mới
  cho_xac_nhan:   'Chờ xác nhận',
  da_xac_nhan:    'Đã xác nhận',
  cho_giao_hang:  'Chờ giao hàng',
  dang_giao_hang: 'Đang giao hàng',
  da_giao_hang:   'Đã giao hàng',
  danh_gia:       'Chờ đánh giá',
  hoan_thanh:     'Hoàn thành',
  huy:            'Đã huỷ',
  // Legacy DB cũ
  da_giao:        'Đã giao hàng',
  dang_giao:      'Đang giao hàng',
  cho_giao:       'Chờ giao hàng',
  dang_xu_ly:     'Đang xử lý',
  da_huy:         'Đã huỷ',
}

// Map legacy → chuẩn mới để lấy CSS class đúng
const STATUS_NORM = {
  da_giao: 'da_giao_hang', dang_giao: 'dang_giao_hang',
  cho_giao: 'cho_giao_hang', dang_xu_ly: 'da_xac_nhan', da_huy: 'huy'
}
function normStatus(raw) {
  const k = (raw || '').toLowerCase()
  return STATUS_NORM[k] || k
}

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [maKh, setMaKh] = useState('')
  const [searched, setSearched] = useState(false)
  const { user } = useCart()

  const fetchOrders = async (id) => {
    setLoading(true)
    try {
      const res = await donHangApi.getByKhachHang(id)
      setOrders(res.data)
    } catch { setOrders([]) }
    finally { setLoading(false); setSearched(true) }
  }

  useEffect(() => {
    if (user?.MA_KH) { setMaKh(user.MA_KH); fetchOrders(user.MA_KH) }
    else setLoading(false)
  }, [user])

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
        {orders.map(o => (
          <div key={o.MA_DH} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-id">Đơn #{o.MA_DH}</span>
                <span style={{ marginLeft:12, fontSize:13, color:'var(--text-light)' }}>{formatDate(o.NGAY_DAT)}</span>
              </div>
              <span className={`order-status status-${normStatus(o.TRANG_THAI)}`}>
                {STATUS_LABELS[(o.TRANG_THAI||'').toLowerCase()] || o.TRANG_THAI}
              </span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
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
          </div>
        ))}
      </div>
    </>
  )
}
