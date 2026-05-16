const DanhMucModel = require('../models/DanhMucModel')

class DanhMucController {
  static async getAll (req, res) {
    try {
      const data = await DanhMucModel.findAll()
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const data = await DanhMucModel.findById(req.params.id)
      if (!data) return res.status(404).json({ message: 'Không tìm thấy danh mục' })
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async create (req, res) {
    try {
      await DanhMucModel.create(req.body)
      res.json({ message: 'Thêm danh mục thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async update (req, res) {
    try {
      await DanhMucModel.update(req.params.id, req.body)
      res.json({ message: 'Cập nhật danh mục thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async delete (req, res) {
    try {
      await DanhMucModel.delete(req.params.id)
      res.json({ message: 'Xóa danh mục thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = DanhMucController
