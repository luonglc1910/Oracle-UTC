const KhuyenMaiModel = require('../models/KhuyenMaiModel')

class KhuyenMaiController {
  static async getAll (req, res) {
    try {
      const data = await KhuyenMaiModel.findAll()
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const data = await KhuyenMaiModel.findById(req.params.id)
      if (!data) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi' })
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async applyCode (req, res) {
    try {
      const { ma_code } = req.body
      if (!ma_code) return res.status(400).json({ message: 'Vui lòng nhập mã khuyến mãi' })

      const km = await KhuyenMaiModel.findByCode(ma_code)
      if (!km) return res.status(404).json({ message: 'Mã khuyến mãi không hợp lệ hoặc đã hết hạn' })

      res.json({ message: 'Áp dụng mã thành công', data: km })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async create (req, res) {
    try {
      await KhuyenMaiModel.create(req.body)
      res.json({ message: 'Thêm khuyến mãi thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async update (req, res) {
    try {
      await KhuyenMaiModel.update(req.params.id, req.body)
      res.json({ message: 'Cập nhật khuyến mãi thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async delete (req, res) {
    try {
      await KhuyenMaiModel.delete(req.params.id)
      res.json({ message: 'Xóa khuyến mãi thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = KhuyenMaiController
