const { Restaurant, Category } = require('../../models')

const adminController = {
  getRestaurants: async (req, res) => {
    let restaurants = await Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })

    return res.json({ restaurants })
  }
}

module.exports = adminController