const db = require('../db/oracle')

class DanhGiaModel {
  static async findAll () {
    const result = await db.execute(
      `SELECT dg.*, kh.HO_TEN, sp.TEN_SP
       FROM TRA_OLONG.DANH_GIA dg
       LEFT JOIN TRA_OLONG.KHACH_HANG kh ON dg.MA_KH = kh.MA_KH
       LEFT JOIN TRA_OLONG.SAN_PHAM sp ON dg.MA_SP = sp.MA_SP`
    )
    return result.rows
  }

  static async findById (id) {
    const result = await db.execute(
      `SELECT dg.*, kh.HO_TEN, sp.TEN_SP
       FROM TRA_OLONG.DANH_GIA dg
       LEFT JOIN TRA_OLONG.KHACH_HANG kh ON dg.MA_KH = kh.MA_KH
       LEFT JOIN TRA_OLONG.SAN_PHAM sp ON dg.MA_SP = sp.MA_SP
       WHERE dg.MA_DG = :id`,
      { id }
    )
    return result.rows[0]
  }

  static async findBySanPham (maSp) {
    const result = await db.execute(
      `SELECT dg.*, kh.HO_TEN
       FROM TRA_OLONG.DANH_GIA dg
       LEFT JOIN TRA_OLONG.KHACH_HANG kh ON dg.MA_KH = kh.MA_KH
       WHERE dg.MA_SP = :maSp`,
      { maSp }
    )
    return result.rows
  }

  static async create (data) {
    return await db.execute(
      `INSERT INTO TRA_OLONG.DANH_GIA
        (MA_KH, MA_SP, DIEM_DANH_GIA, NOI_DUNG, NGAY_DANH_GIA)
       VALUES
        (:maKh, :maSp, :diemDanhGia, :noiDung, SYSDATE)`,
      {
        maKh: data.ma_kh,
        maSp: data.ma_sp,
        diemDanhGia: data.diem_danh_gia,
        noiDung: data.noi_dung
      }
    )
  }

  static async update (id, data) {
    return await db.execute(
      `UPDATE TRA_OLONG.DANH_GIA
       SET DIEM_DANH_GIA = :diemDanhGia,
           NOI_DUNG = :noiDung
       WHERE MA_DG = :id`,
      {
        id,
        diemDanhGia: data.diem_danh_gia,
        noiDung: data.noi_dung
      }
    )
  }

  static async delete (id) {
    return await db.execute(
      `DELETE FROM TRA_OLONG.DANH_GIA WHERE MA_DG = :id`,
      { id }
    )
  }
}

module.exports = DanhGiaModel
