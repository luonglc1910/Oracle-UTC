const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require('./db/oracle')
const path = require('path')

const khachHangRoutes = require('./routes/khachHangRoutes')
const nhaCungCapRoutes = require('./routes/nhaCungCapRoutes')
const danhMucRoutes = require('./routes/danhMucRoutes')
const sanPhamRoutes = require('./routes/sanPhamRoutes')
const khuyenMaiRoutes = require('./routes/khuyenMaiRoutes')
const danhGiaRoutes = require('./routes/danhGiaRoutes')
const nhanVienRoutes = require('./routes/nhanVienRoutes')
const donHangRoutes = require('./routes/donHangRoutes')
const thanhToanRoutes = require('./routes/thanhToanRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/khachhang', khachHangRoutes)
app.use('/api/nhacungcap', nhaCungCapRoutes)
app.use('/api/danhmuc', danhMucRoutes)
app.use('/api/sanpham', sanPhamRoutes)
app.use('/api/khuyenmai', khuyenMaiRoutes)
app.use('/api/danhgia', danhGiaRoutes)
app.use('/api/nhanvien', nhanVienRoutes)
app.use('/api/donhang', donHangRoutes)
app.use('/api/thanhtoan', thanhToanRoutes)
app.use('/api/users', userRoutes)

async function startServer () {
  try {
    await db.init()

    app.listen(3000, () => {
      console.log('Server running on port 3000')
    })

    // ⏱ Cron: Tự động chuyển đơn 'da_giao_hang' → 'danh_gia' sau 30 giây
    setInterval(async () => {
      try {
        const result = await db.execute(
          `UPDATE TRA_OLONG.DON_HANG
           SET TRANG_THAI = 'danh_gia'
           WHERE TRANG_THAI = 'da_giao_hang'`,
          {},
          { autoCommit: true }
        )
        if (result.rowsAffected > 0) {
          console.log(`[Cron] Auto-chuyển ${result.rowsAffected} đơn đã giao hàng → chờ đánh giá`)
        }
      } catch (err) {
        console.error('[Cron] Lỗi auto-danh_gia:', err.message)
      }
    }, 30000) // chạy mỗi 30 giây

    // ⏱ Cron: Tự động chuyển đơn 'danh_gia' → 'hoan_thanh' sau 30 giây
    setInterval(async () => {
      try {
        const result = await db.execute(
          `UPDATE TRA_OLONG.DON_HANG
           SET TRANG_THAI = 'hoan_thanh'
           WHERE TRANG_THAI = 'danh_gia'`,
          {},
          { autoCommit: true }
        )
        if (result.rowsAffected > 0) {
          console.log(`[Cron] Auto-hoàn thành ${result.rowsAffected} đơn hàng chờ đánh giá`)
        }
      } catch (err) {
        console.error('[Cron] Lỗi auto-hoàn thành:', err.message)
      }
    }, 30000) // chạy mỗi 30 giây

  } catch (err) {
    console.error(err)
  }
}

startServer()
