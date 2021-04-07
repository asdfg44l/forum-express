const { Restaurant, Category } = require('../models')

const restController = {
  getRestaurants: async (req, res) => {
    try {
      let restaurants = await Restaurant.findAll({ include: [Category] })
      const data = restaurants.map(r => ({
        ...r.dataValues,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name
      }))
      return res.render('restaurants', { restaurants: data })
    } catch (e) {
      console.warn(e)
    }

  }
}

module.exports = restController