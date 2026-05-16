const NhanVienModel = require('../models/NhanVienModel')

class NhanVienController {
  static async getAll (req, res) {
    try {
      const data = await NhanVienModel.findAll()
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const data = await NhanVienModel.findById(req.params.id)
      if (!data) return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
      res.json(data)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async create (req, res) {
    try {
      await NhanVienModel.create(req.body)
      res.json({ message: 'Thêm nhân viên thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async update (req, res) {
    try {
      await NhanVienModel.update(req.params.id, req.body)
      res.json({ message: 'Cập nhật nhân viên thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async delete (req, res) {
    try {
      await NhanVienModel.delete(req.params.id)
      res.json({ message: 'Xóa nhân viên thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = NhanVienController
