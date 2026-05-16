const ChiTietDonHangModel = require('../models/ChiTietDHModel')

class ChiTietDonHangController {
  static async getByDonHang (req, res) {
    try {
      const data = await ChiTietDonHangModel.findByDonHang(req.params.maDh)
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const data = await ChiTietDonHangModel.findById(req.params.id)
      if (!data) return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' })
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async create (req, res) {
    try {
      await ChiTietDonHangModel.create(req.body)
      res.json({ message: 'Thêm chi tiết đơn hàng thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async update (req, res) {
    try {
      await ChiTietDonHangModel.update(req.params.id, req.body)
      res.json({ message: 'Cập nhật chi tiết đơn hàng thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async delete (req, res) {
    try {
      await ChiTietDonHangModel.delete(req.params.id)
      res.json({ message: 'Xóa chi tiết đơn hàng thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = ChiTietDonHangController
