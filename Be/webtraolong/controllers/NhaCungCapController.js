const NhaCungCapModel = require('../models/NhaCungCapModel')

class NhaCungCapController {
  static async getAll (req, res) {
    try {
      const data = await NhaCungCapModel.findAll()
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const data = await NhaCungCapModel.findById(req.params.id)
      if (!data) return res.status(404).json({ message: 'Không tìm thấy nhà cung cấp' })
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async create (req, res) {
    try {
      await NhaCungCapModel.create(req.body)
      res.json({ message: 'Thêm nhà cung cấp thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async update (req, res) {
    try {
      await NhaCungCapModel.update(req.params.id, req.body)
      res.json({ message: 'Cập nhật nhà cung cấp thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async delete (req, res) {
    try {
      await NhaCungCapModel.delete(req.params.id)
      res.json({ message: 'Xóa nhà cung cấp thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = NhaCungCapController
