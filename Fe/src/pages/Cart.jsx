import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { khuyenMaiApi } from '../services/api'
import { showToast } from '../components/Toast'
import { formatPrice, getTeaEmoji } from '../utils/helpers'

export default function Cart() {
  const { cart, removeFromCart, updateQty, totalPrice } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(null)

  const applyCoupon = async () => {
    if (!coupon.trim()) return
    try {
      const res = await khuyenMaiApi.apply(coupon.trim())
      const km = res.data
      setDiscount(km)
      showToast(`Áp dụng mã "${km.TEN_KM}" thành công!`)
    } catch {
      showToast('Mã giảm giá không hợp lệ hoặc đã hết hạn', '❌')
    }
  }

  const discountAmt = discount
    ? discount.PHAN_TRAM_GIAM ? totalPrice * discount.PHAN_TRAM_GIAM / 100 : (discount.SO_TIEN_GIAM || 0)
    : 0
  const shipping = totalPrice > 500000 ? 0 : 30000
  const finalTotal = totalPrice - discountAmt + shipping

  if (cart.length === 0) return (
    <div className="cart-page">
      <h1 style={{ marginBottom:24, fontFamily:'Playfair Display,serif' }}>🛒 Giỏ hàng</h1>
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h3 style={{ marginBottom:12 }}>Giỏ hàng trống</h3>
        <p style={{ color:'var(--text-light)', marginBottom:24 }}>Hãy thêm sản phẩm vào giỏ hàng</p>
        <Link to="/san-pham" className="btn-primary">Mua sắm ngay</Link>
      </div>
    </div>
  )

  return (
    <div className="cart-page">
      <h1 style={{ marginBottom:24, fontFamily:'Playfair Display,serif' }}>🛒 Giỏ hàng ({cart.length} sản phẩm)</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.MA_SP} className="cart-item">
              <div className="cart-item-icon">{getTeaEmoji(item.MA_DANH_MUC)}</div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.TEN_SP}</div>
                <div className="cart-item-price">{formatPrice(item.GIA_BAN)}</div>
              </div>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => updateQty(item.MA_SP, item.qty - 1)}>−</button>
                <span className="qty-num">{item.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.MA_SP, item.qty + 1)}>+</button>
              </div>
              <div className="cart-item-total">{formatPrice(item.GIA_BAN * item.qty)}</div>
              <button className="btn-remove" onClick={() => removeFromCart(item.MA_SP)}>🗑️</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Tổng đơn hàng</h3>
          <div className="summary-row"><span>Tạm tính</span><span>{formatPrice(totalPrice)}</span></div>
          <div className="summary-row"><span>Phí vận chuyển</span><span>{shipping === 0 ? '🎁 Miễn phí' : formatPrice(shipping)}</span></div>
          {discount && <div className="summary-row" style={{ color:'var(--green-light)' }}><span>Giảm giá</span><span>-{formatPrice(discountAmt)}</span></div>}
          <div className="summary-row total"><span>Tổng cộng</span><span>{formatPrice(finalTotal)}</span></div>

          <div className="coupon-row">
            <input className="coupon-input" placeholder="Mã giảm giá" value={coupon} onChange={e => setCoupon(e.target.value)} onKeyDown={e => e.key==='Enter' && applyCoupon()} />
            <button className="btn-coupon" onClick={applyCoupon}>Áp dụng</button>
          </div>
          {shipping === 0 && <p className="discount-note">✅ Miễn phí ship cho đơn trên 500.000đ</p>}
          {totalPrice < 500000 && <p style={{ fontSize:12, color:'var(--text-light)', marginBottom:12 }}>
            Mua thêm {formatPrice(500000 - totalPrice)} để được miễn phí ship
          </p>}

          <Link to="/thanh-toan" state={{ discount, shipping, finalTotal }} className="btn-checkout" style={{ display:'block', textAlign:'center', textDecoration:'none' }}>
            Tiến hành thanh toán →
          </Link>
          <Link to="/san-pham" style={{ display:'block', textAlign:'center', marginTop:12, color:'var(--text-light)', fontSize:14 }}>
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  )
}
