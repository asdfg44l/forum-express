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
  }
}

module.exports = adminService