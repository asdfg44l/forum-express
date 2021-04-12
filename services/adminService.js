const { Restaurant, User, Category } = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  getRestaurants: async (req, res, callback) => {
    let restaurants = await Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })

    return callback({ restaurants })
  },
  getRestaurant: async (req, res, callback) => {
    const restaurant_id = req.params.id
    try {
      let restaurant = await Restaurant.findByPk(
        restaurant_id,
        { include: [Category] }
      )

      return callback({ restaurant: restaurant.toJSON() })
    } catch (e) {
      console.warn(e)
    }
  },
  deleteRestaurant: async (req, res, callback) => {
    const restaurant_id = req.params.id

    try {
      let restaurant = await Restaurant.findByPk(restaurant_id)
      await restaurant.destroy()

      return callback({ status: 'success', message: '' })
    } catch (e) {
      console.warn(e)
    }
  },
}

module.exports = adminService