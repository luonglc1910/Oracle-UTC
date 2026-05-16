const db = require('../db/oracle')

class NhanVienModel {
  static async findAll () {
    const result = await db.execute(`SELECT * FROM TRA_OLONG.NHAN_VIEN`)
    return result.rows
  }

  static async findById (id) {
    const result = await db.execute(
      `SELECT * FROM TRA_OLONG.NHAN_VIEN WHERE MA_NV = :id`,
      { id }
    )
    return result.rows[0]
  }

  static async create (data) {
    return await db.execute(
      `INSERT INTO TRA_OLONG.NHAN_VIEN
        (HO_TEN, CHUC_VU, EMAIL, DIEN_THOAI, TRANG_THAI, LUONG, NGAY_VAO_LAM)
       VALUES
        (:hoTen, :chucVu, :email, :dienThoai, :trangThai, :luong, :ngayVaoLam)`,
      {
        hoTen: data.ho_ten,
        chucVu: data.chuc_vu,
        email: data.email,
        dienThoai: data.dien_thoai,
        trangThai: data.trang_thai ?? 1,
        luong: data.luong,
        ngayVaoLam: data.ngay_vao_lam
      }
    )
  }

  static async update (id, data) {
    return await db.execute(
      `UPDATE TRA_OLONG.NHAN_VIEN
       SET HO_TEN = :hoTen,
           CHUC_VU = :chucVu,
           EMAIL = :email,
           DIEN_THOAI = :dienThoai,
           TRANG_THAI = :trangThai,
           LUONG = :luong
       WHERE MA_NV = :id`,
      {
        id,
        hoTen: data.ho_ten,
        chucVu: data.chuc_vu,
        email: data.email,
        dienThoai: data.dien_thoai,
        trangThai: data.trang_thai,
        luong: data.luong
      }
    )
  }

  static async delete (id) {
    return await db.execute(
      `DELETE FROM TRA_OLONG.NHAN_VIEN WHERE MA_NV = :id`,
      { id }
    )
  }
}

module.exports = NhanVienModel
