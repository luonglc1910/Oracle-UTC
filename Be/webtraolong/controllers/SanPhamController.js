const SanPhamModel = require('../models/SanPhamModel')

class SanPhamController {
  static async getAll (req, res) {
    try {
      const data = await SanPhamModel.findAll()
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const data = await SanPhamModel.findById(req.params.id)
      if (!data) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getByDanhMuc (req, res) {
    try {
      const data = await SanPhamModel.findByDanhMuc(req.params.maDanhMuc)
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async create (req, res) {
    try {
      await SanPhamModel.create(req.body)
      res.json({ message: 'Thêm sản phẩm thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async update (req, res) {
    try {
      await SanPhamModel.update(req.params.id, req.body)
      res.json({ message: 'Cập nhật sản phẩm thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async delete (req, res) {
    try {
      await SanPhamModel.delete(req.params.id)
      res.json({ message: 'Xóa sản phẩm thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = SanPhamController
