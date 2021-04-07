const { Restaurant, Category } = require('../models')

const restController = {
  getRestaurants: async (req, res) => {
    try {
      let whereQuery = {}
      let { categoryId } = req.query
      if (categoryId) {
        categoryId = Number(categoryId)
        whereQuery['CategoryId'] = categoryId
      } else {
        categoryId = ''
      }

      let restaurants = await Restaurant.findAll({ include: [Category], where: whereQuery })
      const data = restaurants.map(r => ({
        ...r.dataValues,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name
      }))

      let categories = await Category.findAll({ raw: true, nest: true })

      return res.render('restaurants', { restaurants: data, categories, categoryId })
    } catch (e) {
      console.warn(e)
    }
  },
  getRestaurant: async (req, res) => {
    const restaurant_id = req.params.id
    try {
      let restaurant = await Restaurant.findByPk(restaurant_id, { include: [Category] })
      return res.render('detail', { restaurant: restaurant.toJSON() })
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = restController