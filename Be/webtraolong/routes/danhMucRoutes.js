const express = require('express')
const router = express.Router()
const DanhMucController = require('../controllers/DanhMucController')

router.get('/', DanhMucController.getAll)
router.get('/:id', DanhMucController.getById)
router.post('/', DanhMucController.create)
router.put('/:id', DanhMucController.update)
router.delete('/:id', DanhMucController.delete)

module.exports = router
