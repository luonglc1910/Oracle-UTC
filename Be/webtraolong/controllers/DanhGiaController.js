const DanhGiaModel = require('../models/DanhGiaModel')

class DanhGiaController {
  static async getAll (req, res) {
    try {
      const data = await DanhGiaModel.findAll()
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const data = await DanhGiaModel.findById(req.params.id)
      if (!data) return res.status(404).json({ message: 'Không tìm thấy đánh giá' })
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getBySanPham (req, res) {
    try {
      const data = await DanhGiaModel.findBySanPham(req.params.maSp)
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async create (req, res) {
    try {
      await DanhGiaModel.create(req.body)
      res.json({ message: 'Thêm đánh giá thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async update (req, res) {
    try {
      await DanhGiaModel.update(req.params.id, req.body)
      res.json({ message: 'Cập nhật đánh giá thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async delete (req, res) {
    try {
      await DanhGiaModel.delete(req.params.id)
      res.json({ message: 'Xóa đánh giá thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = DanhGiaController
