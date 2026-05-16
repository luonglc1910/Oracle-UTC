import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { showToast } from '../components/Toast'

export default function Login() {
  const navigate = useNavigate()
  const { loginUser, loginKhach } = useCart()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await userApi.login(form.username, form.password)
      const { type, user } = res.data

      if (type === 'admin' || type === 'staff') {
        loginUser(user)
        showToast(`Chào mừng ${user.USER_NAME}! 👑`)
        navigate('/admin')
      } else {
        loginKhach(user)
        showToast(`Chào mừng ${user.HO_TEN}! 🍵`)
        navigate('/')
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Đăng nhập thất bại', '❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>🔐 Đăng nhập</h1>
        <p>Đăng nhập vào tài khoản của bạn</p>
      </div>

      <div style={{ maxWidth: 420, margin: '56px auto', padding: '0 20px' }}>
        <div className="form-card">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Tài khoản</label>
              <input
                required
                autoFocus
                placeholder="Username hoặc Email"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                required
                type="password"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', fontSize: 16, marginTop: 8 }}
              disabled={loading}
            >
              {loading ? '⏳ Đang kiểm tra...' : '🔐 Đăng nhập'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-light)' }}>
            Chưa có tài khoản?{' '}
            <Link to="/dang-ky" style={{ color: 'var(--green-mid)', fontWeight: 600 }}>Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </>
  )
}
