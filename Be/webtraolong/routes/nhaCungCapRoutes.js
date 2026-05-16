const express = require('express')
const router = express.Router()
const NhaCungCapController = require('../controllers/NhaCungCapController')

router.get('/', NhaCungCapController.getAll)
router.get('/:id', NhaCungCapController.getById)
router.post('/', NhaCungCapController.create)
router.put('/:id', NhaCungCapController.update)
router.delete('/:id', NhaCungCapController.delete)

module.exports = router
