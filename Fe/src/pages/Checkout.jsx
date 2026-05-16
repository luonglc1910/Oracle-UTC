import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { khachHangApi, donHangApi, thanhToanApi } from '../services/api'
import { showToast } from '../components/Toast'
import { formatPrice, getTeaEmoji } from '../utils/helpers'

const PAYMENT_OPTS = [
  { id: 'tien_mat', icon: '💵', label: 'Tiền mặt khi nhận hàng', sub: 'COD - Thanh toán khi giao hàng' },
  { id: 'chuyen_khoan', icon: '🏦', label: 'Chuyển khoản ngân hàng', sub: 'VietcomBank, Techcombank...' },
  { id: 'vi_dien_tu', icon: '📱', label: 'Ví điện tử', sub: 'Momo, ZaloPay, VNPay' }
]

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart, clearCart, user } = useCart()
  const { discount, shipping = 30000, finalTotal } = location.state || {}
  const [payment, setPayment] = useState('tien_mat')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    ho_ten: user?.HO_TEN || '', email: user?.EMAIL || '',
    dien_thoai: user?.DIEN_THOAI || '', dia_chi: '', ghi_chu: ''
  })

  const totalPrice = cart.reduce((s, i) => s + i.GIA_BAN * i.qty, 0)
  const shippingFee = shipping ?? (totalPrice > 500000 ? 0 : 30000)
  const discountAmt = discount
    ? discount.PHAN_TRAM_GIAM ? totalPrice * discount.PHAN_TRAM_GIAM / 100 : (discount.SO_TIEN_GIAM || 0)
    : 0
  const total = finalTotal ?? (totalPrice - discountAmt + shippingFee)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return showToast('Giỏ hàng trống!', '❌')
    setLoading(true)
    try {
      // Tạo / lấy khách hàng
      let maKh = user?.MA_KH
      if (!maKh) {
        const khRes = await khachHangApi.create({
          ho_ten: form.ho_ten, email: form.email,
          dien_thoai: form.dien_thoai, dia_chi: form.dia_chi
        })
        // Oracle không trả ID trực tiếp nên lấy danh sách tìm email
        const allKh = await khachHangApi.getAll()
        const found = allKh.data.find(k => k.EMAIL === form.email)
        maKh = found?.MA_KH
      }

      // Tạo đơn hàng
      await donHangApi.create({
        ma_kh: maKh, tong_tien: total,
        phi_van_chuyen: shippingFee, giam_gia: discountAmt,
        dia_chi_giao: form.dia_chi, ghi_chu: form.ghi_chu
      })

      // Lấy đơn hàng vừa tạo (mới nhất của KH)
      const dhRes = await donHangApi.getByKhachHang(maKh)
      const latestDh = dhRes.data[dhRes.data.length - 1]
      const maDh = latestDh?.MA_DH

      if (maDh) {
        // Tạo chi tiết đơn hàng
        for (const item of cart) {
          await donHangApi.createChiTiet({ ma_dh: maDh, ma_sp: item.MA_SP, so_luong: item.qty, don_gia: item.GIA_BAN })
        }
        // Tạo thanh toán
        await thanhToanApi.create({ ma_dh: maDh, phuong_thuc: payment, so_tien: total })
      }

      clearCart()
      showToast('Đặt hàng thành công! 🎉')
      navigate('/dat-hang-thanh-cong', { state: { maDh, total } })
    } catch (err) {
      showToast('Có lỗi xảy ra, vui lòng thử lại', '❌')
      console.error(err)
    } finally { setLoading(false) }
  }

  return (
    <div className="checkout-page">
      <h1 style={{ fontFamily:'Playfair Display,serif', marginBottom:24 }}>💳 Thanh toán</h1>
      <form onSubmit={handleSubmit}>
        <div className="checkout-layout">
          <div>
            <div className="form-card">
              <h3>📋 Thông tin nhận hàng</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input required value={form.ho_ten} onChange={e => setForm(f=>({...f,ho_ten:e.target.value}))} placeholder="Nguyễn Văn A" />
                </div>
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input required value={form.dien_thoai} onChange={e => setForm(f=>({...f,dien_thoai:e.target.value}))} placeholder="0901234567" />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="email@example.com" />
              </div>
              <div className="form-group">
                <label>Địa chỉ giao hàng *</label>
                <input required value={form.dia_chi} onChange={e => setForm(f=>({...f,dia_chi:e.target.value}))} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" />
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <input value={form.ghi_chu} onChange={e => setForm(f=>({...f,ghi_chu:e.target.value}))} placeholder="Ghi chú cho đơn hàng (tuỳ chọn)" />
              </div>
            </div>

            <div className="form-card">
              <h3>💳 Phương thức thanh toán</h3>
              <div className="payment-methods">
                {PAYMENT_OPTS.map(opt => (
                  <div key={opt.id} className={`payment-opt ${payment === opt.id ? 'selected' : ''}`} onClick={() => setPayment(opt.id)}>
                    <input type="radio" readOnly checked={payment === opt.id} style={{ accentColor:'var(--green-mid)' }} />
                    <span className="payment-icon">{opt.icon}</span>
                    <div>
                      <div className="payment-label">{opt.label}</div>
                      <div className="payment-sub">{opt.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <div className="form-card" style={{ position:'sticky', top:80 }}>
              <h3>📦 Đơn hàng của bạn</h3>
              {cart.map(item => (
                <div key={item.MA_SP} style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12, paddingBottom:12, borderBottom:'1px solid var(--cream-dark)' }}>
                  <span style={{ fontSize:24 }}>{getTeaEmoji(item.MA_DANH_MUC)}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{item.TEN_SP}</div>
                    <div style={{ fontSize:12, color:'var(--text-light)' }}>x{item.qty}</div>
                  </div>
                  <div style={{ fontWeight:700, color:'var(--gold)' }}>{formatPrice(item.GIA_BAN * item.qty)}</div>
                </div>
              ))}
              <div className="summary-row"><span>Tạm tính</span><span>{formatPrice(totalPrice)}</span></div>
              <div className="summary-row"><span>Phí ship</span><span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span></div>
              {discountAmt > 0 && <div className="summary-row" style={{color:'var(--green-light)'}}><span>Giảm giá</span><span>-{formatPrice(discountAmt)}</span></div>}
              <div className="summary-row total"><span>Tổng</span><span style={{color:'var(--gold)'}}>{formatPrice(total)}</span></div>
              <button type="submit" className="btn-checkout" disabled={loading}>
                {loading ? '⏳ Đang xử lý...' : '✅ Đặt hàng ngay'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
