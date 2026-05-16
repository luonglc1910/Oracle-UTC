const KhachHangModel = require('../models/KhachHangModel')

class KhachHangController {
  static async getAll (req, res) {
    try {
      const data = await KhachHangModel.findAll()
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const data = await KhachHangModel.findById(req.params.id)
      if (!data) return res.status(404).json({ message: 'Không tìm thấy khách hàng' })
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async create (req, res) {
    try {
      await KhachHangModel.create(req.body)
      res.json({ message: 'Thêm khách hàng thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async update (req, res) {
    try {
      await KhachHangModel.update(req.params.id, req.body)
      res.json({ message: 'Cập nhật khách hàng thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async delete (req, res) {
    try {
      await KhachHangModel.delete(req.params.id)
      res.json({ message: 'Xóa khách hàng thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = KhachHangController
