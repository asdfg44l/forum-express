const fs = require('fs')
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
    const { file } = req
    try {
      if (file) {
        console.log(file)
        fs.readFile(file.path, (err, data) => {
          if (err) console.log('Error', err)
          fs.writeFile(`upload/${file.originalname}`, data, async () => {
            await Restaurant.create({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? `/upload/${file.originalname}` : null
            })
            req.flash('success_msg', `成功新增餐廳: "${name}"`)
            return res.redirect('/admin/restaurants')
          })
        })
      } else {
        await Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? `upload/${file.originalname}` : null
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
        fs.readFile(file.path, (err, data) => {
          if (err) console.log("Error: ", err)
          fs.writeFile(`upload/${file.originalname}`, data, async () => {
            let restaurant = await Restaurant.findByPk(restaurant_id)
            await restaurant.update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? `/upload/${file.originalname}` : restaurant.image
            })
            req.flash('success_msg', `成功修改餐廳: "${name}"`)
            return res.redirect('/admin/restaurants')
          })
        })
      } else {
        let restaurant = await Restaurant.findByPk(restaurant_id)
        await restaurant.update({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? `/upload/${file.originalname}` : restaurant.image
        })
        req.flash('success_msg', `成功修改餐廳: "${name}"`)
        return res.redirect('/admin/restaurants')
      }
      let restaurant = await Restaurant.findByPk(restaurant_id)
      await restaurant.update({ name, tel, address, opening_hours, description })

      return res.redirect('/admin/restaurants')
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