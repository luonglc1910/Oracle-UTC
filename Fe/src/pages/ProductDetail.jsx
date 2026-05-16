import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { sanPhamApi, danhGiaApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { showToast } from '../components/Toast'
import { formatPrice, getTeaEmoji, formatDate } from '../utils/helpers'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ diem_danh_gia: 5, noi_dung: '', ma_kh: '' })
  const { addToCart, user } = useCart()

  useEffect(() => {
    Promise.all([sanPhamApi.getById(id), danhGiaApi.getBySanPham(id)])
      .then(([p, r]) => { setProduct(p.data); setReviews(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    addToCart(product, qty)
    showToast(`Đã thêm ${qty} "${product.TEN_SP}" vào giỏ!`)
  }

  const handleReview = async (e) => {
    e.preventDefault()
    try {
      await danhGiaApi.create({ ...reviewForm, ma_sp: id, ma_kh: reviewForm.ma_kh || (user?.MA_KH) })
      showToast('Đã gửi đánh giá!')
      const r = await danhGiaApi.getBySanPham(id)
      setReviews(r.data)
      setReviewForm({ diem_danh_gia: 5, noi_dung: '', ma_kh: '' })
    } catch { showToast('Có lỗi khi gửi đánh giá', '❌') }
  }

  if (loading) return <div className="loading"><div className="spinner"/></div>
  if (!product) return <div style={{ textAlign:'center', padding:60 }}>Không tìm thấy sản phẩm</div>

  const avgRating = reviews.length ? (reviews.reduce((s,r)=>s+r.DIEM_DANH_GIA,0)/reviews.length).toFixed(1) : null

  return (
    <div className="detail-page">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <Link to="/san-pham">Sản phẩm</Link> / {product.TEN_SP}
      </div>
      <div className="detail-layout">
        <div>
          <div className="detail-img">{getTeaEmoji(product.MA_DANH_MUC)}</div>
        </div>
        <div className="detail-info">
          <div className="detail-cat">{product.TEN_DANH_MUC}</div>
          <h1>{product.TEN_SP}</h1>
          {avgRating && <div style={{ color:'var(--gold)', margin:'8px 0' }}>{'⭐'.repeat(Math.round(avgRating))} {avgRating} ({reviews.length} đánh giá)</div>}
          <div className="detail-price">{formatPrice(product.GIA_BAN)}</div>
          <div className="detail-meta">
            {product.TRONG_LUONG && <div className="meta-item"><div className="meta-val">{product.TRONG_LUONG}g</div><div className="meta-key">Trọng lượng</div></div>}
            <div className="meta-item"><div className="meta-val">{product.TON_KHO || 0}</div><div className="meta-key">Tồn kho</div></div>
            <div className="meta-item"><div className="meta-val">{product.TEN_NCC || '—'}</div><div className="meta-key">Nhà cung cấp</div></div>
          </div>
          {product.MO_TA && <p className="detail-desc">{product.MO_TA}</p>}
          <div className="qty-selector">
            <label>Số lượng:</label>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => Math.min(product.TON_KHO, q+1))}>+</button>
            </div>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <button className="btn-add-lg" disabled={!product.TON_KHO} onClick={handleAdd}>
              🛒 Thêm vào giỏ hàng
            </button>
            <Link to="/gio-hang" style={{ padding:'14px 20px', background:'var(--gold)', color:'var(--green-dark)', borderRadius:10, fontWeight:700, textDecoration:'none', whiteSpace:'nowrap' }}>
              Mua ngay
            </Link>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="reviews-section">
        <h2 style={{ fontFamily:'Playfair Display,serif', marginBottom:24 }}>Đánh giá sản phẩm</h2>
        {reviews.length === 0 && <p style={{ color:'var(--text-light)', marginBottom:24 }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>}
        {reviews.map(r => (
          <div key={r.MA_DG} className="review-card">
            <div className="review-header">
              <div>
                <span className="review-author">{r.HO_TEN || 'Khách hàng'}</span>
                <span className="review-stars" style={{ marginLeft:8 }}>{'⭐'.repeat(r.DIEM_DANH_GIA)}</span>
              </div>
              <span className="review-date">{formatDate(r.NGAY_DANH_GIA)}</span>
            </div>
            <p className="review-text">{r.NOI_DUNG}</p>
          </div>
        ))}

        <div className="review-form" style={{ marginTop:24 }}>
          <h3 style={{ marginBottom:16 }}>Viết đánh giá</h3>
          <form onSubmit={handleReview}>
            <div className="form-group">
              <label>Mã khách hàng</label>
              <input type="number" placeholder="Nhập mã KH của bạn" value={reviewForm.ma_kh}
                onChange={e => setReviewForm(f => ({...f, ma_kh: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label>Điểm đánh giá</label>
              <select value={reviewForm.diem_danh_gia} onChange={e => setReviewForm(f => ({...f, diem_danh_gia: Number(e.target.value)}))}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{'⭐'.repeat(n)} ({n} sao)</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Nội dung</label>
              <textarea rows={3} placeholder="Chia sẻ cảm nhận của bạn..." value={reviewForm.noi_dung}
                onChange={e => setReviewForm(f => ({...f, noi_dung: e.target.value}))} required
                style={{ width:'100%', padding:'10px 14px', border:'1px solid var(--cream-dark)', borderRadius:8, resize:'vertical', fontFamily:'inherit' }} />
            </div>
            <button type="submit" className="btn-primary">Gửi đánh giá</button>
          </form>
        </div>
      </div>
    </div>
  )
}
