import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { khachHangApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { showToast } from '../components/Toast'

export default function Register() {
  const navigate = useNavigate()
  const { loginKhach } = useCart()
  const [form, setForm] = useState({ ho_ten:'', email:'', dien_thoai:'', dia_chi:'', mat_khau:'' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await khachHangApi.create(form)
      const all = await khachHangApi.getAll()
      const found = all.data.find(k => k.EMAIL === form.email)
      if (found) { loginKhach(found); showToast(`Chào mừng ${found.HO_TEN}! 🎉`); navigate('/') }
    } catch {
      showToast('Email đã tồn tại hoặc có lỗi', '❌')
    } finally { setLoading(false) }
  }

  return (
    <>
      <div className="page-header"><h1>👤 Đăng ký tài khoản</h1><p>Tham gia cộng đồng trà ô long</p></div>
      <div style={{ maxWidth:480, margin:'48px auto', padding:'0 20px' }}>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên *</label>
              <input required placeholder="Nguyễn Văn A" value={form.ho_ten} onChange={e=>setForm(f=>({...f,ho_ten:e.target.value}))} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input required type="email" placeholder="email@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input placeholder="0901234567" value={form.dien_thoai} onChange={e=>setForm(f=>({...f,dien_thoai:e.target.value}))} />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input placeholder="Địa chỉ của bạn" value={form.dia_chi} onChange={e=>setForm(f=>({...f,dia_chi:e.target.value}))} />
            </div>
            <div className="form-group">
              <label>Mật khẩu *</label>
              <input required type="password" placeholder="Nhập mật khẩu" value={form.mat_khau} onChange={e=>setForm(f=>({...f,mat_khau:e.target.value}))} />
            </div>
            <button type="submit" className="btn-primary" style={{ width:'100%', fontSize:16, marginTop: 8 }} disabled={loading}>
              {loading ? '⏳ Đang xử lý...' : '🍵 Đăng ký ngay'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-light)' }}>
            Đã có tài khoản?{' '}
            <Link to="/dang-nhap" style={{ color: 'var(--green-mid)', fontWeight: 600 }}>Đăng nhập ngay</Link>
          </div>
        </div>
      </div>
    </>
  )
}
