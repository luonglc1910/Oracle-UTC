const express = require('express')
const router = express.Router()
const DonHangController = require('../controllers/DonHangController')
const ChiTietDonHangController = require('../controllers/chiTietDonHangController')

router.get('/', DonHangController.getAll)
router.get('/thongke', DonHangController.getStats)
router.get('/khachhang/:maKh', DonHangController.getByKhachHang)
router.get('/:id', DonHangController.getById)
router.get('/:maDh/chitiet', ChiTietDonHangController.getByDonHang)
router.post('/', DonHangController.create)
router.put('/:id', DonHangController.update)
router.patch('/:id/trangthai', DonHangController.updateStatus)
router.delete('/:id', DonHangController.delete)

// Chi tiết đơn hàng riêng lẻ
router.post('/chitiet', ChiTietDonHangController.create)
router.put('/chitiet/:id', ChiTietDonHangController.update)
router.delete('/chitiet/:id', ChiTietDonHangController.delete)

module.exports = router
