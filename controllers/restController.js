const { Restaurant } = require('../models')

const restController = {
  getRestaurants: async (req, res) => {
    try {
      let restaurants = await Restaurant.findAll({ raw: true })
      return res.render('restaurants', { restaurants })
    } catch (e) {
      console.warn(e)
    }

  }
}

module.exports = restController