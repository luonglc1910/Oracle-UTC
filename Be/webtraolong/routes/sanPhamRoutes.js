const express = require('express')
const router = express.Router()
const SanPhamController = require('../controllers/SanPhamController')
const upload = require('../middleware/upload')

router.get('/', SanPhamController.getAll)
router.get('/danhmuc/:maDanhMuc', SanPhamController.getByDanhMuc)
router.get('/:id', SanPhamController.getById)
router.post('/', upload.single('hinh_anh'), SanPhamController.create)
router.put('/:id', upload.single('hinh_anh'), SanPhamController.update)
router.delete('/:id', SanPhamController.delete)

module.exports = router
