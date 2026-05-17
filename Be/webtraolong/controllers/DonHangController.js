const DonHangModel = require('../models/DonHangModel')
const ChiTietDonHangModel = require('../models/ChiTietDHModel')

class DonHangController {
  static async getAll (req, res) {
    try {
      const data = await DonHangModel.findAll()
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const donHang = await DonHangModel.findById(req.params.id)
      if (!donHang) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

      const chiTiet = await ChiTietDonHangModel.findByDonHang(req.params.id)
      res.json({ ...donHang, chi_tiet: chiTiet })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getByKhachHang (req, res) {
    try {
      const data = await DonHangModel.findByKhachHang(req.params.maKh)
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async create (req, res) {
    try {
      const { chi_tiet, ...donHangData } = req.body

      // Tạo đơn hàng — model trả về MA_DH từ RETURNING INTO
      const maDh = await DonHangModel.create(donHangData)

      // Thêm chi tiết đơn hàng
      if (chi_tiet && chi_tiet.length > 0) {
        for (const item of chi_tiet) {
          await ChiTietDonHangModel.create({ ...item, ma_dh: maDh })
        }
      }

      res.json({ message: 'Tạo đơn hàng thành công', ma_dh: maDh })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async update (req, res) {
    try {
      await DonHangModel.update(req.params.id, req.body)
      res.json({ message: 'Cập nhật đơn hàng thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  // Logic chuyển trạng thái hợp lệ
  static async updateStatus (req, res) {
    const NEXT_STATUS = {
      'cho_xac_nhan':   ['da_xac_nhan', 'huy'],
      'da_xac_nhan':    ['cho_giao_hang', 'huy'],
      'cho_giao_hang':  ['dang_giao_hang', 'huy'],
      'dang_giao_hang': ['da_giao_hang'],
      'da_giao_hang':   ['danh_gia'],
      'danh_gia':       ['hoan_thanh'],
      'hoan_thanh':     [],
      'huy':            []
    }
    try {
      const donHang = await DonHangModel.findById(req.params.id)
      if (!donHang) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
      const { trang_thai } = req.body
      const currentStatus = (donHang.TRANG_THAI || '').toLowerCase()
      const allowed = NEXT_STATUS[currentStatus] || []
      if (!allowed.includes(trang_thai)) {
        return res.status(400).json({
          message: `Không thể chuyển từ '${currentStatus}' sang '${trang_thai}'. Cho phép: ${allowed.join(', ') || 'Không có'}`
        })
      }
      await DonHangModel.updateStatus(req.params.id, trang_thai)
      res.json({ message: 'Cập nhật trạng thái thành công', trang_thai })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getStats (req, res) {
    try {
      const stats = await DonHangModel.getStats()
      res.json(stats)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async delete (req, res) {
    try {
      await ChiTietDonHangModel.deleteByDonHang(req.params.id)
      await DonHangModel.delete(req.params.id)
      res.json({ message: 'Xóa đơn hàng thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = DonHangController
