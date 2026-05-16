const express = require('express')
const router = express.Router()
const DanhGiaController = require('../controllers/DanhGiaController')

router.get('/', DanhGiaController.getAll)
router.get('/sanpham/:maSp', DanhGiaController.getBySanPham)
router.get('/:id', DanhGiaController.getById)
router.post('/', DanhGiaController.create)
router.put('/:id', DanhGiaController.update)
router.delete('/:id', DanhGiaController.delete)

module.exports = router
