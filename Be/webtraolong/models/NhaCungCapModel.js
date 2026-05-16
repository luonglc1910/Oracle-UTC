const db = require('../db/oracle')

class NhaCungCapModel {
  static async findAll () {
    const result = await db.execute(`SELECT * FROM TRA_OLONG.NHA_CUNG_CAP`)
    return result.rows
  }

  static async findById (id) {
    const result = await db.execute(
      `SELECT * FROM TRA_OLONG.NHA_CUNG_CAP WHERE MA_NCC = :id`,
      { id }
    )
    return result.rows[0]
  }

  static async create (data) {
    return await db.execute(
      `INSERT INTO TRA_OLONG.NHA_CUNG_CAP
        (TEN_NCC, DIA_CHI, DIEN_THOAI, EMAIL, QUOC_GIA, NGAY_HOP_TAC)
       VALUES
        (:tenNcc, :diaChi, :dienThoai, :email, :quocGia, :ngayHopTac)`,
      {
        tenNcc: data.ten_ncc,
        diaChi: data.dia_chi,
        dienThoai: data.dien_thoai,
        email: data.email,
        quocGia: data.quoc_gia,
        ngayHopTac: data.ngay_hop_tac
      }
    )
  }

  static async update (id, data) {
    return await db.execute(
      `UPDATE TRA_OLONG.NHA_CUNG_CAP
       SET TEN_NCC = :tenNcc,
           DIA_CHI = :diaChi,
           DIEN_THOAI = :dienThoai,
           EMAIL = :email,
           QUOC_GIA = :quocGia,
           NGAY_HOP_TAC = :ngayHopTac
       WHERE MA_NCC = :id`,
      {
        id,
        tenNcc: data.ten_ncc,
        diaChi: data.dia_chi,
        dienThoai: data.dien_thoai,
        email: data.email,
        quocGia: data.quoc_gia,
        ngayHopTac: data.ngay_hop_tac
      }
    )
  }

  static async delete (id) {
    return await db.execute(
      `DELETE FROM TRA_OLONG.NHA_CUNG_CAP WHERE MA_NCC = :id`,
      { id }
    )
  }
}

module.exports = NhaCungCapModel
