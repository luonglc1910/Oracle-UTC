const express = require('express')
const router = express.Router()
const ThanhToanController = require('../controllers/thanhToanController')

router.get('/', ThanhToanController.getAll)
router.get('/donhang/:maDh', ThanhToanController.getByDonHang)
router.get('/:id', ThanhToanController.getById)
router.post('/', ThanhToanController.create)
router.put('/:id', ThanhToanController.update)
router.delete('/:id', ThanhToanController.delete)

module.exports = router
