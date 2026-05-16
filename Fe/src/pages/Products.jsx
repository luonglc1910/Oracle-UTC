import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { sanPhamApi, danhMucApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { showToast } from '../components/Toast'
import { formatPrice, getTeaEmoji } from '../utils/helpers'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const { addToCart } = useCart()
  const activeDm = searchParams.get('dm') ? Number(searchParams.get('dm')) : null

  useEffect(() => {
    Promise.all([sanPhamApi.getAll(), danhMucApi.getAll()])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
    const matchDm = !activeDm || p.MA_DANH_MUC === activeDm
    const matchSearch = !search || p.TEN_SP.toLowerCase().includes(search.toLowerCase())
    return matchDm && matchSearch
  })

  const handleAdd = (p) => { addToCart(p); showToast(`Đã thêm "${p.TEN_SP}" vào giỏ!`) }

  return (
    <>
      <div className="page-header">
        <h1>🍃 Tất Cả Sản Phẩm</h1>
        <p>Khám phá bộ sưu tập trà ô long cao cấp</p>
      </div>
      <div className="container" style={{ padding: '32px 20px' }}>
        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="text" placeholder="🔍 Tìm kiếm sản phẩm..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:'100%', maxWidth:400, padding:'10px 16px', border:'1px solid var(--cream-dark)', borderRadius:10, fontSize:14, outline:'none', background:'white' }}
          />
        </div>

        {/* Category filters */}
        <div className="filter-bar">
          <button className={`filter-btn ${!activeDm ? 'active' : ''}`} onClick={() => setSearchParams({})}>
            Tất cả
          </button>
          {categories.map(c => (
            <button key={c.MA_DANH_MUC} className={`filter-btn ${activeDm === c.MA_DANH_MUC ? 'active' : ''}`}
              onClick={() => setSearchParams({ dm: c.MA_DANH_MUC })}>
              {getTeaEmoji(c.MA_DANH_MUC)} {c.TEN_DANH_MUC}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 16, color: 'var(--text-light)', fontSize: 14 }}>
          Tìm thấy <strong>{filtered.length}</strong> sản phẩm
        </div>

        {loading ? <div className="loading"><div className="spinner"/></div> : (
          <div className="product-grid">
            {filtered.map(p => (
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
                  <div style={{ display:'flex', gap:8 }}>
                    <Link to={`/san-pham/${p.MA_SP}`} style={{ flex:1, background:'var(--cream)', border:'1px solid var(--cream-dark)', borderRadius:8, padding:'10px', textAlign:'center', textDecoration:'none', color:'var(--green-dark)', fontSize:13, fontWeight:600 }}>
                      Chi tiết
                    </Link>
                    <button className="btn-add" style={{ flex:2 }} disabled={!p.TON_KHO} onClick={() => handleAdd(p)}>
                      🛒 Thêm giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:60, color:'var(--text-light)' }}>
                😔 Không tìm thấy sản phẩm phù hợp
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
