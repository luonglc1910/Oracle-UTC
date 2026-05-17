import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sanPhamApi, danhMucApi, khachHangApi, donHangApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { formatPrice, formatDate, getTeaEmoji } from '../utils/helpers'
import { showToast } from '../components/Toast'

const MENU = ['Tổng quan', 'Sản phẩm', 'Khách hàng', 'Danh mục', 'Trạng thái đơn', 'Thống kê']

export default function AdminDashboard() {
  const { user, isAdmin, logoutUser } = useCart()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminTab') || 'Tổng quan')
  const [data, setData] = useState({ products: [], orders: [], customers: [], categories: [] })
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  const refreshOrders = () => donHangApi.getAll().then(r => setData(d => ({...d, orders: r.data})))

  const switchTab = (tab) => { setActiveTab(tab); localStorage.setItem('adminTab', tab) }

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return }
    Promise.all([sanPhamApi.getAll(), donHangApi.getAll(), khachHangApi.getAll(), danhMucApi.getAll()])
      .then(([p, o, c, dm]) => setData({ products: p.data, orders: o.data, customers: c.data, categories: dm.data }))
      .finally(() => setLoading(false))
  }, [isAdmin])

  useEffect(() => {
    if (activeTab === 'Thống kê') {
      donHangApi.getStats().then(r => setStats(r.data)).catch(() => {})
    }
  }, [activeTab])

  if (!isAdmin) return null

  const REVENUE_STATUSES = ['da_giao_hang', 'danh_gia', 'hoan_thanh']
  const revenue = data.orders
    .filter(o => REVENUE_STATUSES.includes(normalizeStatus(o.TRANG_THAI)))
    .reduce((s, o) => s + (o.TONG_TIEN || 0), 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f1' }}>
      {/* SIDEBAR */}
      <aside style={{ width: 240, background: 'var(--green-dark)', color: 'white', padding: '24px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: 'var(--gold-light)', marginBottom: 4 }}>🍵 Admin Panel</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>👑 {user?.USER_NAME}</div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {MENU.map(m => (
            <button key={m} onClick={() => switchTab(m)} style={{
              width: '100%', textAlign: 'left', padding: '11px 16px', border: 'none', borderRadius: 10,
              marginBottom: 4, cursor: 'pointer', fontWeight: 500, fontSize: 14, transition: 'all .2s',
              background: activeTab === m ? 'rgba(201,168,76,0.15)' : 'transparent',
              color: activeTab === m ? 'var(--gold-light)' : 'rgba(255,255,255,0.7)',
              borderLeft: activeTab === m ? '3px solid var(--gold)' : '3px solid transparent'
            }}>
              {{'Tổng quan':'📊','Sản phẩm':'🍵','Khách hàng':'👥','Danh mục':'📂','Trạng thái đơn':'🔄','Thống kê':'📈'}[m]} {m}
            </button>
          ))}
        </nav>
        <div style={{ padding: '0 12px 20px' }}>
          <Link to="/" style={{ display: 'block', padding: '10px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none', marginBottom: 4 }}>← Về trang chủ</Link>
          <button onClick={() => { logoutUser(); navigate('/') }} style={{ width: '100%', padding: '10px 16px', background: 'rgba(231,76,60,0.15)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 8, color: '#ff8080', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1, padding: 28, overflow: 'auto' }}>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 26, marginBottom: 24, color: 'var(--green-dark)' }}>{activeTab}</h1>
        {loading ? <div className="loading"><div className="spinner"/></div> : (
          <>
            {activeTab === 'Tổng quan' && <Overview data={data} revenue={revenue} />}
            {activeTab === 'Sản phẩm' && <ProductsTab products={data.products} categories={data.categories} onRefresh={() => sanPhamApi.getAll().then(r => setData(d => ({...d, products: r.data})))} />}

            {activeTab === 'Khách hàng' && <CustomersTab customers={data.customers} />}
            {activeTab === 'Danh mục' && <CategoriesTab categories={data.categories} />}
            {activeTab === 'Trạng thái đơn' && <StatusTab orders={data.orders} onRefresh={refreshOrders} />}
            {activeTab === 'Thống kê' && <StatsTab stats={stats} />}
          </>
        )}
      </main>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: 'Playfair Display,serif' }}>{value}</div>
      <div style={{ fontSize: 14, color: 'var(--text-light)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function Overview({ data, revenue }) {
  const statusCount = data.orders.reduce((acc, o) => { acc[o.TRANG_THAI] = (acc[o.TRANG_THAI] || 0) + 1; return acc }, {})
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard icon="🍵" label="Sản phẩm" value={data.products.length} color="var(--green-mid)" />
        <StatCard icon="📦" label="Đơn hàng" value={data.orders.length} color="var(--gold)" />
        <StatCard icon="👥" label="Khách hàng" value={data.customers.length} color="#9b59b6" />
        <StatCard icon="💰" label="Doanh thu" value={formatPrice(revenue)} color="#e74c3c" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: 16, color: 'var(--green-dark)' }}>📊 Trạng thái đơn hàng</h3>
          {Object.entries(statusCount).map(([s, n]) => (
            <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--cream-dark)', fontSize: 14 }}>
              <span>{s}</span><strong>{n}</strong>
            </div>
          ))}
        </div>
        <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: 16, color: 'var(--green-dark)' }}>🍵 Sản phẩm tồn kho thấp</h3>
          {data.products.filter(p => p.TON_KHO < 20).slice(0, 5).map(p => (
            <div key={p.MA_SP} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--cream-dark)', fontSize: 14 }}>
              <span>{getTeaEmoji(p.MA_DANH_MUC)} {p.TEN_SP.slice(0, 30)}...</span>
              <strong style={{ color: p.TON_KHO < 5 ? '#e74c3c' : 'var(--gold)' }}>{p.TON_KHO}</strong>
            </div>
          ))}
          {data.products.filter(p => p.TON_KHO < 20).length === 0 && <p style={{ color: 'var(--text-light)' }}>✅ Tất cả đều có đủ hàng</p>}
        </div>
      </div>
    </>
  )
}

