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
  postRestaurat: async (req, res, callback) => {
    const { name, categoryId, tel, address, opening_hours, description } = req.body
    const { file } = req
    if (!name || !categoryId) {
      return callback({ status: 'error', message: '必填欄位未填' })
    }
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
            image: file ? img.data.link : null,
            CategoryId: categoryId
          })
          // req.flash('success_msg', `成功新增餐廳: "${name}"`)
          return callback({ status: 'success', message: '成功新增餐廳' })
        })
      } else {
        await Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: null,
          CategoryId: categoryId
        })

        // req.flash('success_msg', `成功新增餐廳: "${name}"`)
        return callback({ status: 'success', message: '成功新增餐廳' })
      }
    } catch (e) {
      return callback({ status: 'error', message: '' })
    }
  },
  deleteRestaurant: async (req, res, callback) => {
    const restaurant_id = req.params.id

    try {
      let restaurant = await Restaurant.findByPk(restaurant_id)
      await restaurant.destroy()

      return callback({ status: 'success', message: '' })
    } catch (e) {
      return res.json({ status: 'error', message: '' })
    }
  },
}

module.exports = adminService