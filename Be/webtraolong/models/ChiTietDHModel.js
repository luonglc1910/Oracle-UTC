const db = require('../db/oracle')

class ChiTietDonHangModel {
  static async findByDonHang (maDh) {
    const result = await db.execute(
      `SELECT ct.*, sp.TEN_SP, sp.HINH_ANH
       FROM TRA_OLONG.CHI_TIET_DH ct
       LEFT JOIN TRA_OLONG.SAN_PHAM sp ON ct.MA_SP = sp.MA_SP
       WHERE ct.MA_DH = :maDh`,
      { maDh }
    )
    return result.rows
  }

  static async findById (id) {
    const result = await db.execute(
      `SELECT ct.*, sp.TEN_SP
       FROM TRA_OLONG.CHI_TIET_DH ct
       LEFT JOIN TRA_OLONG.SAN_PHAM sp ON ct.MA_SP = sp.MA_SP
       WHERE ct.MA_CTDH = :id`,
      { id }
    )
    return result.rows[0]
  }

  static async create (data) {
    return await db.execute(
      `INSERT INTO TRA_OLONG.CHI_TIET_DH
        (MA_DH, MA_SP, SO_LUONG, DON_GIA)
       VALUES
        (:maDh, :maSp, :soLuong, :donGia)`,
      {
        maDh: data.ma_dh,
        maSp: data.ma_sp,
        soLuong: data.so_luong,
        donGia: data.don_gia
      }
    )
  }

  static async update (id, data) {
    return await db.execute(
      `UPDATE TRA_OLONG.CHI_TIET_DH
       SET SO_LUONG = :soLuong,
           DON_GIA = :donGia
       WHERE MA_CTDH = :id`,
      {
        id,
        soLuong: data.so_luong,
        donGia: data.don_gia
      }
    )
  }

  static async delete (id) {
    return await db.execute(
      `DELETE FROM TRA_OLONG.CHI_TIET_DH WHERE MA_CTDH = :id`,
      { id }
    )
  }

  static async deleteByDonHang (maDh) {
    return await db.execute(
      `DELETE FROM TRA_OLONG.CHI_TIET_DH WHERE MA_DH = :maDh`,
      { maDh }
    )
  }
}

module.exports = ChiTietDonHangModel