function ProductsTab({ products, categories, onRefresh }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ten_sp: '', ma_danh_muc: '', gia_ban: '', gia_nhap: '', trong_luong: '', ton_kho: 0, mo_ta: '' })
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editId) {
        await sanPhamApi.update(editId, form)
        showToast('Cập nhật sản phẩm thành công!')
      } else {
        await sanPhamApi.create(form)
        showToast('Thêm sản phẩm thành công!')
      }
      setShowForm(false); setEditId(null); onRefresh()
    } catch { showToast('Lỗi khi lưu sản phẩm', '❌') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return
    try { await sanPhamApi.delete(id); showToast('Đã xóa!'); onRefresh() }
    catch { showToast('Không thể xóa', '❌') }
  }

  const handleEdit = (p) => {
    setForm({
      ten_sp: p.TEN_SP,
      ma_danh_muc: p.MA_DANH_MUC || '',
      gia_ban: p.GIA_BAN,
      gia_nhap: p.GIA_NHAP || '',
      trong_luong: p.TRONG_LUONG || '',
      ton_kho: p.TON_KHO,
      mo_ta: p.MO_TA || ''
    })
    setEditId(p.MA_SP)
    setShowForm(true)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ color: 'var(--text-light)' }}>{products.length} sản phẩm</span>
        <button onClick={() => {
          setShowForm(!showForm)
          if (showForm) setEditId(null)
          setForm({ ten_sp: '', ma_danh_muc: '', gia_ban: '', gia_nhap: '', trong_luong: '', ton_kho: 0, mo_ta: '' })
        }} className="btn-primary" style={{ padding: '8px 18px' }}>
          {showForm ? '✕ Huỷ' : '+ Thêm sản phẩm'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: 16 }}>{editId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <form onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group"><label>Tên sản phẩm *</label><input required value={form.ten_sp} onChange={e => setForm(f=>({...f,ten_sp:e.target.value}))} /></div>
              <div className="form-group"><label>Danh mục</label>
                <select value={form.ma_danh_muc} onChange={e => setForm(f=>({...f,ma_danh_muc:e.target.value}))}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c.MA_DANH_MUC} value={c.MA_DANH_MUC}>{c.TEN_DANH_MUC}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Giá bán (VNĐ) *</label><input required type="number" value={form.gia_ban} onChange={e => setForm(f=>({...f,gia_ban:e.target.value}))} /></div>
              <div className="form-group"><label>Giá nhập (VNĐ)</label><input type="number" value={form.gia_nhap} onChange={e => setForm(f=>({...f,gia_nhap:e.target.value}))} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Trọng lượng (g)</label><input type="number" value={form.trong_luong} onChange={e => setForm(f=>({...f,trong_luong:e.target.value}))} /></div>
              <div className="form-group"><label>Tồn kho</label><input type="number" value={form.ton_kho} onChange={e => setForm(f=>({...f,ton_kho:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label>Mô tả</label><input value={form.mo_ta} onChange={e => setForm(f=>({...f,mo_ta:e.target.value}))} /></div>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? '⏳ Đang lưu...' : '💾 Lưu sản phẩm'}</button>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--cream)' }}>
            <tr>{['#','Tên sản phẩm','Danh mục','Giá bán','Tồn kho',''].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: 'var(--text-mid)', fontWeight: 600 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.MA_SP} style={{ borderTop: '1px solid var(--cream-dark)' }}>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-light)' }}>{p.MA_SP}</td>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{getTeaEmoji(p.MA_DANH_MUC)} {p.TEN_SP}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--green-mid)' }}>{p.TEN_DANH_MUC}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--gold)' }}>{formatPrice(p.GIA_BAN)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: p.TON_KHO < 10 ? '#fef2f2' : '#f0fdf4', color: p.TON_KHO < 10 ? '#dc2626' : '#16a34a' }}>{p.TON_KHO}</span>
                </td>
                <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(p)} style={{ background: 'none', border: 'none', color: '#f39c12', cursor: 'pointer', fontSize: 16 }} title="Sửa">✏️</button>
                  <button onClick={() => handleDelete(p.MA_SP)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: 16 }} title="Xóa">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function OrdersTab({ orders }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--cream)' }}>
          <tr>{['Mã ĐH', 'Khách hàng', 'Địa chỉ giao', 'Ngày đặt', 'Tổng tiền', 'Trạng thái'].map(h => (
            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: 'var(--text-mid)', fontWeight: 600 }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {orders.map(o => {
            const sm = statusMeta(o.TRANG_THAI)
            return (
              <tr key={o.MA_DH} style={{ borderTop: '1px solid var(--cream-dark)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--green-dark)' }}>#{o.MA_DH}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>{o.HO_TEN || `KH#${o.MA_KH}`}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)' }}>#{o.MA_KH}</div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-mid)', maxWidth: 200 }}>{o.DIA_CHI_GIAO || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-light)' }}>{formatDate(o.NGAY_DAT)}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--gold)' }}>{formatPrice(o.TONG_TIEN)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sm.bg, color: sm.color }}>{sm.label}</span>
                </td>
              </tr>
            )
          })}
          {orders.length === 0 && (
            <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'var(--text-light)' }}>Chưa có đơn hàng nào</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function CustomersTab({ customers }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--cream)' }}>
          <tr>{['Mã KH','Họ tên','Email','Điện thoại','Địa chỉ'].map(h => (
            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: 'var(--text-mid)', fontWeight: 600 }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.MA_KH} style={{ borderTop: '1px solid var(--cream-dark)' }}>
              <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>{c.MA_KH}</td>
              <td style={{ padding: '12px 16px', fontWeight: 600 }}>👤 {c.HO_TEN}</td>
              <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.EMAIL}</td>
              <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.DIEN_THOAI}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-light)' }}>{c.DIA_CHI}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CategoriesTab({ categories }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 16 }}>
      {categories.map(c => (
        <div key={c.MA_DANH_MUC} style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{getTeaEmoji(c.MA_DANH_MUC)}</div>
          <div style={{ fontWeight: 700, color: 'var(--green-dark)', marginBottom: 4 }}>{c.TEN_DANH_MUC}</div>
          <div style={{ fontSize: 13, color: 'var(--text-light)' }}>{c.MO_TA}</div>
          <div style={{ marginTop: 8, fontSize: 12 }}>
            <span style={{ padding: '3px 10px', borderRadius: 20, background: c.TRANG_THAI ? '#f0fdf4' : '#fef2f2', color: c.TRANG_THAI ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
              {c.TRANG_THAI ? '✅ Hoạt động' : '⏸ Ẩn'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// TRẠNG THÁI ĐƠN HÀNG
// ============================================================
const STATUS_LIST = [
  { key: 'cho_xac_nhan',   label: 'Chờ xác nhận',   color: '#f59e0b', bg: '#fef3c7' },
  { key: 'da_xac_nhan',    label: 'Đã xác nhận',     color: '#3b82f6', bg: '#dbeafe' },
  { key: 'cho_giao_hang',  label: 'Chờ giao hàng',   color: '#8b5cf6', bg: '#ede9fe' },
  { key: 'dang_giao_hang', label: 'Đang giao hàng',  color: '#06b6d4', bg: '#cffafe' },
  { key: 'da_giao_hang',   label: 'Đã giao hàng',    color: '#10b981', bg: '#d1fae5' },
  { key: 'danh_gia',       label: 'Chờ đánh giá',    color: '#f97316', bg: '#ffedd5' },
  { key: 'hoan_thanh',     label: 'Hoàn thành',      color: '#16a34a', bg: '#dcfce7' },
  { key: 'huy',            label: 'Đã huỷ',          color: '#dc2626', bg: '#fee2e2' },
]

const NEXT_MAP = {
  'cho_xac_nhan':   ['da_xac_nhan', 'huy'],
  'da_xac_nhan':    ['cho_giao_hang', 'huy'],
  'cho_giao_hang':  ['dang_giao_hang', 'huy'],
  'dang_giao_hang': ['da_giao_hang'],
  'da_giao_hang':   ['danh_gia'],
  'danh_gia':       ['hoan_thanh'],
  'hoan_thanh':     [],
  'huy':            [],
}

function statusMeta(key) {
  const norm = normalizeStatus(key)
  return STATUS_LIST.find(s => s.key === norm) || { key: norm, label: key || '?', color: '#888', bg: '#f3f4f6' }
}

// Map giá trị DB cũ về chuẩn mới
const STATUS_NORMALIZE = {
  'da_giao':       'da_giao_hang',
  'dang_giao':     'dang_giao_hang',
  'cho_giao':      'cho_giao_hang',
  'xac_nhan':      'da_xac_nhan',
  'da_xac_nhan':   'da_xac_nhan',
  'cho_xac_nhan':  'cho_xac_nhan',
  'dang_giao_hang':'dang_giao_hang',
  'da_giao_hang':  'da_giao_hang',
  'cho_giao_hang': 'cho_giao_hang',
  'danh_gia':      'danh_gia',
  'hoan_thanh':    'hoan_thanh',
  'huy':           'huy',
}

function normalizeStatus(raw) {
  if (!raw) return ''
  const lower = raw.toLowerCase()
  return STATUS_NORMALIZE[lower] || lower
}

function StatusTab({ orders, onRefresh }) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [updating, setUpdating]         = useState(null)
  const [selected, setSelected]         = useState([])   // array of MA_DH
  const [bulkUpdating, setBulkUpdating] = useState(false)

  const filtered = filterStatus === 'all'
    ? orders
    : orders.filter(o => normalizeStatus(o.TRANG_THAI) === filterStatus)

  // Reset selection khi đổi filter
  const handleFilter = (s) => { setFilterStatus(s); setSelected([]) }

  // Checkbox logic
  const allIds       = filtered.map(o => o.MA_DH)
  const isAllChecked = allIds.length > 0 && allIds.every(id => selected.includes(id))
  const isIndeterminate = selected.length > 0 && !isAllChecked

  const toggleAll = () => setSelected(isAllChecked ? [] : allIds)
  const toggleOne = (id) => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )

  // Tìm trạng thái kế tiếp chung của các đơn được chọn
  const selectedOrders = filtered.filter(o => selected.includes(o.MA_DH))
  const commonNexts = (() => {
    if (selectedOrders.length === 0) return []
    const nextsPerOrder = selectedOrders.map(o => NEXT_MAP[normalizeStatus(o.TRANG_THAI)] || [])
    return nextsPerOrder[0].filter(nk => nextsPerOrder.every(nexts => nexts.includes(nk)))
  })()

  // Cập nhật đơn đơn lẻ
  const handleNext = async (order, nextStatus) => {
    setUpdating(order.MA_DH)
    try {
      await donHangApi.updateStatus(order.MA_DH, nextStatus)
      showToast(`✅ Đơn #${order.MA_DH} → ${statusMeta(nextStatus).label}`)
      onRefresh()
    } catch (err) {
      showToast(err.response?.data?.message || 'Lỗi cập nhật trạng thái', '❌')
    } finally { setUpdating(null) }
  }

  // Cập nhật hàng loạt
  const handleBulk = async (nextStatus) => {
    if (selected.length === 0) return
    setBulkUpdating(true)
    let ok = 0, fail = 0
    for (const id of selected) {
      try { await donHangApi.updateStatus(id, nextStatus); ok++ }
      catch { fail++ }
    }
    showToast(`✅ Đã cập nhật ${ok} đơn${fail ? ` (${fail} lỗi)` : ''} → ${statusMeta(nextStatus).label}`)
    setSelected([])
    setBulkUpdating(false)
    onRefresh()
  }

  return (
    <>
      {/* Bộ lọc */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button onClick={() => handleFilter('all')} style={{
          padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
          background: filterStatus === 'all' ? 'var(--green-mid)' : '#e5e7eb', color: filterStatus === 'all' ? 'white' : '#374151'
        }}>Tất cả ({orders.length})</button>
        {STATUS_LIST.map(s => {
          const cnt = orders.filter(o => normalizeStatus(o.TRANG_THAI) === s.key).length
          return (
            <button key={s.key} onClick={() => handleFilter(s.key)} style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: filterStatus === s.key ? s.color : s.bg, color: filterStatus === s.key ? 'white' : s.color
            }}>{s.label} ({cnt})</button>
          )
        })}
      </div>

      {/* Toolbar chọn hàng loạt */}
      {selected.length > 0 && (
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#eff6ff', borderRadius:12, marginBottom:16, flexWrap:'wrap' }}>
          <span style={{ fontSize:13, fontWeight:600, color:'#1d4ed8' }}>
            ☑️ Đã chọn {selected.length} đơn
          </span>
          {bulkUpdating ? (
            <span style={{ fontSize:13, color:'#6b7280' }}>⏳ Đang cập nhật...</span>
          ) : commonNexts.length > 0 ? (
            <>
              <span style={{ fontSize:12, color:'#6b7280' }}>Chuyển tất cả sang:</span>
              {commonNexts.map(nk => {
                const nm = statusMeta(nk)
                return (
                  <button key={nk} onClick={() => handleBulk(nk)} style={{
                    padding: '6px 14px', border: `1.5px solid ${nm.color}`, borderRadius: 8,
                    background: nm.bg, color: nm.color, cursor: 'pointer', fontSize: 13, fontWeight: 700
                  }}>{nm.label}</button>
                )
              })}
            </>
          ) : (
            <span style={{ fontSize:12, color:'#9ca3af' }}>Các đơn đã chọn không có trạng thái kế tiếp chung</span>
          )}
          <button onClick={() => setSelected([])} style={{ marginLeft:'auto', fontSize:12, color:'#6b7280', background:'none', border:'none', cursor:'pointer' }}>✕ Bỏ chọn</button>
        </div>
      )}

      {/* Bảng đơn hàng */}
      <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--cream)' }}>
            <tr>
              <th style={{ padding: '12px 14px', width: 40 }}>
                <input type="checkbox" checked={isAllChecked} ref={el => { if(el) el.indeterminate = isIndeterminate }}
                  onChange={toggleAll} style={{ accentColor: 'var(--green-mid)', width:16, height:16, cursor:'pointer' }} />
              </th>
              {['Mã ĐH', 'Khách hàng', 'Tổng tiền', 'Ngày đặt', 'Trạng thái', 'Chuyển sang'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 13, color: 'var(--text-mid)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => {
              const normStatus = normalizeStatus(o.TRANG_THAI)
              const sm = statusMeta(o.TRANG_THAI)
              const nexts = NEXT_MAP[normStatus] || []
              const isUpdating = updating === o.MA_DH
              const isChecked  = selected.includes(o.MA_DH)
              return (
                <tr key={o.MA_DH} style={{ borderTop: '1px solid var(--cream-dark)', background: isChecked ? '#f0f9ff' : 'white' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <input type="checkbox" checked={isChecked} onChange={() => toggleOne(o.MA_DH)}
                      style={{ accentColor: 'var(--green-mid)', width:16, height:16, cursor:'pointer' }} />
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--green-dark)' }}>#{o.MA_DH}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13 }}>{o.HO_TEN || `KH#${o.MA_KH}`}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--gold)' }}>{formatPrice(o.TONG_TIEN)}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-light)' }}>{formatDate(o.NGAY_DAT)}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sm.bg, color: sm.color }}>{sm.label}</span>
                    {normStatus === 'danh_gia' && (
                      <div style={{ fontSize: 11, color: '#f97316', marginTop: 2 }}>⏱ Tự hoàn thành sau 30s</div>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {isUpdating ? <span style={{ fontSize: 13 }}>⏳</span> : (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {nexts.map(nk => {
                          const nm = statusMeta(nk)
                          return (
                            <button key={nk} onClick={() => handleNext(o, nk)} style={{
                              padding: '4px 10px', border: `1px solid ${nm.color}`, borderRadius: 8,
                              background: 'white', color: nm.color, cursor: 'pointer', fontSize: 12, fontWeight: 600
                            }}>{nm.label}</button>
                          )
                        })}
                        {nexts.length === 0 && <span style={{ fontSize: 12, color: '#9ca3af' }}>—</span>}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--text-light)' }}>Không có đơn hàng nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

// ============================================================
// THỐNG KÊ
// ============================================================
function StatsTab({ stats }) {
  if (!stats) return <div className="loading"><div className="spinner"/></div>

  const REVENUE_STATUSES = ['da_giao_hang', 'danh_gia', 'hoan_thanh']
  const totalRevenue = (stats.byStatus || [])
    .filter(r => REVENUE_STATUSES.includes(normalizeStatus(r.TRANG_THAI)))
    .reduce((s, r) => s + (r.TONG_TIEN || 0), 0)
  const totalOrders  = (stats.byStatus || []).reduce((s, r) => s + (r.SO_LUONG || 0), 0)
  const maxRevenue   = Math.max(...(stats.revenueByMonth || []).map(r => r.DOANH_THU || 0), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
        {[
          { icon: '💰', label: 'Tổng doanh thu', value: formatPrice(totalRevenue), color: '#16a34a' },
          { icon: '📦', label: 'Tổng đơn hàng',  value: totalOrders, color: '#3b82f6' },
          { icon: '✅', label: 'Hoàn thành',      value: (stats.byStatus.find(s=>s.TRANG_THAI==='hoan_thanh')||{}).SO_LUONG||0, color: '#10b981' },
          { icon: '❌', label: 'Đã huỷ',          value: (stats.byStatus.find(s=>s.TRANG_THAI==='huy')||{}).SO_LUONG||0, color: '#ef4444' },
        ].map(k => (
          <div key={k.label} style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${k.color}` }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-light)' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Doanh thu theo tháng - bar chart */}
        <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: 20, color: 'var(--green-dark)', fontSize: 16 }}>📈 Doanh thu 12 tháng gần nhất</h3>
          {stats.revenueByMonth.length === 0 ? <p style={{ color: 'var(--text-light)' }}>Chưa có dữ liệu</p> : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160 }}>
              {stats.revenueByMonth.map(r => {
                const pct = Math.max(4, ((r.DOANH_THU || 0) / maxRevenue) * 140)
                return (
                  <div key={r.THANG} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-light)', textAlign: 'center' }}>{formatPrice(r.DOANH_THU).replace('₫','').trim()}</div>
                    <div style={{ width: '100%', height: pct, background: 'linear-gradient(to top,var(--green-mid),var(--green-light))', borderRadius: '4px 4px 0 0', transition: 'height 0.4s' }} title={`${r.THANG}: ${formatPrice(r.DOANH_THU)}`}/>
                    <div style={{ fontSize: 9, color: 'var(--text-light)', textAlign: 'center', whiteSpace: 'nowrap' }}>{r.THANG}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Trạng thái đơn */}
        <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: 16, color: 'var(--green-dark)', fontSize: 16 }}>🔄 Phân bổ trạng thái</h3>
          {stats.byStatus.map(s => {
            const sm = statusMeta(s.TRANG_THAI)
            const pct = totalOrders > 0 ? Math.round((s.SO_LUONG / totalOrders) * 100) : 0
            return (
              <div key={s.TRANG_THAI} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: sm.color }}>{sm.label}</span>
                  <span style={{ color: 'var(--text-light)' }}>{s.SO_LUONG} đơn ({pct}%)</span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 4, height: 8 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: sm.color, borderRadius: 4, transition: 'width 0.5s' }}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top sản phẩm */}
      <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginBottom: 16, color: 'var(--green-dark)', fontSize: 16 }}>🏆 Top 5 sản phẩm bán chạy</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Hạng','Tên sản phẩm','Số lượng bán','Doanh thu'].map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 13, color: 'var(--text-mid)', fontWeight: 600, borderBottom: '1px solid var(--cream-dark)' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {stats.topProducts.map((p, i) => (
              <tr key={p.TEN_SP} style={{ borderTop: '1px solid var(--cream-dark)' }}>
                <td style={{ padding: '10px 12px', fontSize: 18 }}>{['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>🍵 {p.TEN_SP}</td>
                <td style={{ padding: '10px 12px', color: 'var(--green-mid)', fontWeight: 700 }}>{p.TONG_BAN}</td>
                <td style={{ padding: '10px 12px', color: 'var(--gold)', fontWeight: 700 }}>{formatPrice(p.DOANH_THU)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
