const db = require('../db/oracle')

class ThanhToanModel {
  static async findAll () {
    const result = await db.execute(
      `SELECT tt.*, dh.MA_KH
       FROM TRA_OLONG.THANH_TOAN tt
       LEFT JOIN TRA_OLONG.DON_HANG dh ON tt.MA_DH = dh.MA_DH`
    )
    return result.rows
  }

  static async findById (id) {
    const result = await db.execute(
      `SELECT * FROM TRA_OLONG.THANH_TOAN WHERE MA_TT = :id`,
      { id }
    )
    return result.rows[0]
  }

  static async findByDonHang (maDh) {
    const result = await db.execute(
      `SELECT * FROM TRA_OLONG.THANH_TOAN WHERE MA_DH = :maDh`,
      { maDh }
    )
    return result.rows[0]
  }

  static async create (data) {
    // Map frontend values → DB constraint values
    const phuongThucMap = {
      'tien_mat': 'COD', 'cod': 'COD',
      'chuyen_khoan': 'Bank_Transfer', 'bank_transfer': 'Bank_Transfer',
      'vi_dien_tu': 'VNPay', 'vnpay': 'VNPay',
      'momo': 'Momo', 'zalopay': 'ZaloPay'
    }
    const phuongThuc = phuongThucMap[(data.phuong_thuc || '').toLowerCase()] || 'COD'

    return await db.execute(
      `INSERT INTO TRA_OLONG.THANH_TOAN
        (MA_TT, MA_DH, PHUONG_THUC, SO_TIEN, NGAY_THANH_TOAN, TRANG_THAI, MA_GIAO_DICH)
       VALUES
        (TRA_OLONG.SEQ_TT.NEXTVAL, :maDh, :phuongThuc, :soTien, SYSDATE, 'Cho_thanh_toan', :maGiaoDich)`,
      {
        maDh: data.ma_dh,
        phuongThuc,
        soTien: data.so_tien,
        maGiaoDich: data.ma_giao_dich || null
      },
      { autoCommit: true }
    )
  }

  static async update (id, data) {
    return await db.execute(
      `UPDATE TRA_OLONG.THANH_TOAN
       SET PHUONG_THUC = :phuongThuc,
           SO_TIEN = :soTien,
           TRANG_THAI = :trangThai,
           MA_GIAO_DICH = :maGiaoDich
       WHERE MA_TT = :id`,
      {
        id,
        phuongThuc: data.phuong_thuc,
        soTien: data.so_tien,
        trangThai: data.trang_thai,
        maGiaoDich: data.ma_giao_dich
      }
    )
  }

  static async delete (id) {
    return await db.execute(
      `DELETE FROM TRA_OLONG.THANH_TOAN WHERE MA_TT = :id`,
      { id }
    )
  }
}

module.exports = ThanhToanModel
