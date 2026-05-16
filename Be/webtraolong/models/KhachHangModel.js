const db = require('../db/oracle')

class KhachHangModel {
  static async findAll () {
    const result = await db.execute(`SELECT * FROM TRA_OLONG.KHACH_HANG`)
    return result.rows
  }

  static async findById (id) {
    const result = await db.execute(
      `SELECT * FROM TRA_OLONG.KHACH_HANG WHERE MA_KH = :id`,
      { id }
    )
    return result.rows[0]
  }

  static async create (data) {
    return await db.execute(
      `INSERT INTO TRA_OLONG.KHACH_HANG
        (MA_KH, HO_TEN, EMAIL, DIEN_THOAI, DIA_CHI, PHUONG_XA, QUAN_HUYEN, TINH_TP, NGAY_SINH, GIOI_TINH, MAT_KHAU)
       VALUES
        (TRA_OLONG.SEQ_KH.NEXTVAL, :hoTen, :email, :dienThoai, :diaChi, :phuongXa, :quanHuyen, :tinhTp, :ngaySinh, :gioiTinh, :matKhau)`,
      {
        hoTen: data.ho_ten ?? null,
        email: data.email ?? null,
        dienThoai: data.dien_thoai ?? null,
        diaChi: data.dia_chi ?? null,
        phuongXa: data.phuong_xa ?? null,
        quanHuyen: data.quan_huyen ?? null,
        tinhTp: data.tinh_tp ?? null,
        ngaySinh: data.ngay_sinh ?? null,
        gioiTinh: data.gioi_tinh ?? null,
        matKhau: data.mat_khau ?? null
      }
    )
  }

  static async update (id, data) {
    return await db.execute(
      `UPDATE TRA_OLONG.KHACH_HANG
       SET HO_TEN = :hoTen,
           EMAIL = :email,
           DIEN_THOAI = :dienThoai,
           DIA_CHI = :diaChi,
           PHUONG_XA = :phuongXa,
           QUAN_HUYEN = :quanHuyen,
           TINH_TP = :tinhTp,
           NGAY_SINH = :ngaySinh,
           GIOI_TINH = :gioiTinh
       WHERE MA_KH = :id`,
      {
        id,
        hoTen: data.ho_ten ?? null,
        email: data.email ?? null,
        dienThoai: data.dien_thoai ?? null,
        diaChi: data.dia_chi ?? null,
        phuongXa: data.phuong_xa ?? null,
        quanHuyen: data.quan_huyen ?? null,
        tinhTp: data.tinh_tp ?? null,
        ngaySinh: data.ngay_sinh ?? null,
        gioiTinh: data.gioi_tinh ?? null
      }
    )
  }

  static async delete (id) {
    return await db.execute(
      `DELETE FROM TRA_OLONG.KHACH_HANG WHERE MA_KH = :id`,
      { id }
    )
  }
}

module.exports = KhachHangModel
