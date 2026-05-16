const UserModel = require('../models/UserModel')
const db = require('../db/oracle')

class UserController {
  static async getAll (req, res) {
    try {
      const users = await UserModel.findAll()
      res.json(users)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  static async create (req, res) {
    try {
      await UserModel.create(req.body)
      res.json({ message: 'Tạo user thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  // Login chung: check USER_SEQ (admin/staff) trước, sau đó KHACH_HANG (theo email)
  static async login (req, res) {
    try {
      const { username, password } = req.body
      if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu' })
      }

      // 1. Check bảng USER_SEQ (admin / nhân viên)
      const adminUser = await UserModel.findByCredentials(username, password)
      if (adminUser) {
        return res.json({
          message: 'Đăng nhập thành công',
          type: adminUser.ROLE === 'admin' ? 'admin' : 'staff',
          user: adminUser
        })
      }

      // 2. Check bảng KHACH_HANG (theo email = username, password = MAT_KHAU)
      const khResult = await db.execute(
        `SELECT MA_KH, HO_TEN, EMAIL, DIEN_THOAI, DIA_CHI
         FROM TRA_OLONG.KHACH_HANG
         WHERE EMAIL = :username AND MAT_KHAU = :password`,
        { username, password }
      )
      if (khResult.rows && khResult.rows.length > 0) {
        return res.json({
          message: 'Đăng nhập thành công',
          type: 'customer',
          user: khResult.rows[0]
        })
      }

      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = UserController
