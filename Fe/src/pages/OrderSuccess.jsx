import { useLocation, Link } from 'react-router-dom'
import { formatPrice } from '../utils/helpers'

export default function OrderSuccess() {
  const { state } = useLocation()
  return (
    <div className="success-page">
      <div className="success-icon">🎉</div>
      <h2>Đặt hàng thành công!</h2>
      <p style={{ color:'var(--text-light)', marginBottom:16 }}>
        Cảm ơn bạn đã tin tưởng Trà Ô Long. Chúng tôi sẽ xử lý đơn hàng sớm nhất.
      </p>
      {state?.maDh && <p style={{ fontWeight:600, marginBottom:8 }}>Mã đơn hàng: <span style={{ color:'var(--green-mid)' }}>#{state.maDh}</span></p>}
      {state?.total && <p style={{ color:'var(--gold)', fontWeight:700, fontSize:20, marginBottom:24 }}>Tổng: {formatPrice(state.total)}</p>}
      <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
        <Link to="/don-hang" className="btn-primary">Xem đơn hàng</Link>
        <Link to="/san-pham" className="btn-outline" style={{ background:'transparent', border:'2px solid var(--green-mid)', color:'var(--green-mid)' }}>Tiếp tục mua sắm</Link>
      </div>
    </div>
  )
}
