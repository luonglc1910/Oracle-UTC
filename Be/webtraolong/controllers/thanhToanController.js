const ThanhToanModel = require('../models/ThanhToanModel')

class ThanhToanController {
  static async getAll (req, res) {
    try {
      const data = await ThanhToanModel.findAll()
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const data = await ThanhToanModel.findById(req.params.id)
      if (!data) return res.status(404).json({ message: 'Không tìm thấy thanh toán' })
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getByDonHang (req, res) {
    try {
      const data = await ThanhToanModel.findByDonHang(req.params.maDh)
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async create (req, res) {
    try {
      await ThanhToanModel.create(req.body)
      res.json({ message: 'Tạo thanh toán thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async update (req, res) {
    try {
      await ThanhToanModel.update(req.params.id, req.body)
      res.json({ message: 'Cập nhật thanh toán thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async delete (req, res) {
    try {
      await ThanhToanModel.delete(req.params.id)
      res.json({ message: 'Xóa thanh toán thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = ThanhToanController
