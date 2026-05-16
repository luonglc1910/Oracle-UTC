const db = require('../db/oracle')

class DonHangModel {
  static async findAll () {
    const result = await db.execute(
      `SELECT dh.*, kh.HO_TEN, nv.HO_TEN AS TEN_NV
       FROM TRA_OLONG.DON_HANG dh
       LEFT JOIN TRA_OLONG.KHACH_HANG kh ON dh.MA_KH = kh.MA_KH
       LEFT JOIN TRA_OLONG.NHAN_VIEN nv ON dh.MA_NV = nv.MA_NV`
    )
    return result.rows
  }

  static async findById (id) {
    const result = await db.execute(
      `SELECT dh.*, kh.HO_TEN, nv.HO_TEN AS TEN_NV
       FROM TRA_OLONG.DON_HANG dh
       LEFT JOIN TRA_OLONG.KHACH_HANG kh ON dh.MA_KH = kh.MA_KH
       LEFT JOIN TRA_OLONG.NHAN_VIEN nv ON dh.MA_NV = nv.MA_NV
       WHERE dh.MA_DH = :id`,
      { id }
    )
    return result.rows[0]
  }

  static async findByKhachHang (maKh) {
    const result = await db.execute(
      `SELECT * FROM TRA_OLONG.DON_HANG WHERE MA_KH = :maKh ORDER BY NGAY_DAT DESC`,
      { maKh }
    )
    return result.rows
  }

  static async updateStatus (id, trangThai) {
    return await db.execute(
      `UPDATE TRA_OLONG.DON_HANG SET TRANG_THAI = :trangThai WHERE MA_DH = :id`,
      { id: Number(id), trangThai }
    )
  }

  static async getStats () {
    const byStatus = await db.execute(
      `SELECT TRANG_THAI, COUNT(*) AS SO_LUONG, SUM(TONG_TIEN) AS TONG_TIEN
       FROM TRA_OLONG.DON_HANG
       GROUP BY TRANG_THAI`
    )
    // Doanh thu theo tháng: chỉ tính đơn đã giao / chờ đánh giá / hoàn thành
    const revenueByMonth = await db.execute(
      `SELECT TO_CHAR(NGAY_DAT,'MM/YYYY') AS THANG, COUNT(*) AS SO_DON, SUM(TONG_TIEN) AS DOANH_THU
       FROM TRA_OLONG.DON_HANG
       WHERE NGAY_DAT >= ADD_MONTHS(SYSDATE,-11)
         AND TRANG_THAI IN ('da_giao_hang','danh_gia','hoan_thanh')
       GROUP BY TO_CHAR(NGAY_DAT,'MM/YYYY')
       ORDER BY MIN(NGAY_DAT)`
    )
    // Top sản phẩm: chỉ tính đơn đã giao / chờ đánh giá / hoàn thành
    const topProducts = await db.execute(
      `SELECT sp.TEN_SP, SUM(ct.SO_LUONG) AS TONG_BAN, SUM(ct.THANH_TIEN) AS DOANH_THU
       FROM TRA_OLONG.CHI_TIET_DH ct
       JOIN TRA_OLONG.SAN_PHAM sp ON ct.MA_SP = sp.MA_SP
       JOIN TRA_OLONG.DON_HANG dh ON ct.MA_DH = dh.MA_DH
       WHERE dh.TRANG_THAI IN ('da_giao_hang','danh_gia','hoan_thanh')
       GROUP BY sp.TEN_SP
       ORDER BY TONG_BAN DESC
       FETCH FIRST 5 ROWS ONLY`
    )
    return {
      byStatus: byStatus.rows,
      revenueByMonth: revenueByMonth.rows,
      topProducts: topProducts.rows
    }
  }

  static async create (data) {
    return await db.execute(
      `INSERT INTO TRA_OLONG.DON_HANG
        (MA_KH, MA_NV, NGAY_DAT, TONG_TIEN, PHI_VAN_CHUYEN, GIAM_GIA, TRANG_THAI, GHI_CHU, DIA_CHI_GIAO, NGAY_GIAO_DK)
       VALUES
        (:maKh, :maNv, SYSDATE, :tongTien, :phiVanChuyen, :giamGia, :trangThai, :ghiChu, :diaChiGiao, :ngayGiaoDk)`,
      {
        maKh: data.ma_kh,
        maNv: data.ma_nv,
        tongTien: data.tong_tien,
        phiVanChuyen: data.phi_van_chuyen ?? 0,
        giamGia: data.giam_gia ?? 0,
        trangThai: data.trang_thai ?? 'cho_xac_nhan',
        ghiChu: data.ghi_chu,
        diaChiGiao: data.dia_chi_giao,
        ngayGiaoDk: data.ngay_giao_dk
      }
    )
  }

  static async update (id, data) {
    return await db.execute(
      `UPDATE TRA_OLONG.DON_HANG
       SET MA_NV = :maNv,
           TONG_TIEN = :tongTien,
           PHI_VAN_CHUYEN = :phiVanChuyen,
           GIAM_GIA = :giamGia,
           TRANG_THAI = :trangThai,
           GHI_CHU = :ghiChu,
           DIA_CHI_GIAO = :diaChiGiao,
           NGAY_GIAO_DK = :ngayGiaoDk
       WHERE MA_DH = :id`,
      {
        id,
        maNv: data.ma_nv,
        tongTien: data.tong_tien,
        phiVanChuyen: data.phi_van_chuyen,
        giamGia: data.giam_gia,
        trangThai: data.trang_thai,
        ghiChu: data.ghi_chu,
        diaChiGiao: data.dia_chi_giao,
        ngayGiaoDk: data.ngay_giao_dk
      }
    )
  }

  static async delete (id) {
    return await db.execute(
      `DELETE FROM TRA_OLONG.DON_HANG WHERE MA_DH = :id`,
      { id }
    )
  }
}

module.exports = DonHangModel
