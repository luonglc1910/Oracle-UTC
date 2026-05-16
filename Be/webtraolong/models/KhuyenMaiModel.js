const db = require('../db/oracle')

class KhuyenMaiModel {
  static async findAll () {
    const result = await db.execute(`SELECT * FROM TRA_OLONG.KHUYEN_MAI`)
    return result.rows
  }

  static async findById (id) {
    const result = await db.execute(
      `SELECT * FROM TRA_OLONG.KHUYEN_MAI WHERE MA_KM = :id`,
      { id }
    )
    return result.rows[0]
  }

  static async findByCode (maCode) {
    const result = await db.execute(
      `SELECT * FROM TRA_OLONG.KHUYEN_MAI WHERE MA_CODE = :maCode AND TRANG_THAI = 1 AND NGAY_BAT_DAU <= SYSDATE AND NGAY_KET_THUC >= SYSDATE`,
      { maCode }
    )
    return result.rows[0]
  }

  static async create (data) {
    return await db.execute(
      `INSERT INTO TRA_OLONG.KHUYEN_MAI
        (TEN_KM, MA_CODE, PHAN_TRAM_GIAM, SO_TIEN_GIAM, NGAY_BAT_DAU, NGAY_KET_THUC, SO_LUONG_MA, DA_DUNG, TRANG_THAI)
       VALUES
        (:tenKm, :maCode, :phanTramGiam, :soTienGiam, :ngayBatDau, :ngayKetThuc, :soLuongMa, 0, :trangThai)`,
      {
        tenKm: data.ten_km,
        maCode: data.ma_code,
        phanTramGiam: data.phan_tram_giam,
        soTienGiam: data.so_tien_giam,
        ngayBatDau: data.ngay_bat_dau,
        ngayKetThuc: data.ngay_ket_thuc,
        soLuongMa: data.so_luong_ma,
        trangThai: data.trang_thai ?? 1
      }
    )
  }

  static async update (id, data) {
    return await db.execute(
      `UPDATE TRA_OLONG.KHUYEN_MAI
       SET TEN_KM = :tenKm,
           MA_CODE = :maCode,
           PHAN_TRAM_GIAM = :phanTramGiam,
           SO_TIEN_GIAM = :soTienGiam,
           NGAY_BAT_DAU = :ngayBatDau,
           NGAY_KET_THUC = :ngayKetThuc,
           SO_LUONG_MA = :soLuongMa,
           TRANG_THAI = :trangThai
       WHERE MA_KM = :id`,
      {
        id,
        tenKm: data.ten_km,
        maCode: data.ma_code,
        phanTramGiam: data.phan_tram_giam,
        soTienGiam: data.so_tien_giam,
        ngayBatDau: data.ngay_bat_dau,
        ngayKetThuc: data.ngay_ket_thuc,
        soLuongMa: data.so_luong_ma,
        trangThai: data.trang_thai
      }
    )
  }

  static async delete (id) {
    return await db.execute(
      `DELETE FROM TRA_OLONG.KHUYEN_MAI WHERE MA_KM = :id`,
      { id }
    )
  }
}

module.exports = KhuyenMaiModel
