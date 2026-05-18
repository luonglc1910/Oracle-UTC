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
      if (!data)
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
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
      const data = req.body

      // Nếu có file upload → gán URL vào hinh_anh
      console.log(req.file)

      if (req.file) {
        data.hinh_anh = `${process.env.DOMAIN}/uploads/${req.file.filename}`
      }

      await SanPhamModel.create(data)
      res.json({ message: 'Thêm sản phẩm thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async update (req, res) {
    try {
      const data = req.body

      // Nếu có file upload mới → xóa ảnh cũ + gán URL mới
      if (req.file) {
        const oldProduct = await SanPhamModel.findById(req.params.id)
        if (oldProduct?.HINH_ANH) {
          const oldPath = path.join(__dirname, '..', oldProduct.HINH_ANH)
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath) // xóa file cũ
        }
        data.hinh_anh = `/uploads/${req.file.filename}`
      }

      await SanPhamModel.update(req.params.id, data)
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
