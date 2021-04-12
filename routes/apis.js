const express = require('express')
const router = express.Router()

const apiAdminController = require('../controllers/api/adminController')

router.get('/admin/restaurants', apiAdminController.getRestaurants)

module.exports = router
