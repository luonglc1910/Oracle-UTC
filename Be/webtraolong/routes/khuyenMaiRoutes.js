const express = require('express')
const router = express.Router()
const KhuyenMaiController = require('../controllers/KhuyenMaiController')

router.get('/', KhuyenMaiController.getAll)
router.get('/:id', KhuyenMaiController.getById)
router.post('/apply', KhuyenMaiController.applyCode)
router.post('/', KhuyenMaiController.create)
router.put('/:id', KhuyenMaiController.update)
router.delete('/:id', KhuyenMaiController.delete)

module.exports = router
