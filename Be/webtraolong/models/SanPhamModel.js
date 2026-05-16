const db = require('../db/oracle')

class SanPhamModel {
  static async findAll () {
    const result = await db.execute(
      `SELECT sp.*, dm.TEN_DANH_MUC, ncc.TEN_NCC
       FROM TRA_OLONG.SAN_PHAM sp
       LEFT JOIN TRA_OLONG.DANH_MUC dm ON sp.MA_DANH_MUC = dm.MA_DANH_MUC
       LEFT JOIN TRA_OLONG.NHA_CUNG_CAP ncc ON sp.MA_NCC = ncc.MA_NCC`
    )
    return result.rows
  }

  static async findById (id) {
    const result = await db.execute(
      `SELECT sp.*, dm.TEN_DANH_MUC, ncc.TEN_NCC
       FROM TRA_OLONG.SAN_PHAM sp
       LEFT JOIN TRA_OLONG.DANH_MUC dm ON sp.MA_DANH_MUC = dm.MA_DANH_MUC
       LEFT JOIN TRA_OLONG.NHA_CUNG_CAP ncc ON sp.MA_NCC = ncc.MA_NCC
       WHERE sp.MA_SP = :id`,
      { id }
    )
    return result.rows[0]
  }

  static async findByDanhMuc (maDanhMuc) {
    const result = await db.execute(
      `SELECT * FROM TRA_OLONG.SAN_PHAM WHERE MA_DANH_MUC = :maDanhMuc`,
      { maDanhMuc }
    )
    return result.rows
  }

  static async create (data) {
    return await db.execute(
      `INSERT INTO TRA_OLONG.SAN_PHAM
        (TEN_SP, MA_DANH_MUC, MA_NCC, GIA_BAN, GIA_NHAP, TRONG_LUONG, MO_TA, HINH_ANH, TON_KHO, TRANG_THAI, NGAY_THEM)
       VALUES
        (:tenSp, :maDanhMuc, :maNcc, :giaBan, :giaNhap, :trongLuong, :moTa, :hinhAnh, :tonKho, :trangThai, SYSDATE)`,
      {
        tenSp: data.ten_sp,
        maDanhMuc: data.ma_danh_muc,
        maNcc: data.ma_ncc,
        giaBan: data.gia_ban,
        giaNhap: data.gia_nhap,
        trongLuong: data.trong_luong,
        moTa: data.mo_ta,
        hinhAnh: data.hinh_anh,
        tonKho: data.ton_kho ?? 0,
        trangThai: data.trang_thai ?? 1
      }
    )
  }

  static async update (id, data) {
    return await db.execute(
      `UPDATE TRA_OLONG.SAN_PHAM
       SET TEN_SP = :tenSp,
           MA_DANH_MUC = :maDanhMuc,
           MA_NCC = :maNcc,
           GIA_BAN = :giaBan,
           GIA_NHAP = :giaNhap,
           TRONG_LUONG = :trongLuong,
           MO_TA = :moTa,
           HINH_ANH = :hinhAnh,
           TON_KHO = :tonKho,
           TRANG_THAI = :trangThai
       WHERE MA_SP = :id`,
      {
        id,
        tenSp: data.ten_sp,
        maDanhMuc: data.ma_danh_muc,
        maNcc: data.ma_ncc,
        giaBan: data.gia_ban,
        giaNhap: data.gia_nhap,
        trongLuong: data.trong_luong,
        moTa: data.mo_ta,
        hinhAnh: data.hinh_anh,
        tonKho: data.ton_kho,
        trangThai: data.trang_thai
      }
    )
  }

  static async delete (id) {
    return await db.execute(
      `DELETE FROM TRA_OLONG.SAN_PHAM WHERE MA_SP = :id`,
      { id }
    )
  }
}

module.exports = SanPhamModel
