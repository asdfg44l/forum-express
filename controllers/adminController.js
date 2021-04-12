const { Restaurant, User, Category } = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: async (req, res) => {
    const config = {
      pageTitle: '新增餐廳',
      method: '/admin/restaurants'
    }
    let categories = await Category.findAll({ raw: true, nest: true })

    return res.render('admin/create', { config, categories })
  },
  postRestaurat: (req, res) => {
    adminService.postRestaurat(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_msg', data.message)
        return res.redirect('/admin/restaurants')
      }
      req.flash('success_msg', data.message)
      return res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/detail', data)
    })
  },

  editRestaurant: async (req, res) => {
    const restaurant_id = req.params.id
    const config = {
      pageTitle: '修改餐廳',
      method: `/admin/restaurants/${restaurant_id}?_method=PUT`
    }
    try {
      let restaurant = await Restaurant.findByPk(restaurant_id, { raw: true })
      let categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/create', { config, restaurant, categories })
    } catch (e) {
      console.warn(e)
    }
  },

  putRestaurant: async (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('errpr_msg', data.message)
        return res.redirect('/admin/restaurants')
      }
      req.flash('success_msg', '成功修改餐廳')
      return res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  //user
  getUsers: async (req, res) => {
    try {
      let users = await User.findAll({ raw: true })

      return res.render('admin/users', { users })
    } catch (e) {
      console.warn(e)
    }
  },
  toggleAdmin: async (req, res) => {
    const user_id = req.params.id
    try {
      let user = await User.findByPk(user_id)
      await user.update({ isAdmin: !user.isAdmin })

      return res.redirect('/admin/users')
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = adminController