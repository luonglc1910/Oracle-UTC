const db = require('../db/oracle')

class DanhMucModel {
  static async findAll () {
    const result = await db.execute(`SELECT * FROM TRA_OLONG.DANH_MUC`)
    return result.rows
  }

  static async findById (id) {
    const result = await db.execute(
      `SELECT * FROM TRA_OLONG.DANH_MUC WHERE MA_DANH_MUC = :id`,
      { id }
    )
    return result.rows[0]
  }

  static async create (data) {
    return await db.execute(
      `INSERT INTO TRA_OLONG.DANH_MUC
        (TEN_DANH_MUC, MO_TA, HINH_ANH, TRANG_THAI, NGAY_TAO)
       VALUES
        (:tenDanhMuc, :moTa, :hinhAnh, :trangThai, SYSDATE)`,
      {
        tenDanhMuc: data.ten_danh_muc,
        moTa: data.mo_ta,
        hinhAnh: data.hinh_anh,
        trangThai: data.trang_thai ?? 1
      }
    )
  }

  static async update (id, data) {
    return await db.execute(
      `UPDATE TRA_OLONG.DANH_MUC
       SET TEN_DANH_MUC = :tenDanhMuc,
           MO_TA = :moTa,
           HINH_ANH = :hinhAnh,
           TRANG_THAI = :trangThai
       WHERE MA_DANH_MUC = :id`,
      {
        id,
        tenDanhMuc: data.ten_danh_muc,
        moTa: data.mo_ta,
        hinhAnh: data.hinh_anh,
        trangThai: data.trang_thai
      }
    )
  }

  static async delete (id) {
    return await db.execute(
      `DELETE FROM TRA_OLONG.DANH_MUC WHERE MA_DANH_MUC = :id`,
      { id }
    )
  }
}

module.exports = DanhMucModel
