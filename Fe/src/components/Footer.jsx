import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{ fontSize: 22, fontFamily: 'Playfair Display, serif', color: '#e8c97a' }}>🍵 Trà Ô Long</div>
          <p>Thương hiệu trà cao cấp từ thiên nhiên Việt Nam. Chúng tôi mang đến những sản phẩm trà chất lượng nhất từ các vùng trà nổi tiếng.</p>
        </div>
        <div>
          <h4>Danh mục</h4>
          <ul>
            <li><Link to="/san-pham">Tất cả sản phẩm</Link></li>
            <li><Link to="/san-pham?dm=1">Trà Cao Cấp</Link></li>
            <li><Link to="/san-pham?dm=2">Trà Tươi</Link></li>
            <li><Link to="/san-pham?dm=3">Trà Đóng Gói</Link></li>
          </ul>
        </div>
        <div>
          <h4>Hỗ trợ</h4>
          <ul>
            <li><Link to="/don-hang">Tra cứu đơn hàng</Link></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Trà Ô Long. Tinh hoa trà Việt Nam.</div>
    </footer>
  )
}
