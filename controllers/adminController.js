const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: async (req, res) => {
    let restaurants = await Restaurant.findAll({ raw: true })
    return res.render('admin/restaurants', { restaurants })
  }
}

module.exports = adminController