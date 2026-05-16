const express = require('express')
const router = express.Router()
const SanPhamController = require('../controllers/SanPhamController')

router.get('/', SanPhamController.getAll)
router.get('/danhmuc/:maDanhMuc', SanPhamController.getByDanhMuc)
router.get('/:id', SanPhamController.getById)
router.post('/', SanPhamController.create)
router.put('/:id', SanPhamController.update)
router.delete('/:id', SanPhamController.delete)

module.exports = router
