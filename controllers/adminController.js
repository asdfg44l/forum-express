const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: async (req, res) => {
    let restaurants = await Restaurant.findAll({ raw: true })
    return res.render('admin/restaurants', { restaurants })
  },

  createRestaurant: (req, res) => {
    const config = {
      pageTitle: '新增餐廳',
      method: '/admin/restaurants'
    }
    return res.render('admin/create', { config })
  },
  postRestaurat: async (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    try {
      await Restaurant.create({ name, tel, address, opening_hours, description })
      req.flash('success_msg', `成功新增餐廳: "${name}"`)
      return res.redirect('/admin/restaurants')
    } catch (e) {
      console.warn(e)
    }
  },

  getRestaurant: async (req, res) => {
    const restaurant_id = req.params.id
    try {
      let restaurant = await Restaurant.findByPk(restaurant_id, { raw: true })

      return res.render('admin/detail', { restaurant })
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = adminController