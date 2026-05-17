import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { sanPhamApi, danhMucApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { showToast } from '../components/Toast'
import { formatPrice, getTeaEmoji } from '../utils/helpers'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    Promise.all([sanPhamApi.getAll(), danhMucApi.getAll()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data.slice(0, 8))
        setCategories(cRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = (p) => {
    addToCart(p)
    showToast(`Đã thêm "${p.TEN_SP}" vào giỏ!`)
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-tag">✨ Trà Ô Long Chính Gốc</div>
        <h1>Tinh Hoa Trà Việt<br /><span>Từ Vùng Núi Thái Nguyên</span></h1>
        <p>Thưởng thức hương vị trà ô long nguyên chất, được thu hoạch và chế biến theo phương pháp truyền thống.</p>
        <div className="hero-actions">
          <Link to="/san-pham" className="btn-primary">🍃 Khám phá sản phẩm</Link>
          <Link to="/san-pham" className="btn-outline">Xem tất cả</Link>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stats-inner">
          {[['500+', 'Sản phẩm'],['10K+', 'Khách hàng'],['15+', 'Năm kinh nghiệm'],['100%', 'Nguyên chất']].map(([n,l]) => (
            <div key={l} className="stat-item">
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Danh mục</span>
            <h2>Khám Phá Bộ Sưu Tập</h2>
            <p>Từ trà cao cấp đến phụ kiện pha trà</p>
          </div>
          {loading ? <div className="loading"><div className="spinner"/></div> : (
            <div className="cat-grid">
              {categories.map(c => (
                <Link key={c.MA_DANH_MUC} to={`/san-pham?dm=${c.MA_DANH_MUC}`} className="cat-card">
                  <div className="cat-icon">{getTeaEmoji(c.MA_DANH_MUC)}</div>
                  <div className="cat-name">{c.TEN_DANH_MUC}</div>
                  <div className="cat-desc">{c.MO_TA}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section" style={{ background: 'var(--cream-dark)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Nổi bật</span>
            <h2>Sản Phẩm Bán Chạy</h2>
            <p>Những lựa chọn được khách hàng yêu thích nhất</p>
          </div>
          {loading ? <div className="loading"><div className="spinner"/></div> : (
            <>
              <div className="product-grid">
                {products.map(p => (
                  <div key={p.MA_SP} className="product-card">
                    <div className="product-wrap">
                      <div className="product-img">{getTeaEmoji(p.MA_DANH_MUC)}</div>
                      {p.TON_KHO > 0 && <span className="product-badge">Còn hàng</span>}
                    </div>
                    <div className="product-body">
                      <div className="product-cat">{p.TEN_DANH_MUC}</div>
                      <div className="product-name">{p.TEN_SP}</div>
                      {p.TRONG_LUONG && <div className="product-weight">⚖️ {p.TRONG_LUONG}g</div>}
                      <div className="product-price-row">
                        <span className="product-price">{formatPrice(p.GIA_BAN)}</span>
                        <span className={`product-stock ${p.TON_KHO > 0 ? 'in-stock' : 'out-stock'}`}>
                          {p.TON_KHO > 0 ? `Còn ${p.TON_KHO}` : 'Hết hàng'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/san-pham/${p.MA_SP}`} style={{ flex:1, background:'var(--cream)', border:'1px solid var(--cream-dark)', borderRadius:8, padding:'10px', textAlign:'center', textDecoration:'none', color:'var(--green-dark)', fontSize:13, fontWeight:600, transition:'all .2s' }}>
                          Chi tiết
                        </Link>
                        <button className="btn-add" style={{ flex:2 }} disabled={!p.TON_KHO} onClick={() => handleAdd(p)}>
                          🛒 Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign:'center', marginTop: 36 }}>
                <Link to="/san-pham" className="btn-primary">Xem tất cả sản phẩm →</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Cam kết</span>
            <h2>Tại Sao Chọn Chúng Tôi?</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:24 }}>
            {[['🌿','Nguyên Chất 100%','Trà được thu hái từ những vườn chè sạch, không hóa chất'],
              ['🚚','Giao Hàng Nhanh','Giao trong 24h tại TP.Hà Nội, 2-3 ngày toàn quốc'],
              ['✨','Chất Lượng Cao','Được kiểm định chất lượng theo tiêu chuẩn quốc tế'],
              ['🔄','Đổi Trả Dễ Dàng','30 ngày đổi trả nếu không hài lòng']
            ].map(([icon,title,desc]) => (
              <div key={title} style={{ background:'rgba(255,255,255,0.05)', borderRadius:12, padding:24, textAlign:'center', border:'1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize:36, marginBottom:12 }}>{icon}</div>
                <div style={{ color:'var(--gold-light)', fontWeight:700, marginBottom:8 }}>{title}</div>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:14, lineHeight:1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
