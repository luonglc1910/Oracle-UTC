import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { showToast } from './Toast'

export default function Navbar() {
  const { totalItems, user, logoutUser, khachHang, logoutKhach, isAdmin, currentName } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (user) logoutUser()
    if (khachHang) logoutKhach()
    showToast('Đã đăng xuất!')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="logo-icon">🍵</span>
          <div>
            <div className="brand-text">Trà Ô Long</div>
            <span className="brand-sub">Tinh hoa trà Việt</span>
          </div>
        </Link>

        <div className="nav-links">
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/san-pham">Sản phẩm</NavLink>
          {(khachHang || user) && <NavLink to="/don-hang">Đơn hàng</NavLink>}
          {isAdmin && <NavLink to="/admin" style={{ color: 'var(--gold-light)', fontWeight: 700 }}>👑 Admin</NavLink>}
        </div>

        <div className="nav-actions">
          {currentName ? (
            <>
              <span className="btn-user" style={{ cursor: 'default' }}>
                {isAdmin ? '👑' : '👤'} {currentName}
              </span>
              <button className="btn-user" onClick={handleLogout}>Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-user">🔐 Đăng nhập</Link>
              <Link to="/dang-ky" className="btn-user">Đăng ký</Link>
            </>
          )}
          <Link to="/gio-hang" className="btn-cart">
            🛒
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </nav>
  )
}
