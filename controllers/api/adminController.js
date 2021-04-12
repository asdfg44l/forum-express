const { Restaurant, Category } = require('../../models')

const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
  getRestaurant: async (req, res) => {
    const restaurant_id = req.params.id
    try {
      let restaurant = await Restaurant.findByPk(
        restaurant_id,
        { include: [Category] }
      )

      return res.json({ restaurant: restaurant.toJSON() })
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = adminController