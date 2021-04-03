const { Restaurant } = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
    const { file } = req
    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await Restaurant.create({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: file ? img.data.link : null
          })
          req.flash('success_msg', `成功新增餐廳: "${name}"`)
          return res.redirect('/admin/restaurants')
        })
      } else {
        await Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: null
        })

        req.flash('success_msg', `成功新增餐廳: "${name}"`)
        return res.redirect('/admin/restaurants')
      }
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
  },

  editRestaurant: async (req, res) => {
    const restaurant_id = req.params.id
    const config = {
      pageTitle: '修改餐廳',
      method: `/admin/restaurants/${restaurant_id}?_method=PUT`
    }
    try {
      let restaurant = await Restaurant.findByPk(restaurant_id, { raw: true })

      return res.render('admin/create', { config, restaurant })
    } catch (e) {
      console.warn(e)
    }
  },

  putRestaurant: async (req, res) => {
    const restaurant_id = req.params.id
    const { name, tel, address, opening_hours, description, image } = req.body
    const { file } = req
    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          let restaurant = await Restaurant.findByPk(restaurant_id)
          await restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: file ? img.data.link : restaurant.image
          })
          req.flash('success_msg', `成功修改餐廳: "${name}"`)
          return res.redirect('/admin/restaurants')
        })
      } else {
        let restaurant = await Restaurant.findByPk(restaurant_id)
        await restaurant.update({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: restaurant.image
        })
        req.flash('success_msg', `成功修改餐廳: "${name}"`)
        return res.redirect('/admin/restaurants')
      }
    } catch (e) {
      console.warn(e)
    }
  },
  deleteRestaurant: async (req, res) => {
    const restaurant_id = req.params.id

    try {
      let restaurant = await Restaurant.findByPk(restaurant_id)
      await restaurant.destroy()

      return res.redirect('/admin/restaurants')
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = adminController