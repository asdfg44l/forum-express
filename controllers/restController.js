const { Restaurant, Category, Comment, User } = require('../models')
const { getUser } = require('../_helpers')

const pageLimit = 10

const restController = {
  getRestaurants: async (req, res) => {
    try {
      let whereQuery = {}
      let { categoryId, page } = req.query

      //pagination
      page = page ? Number(page) : 1
      let offset = (page - 1) * pageLimit

      //category
      categoryId = categoryId ? Number(categoryId) : ''
      categoryId ? whereQuery['CategoryId'] = categoryId : ''

      let result = await Restaurant.findAndCountAll({ include: [Category], where: whereQuery, offset, limit: pageLimit })
      //pagination
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name,
        isFavorited: getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))

      let categories = await Category.findAll({ raw: true, nest: true })

      const currentPage = 'index'

      return res.render('restaurants', { restaurants: data, categories, categoryId, page, totalPage, prev, next, currentPage })
    } catch (e) {
      console.warn(e)
    }
  },
  getRestaurant: async (req, res) => {
    const user_id = getUser(req).id
    const restaurant_id = req.params.id
    try {
      let restaurant = await Restaurant.findByPk(restaurant_id, {
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' },
          { model: Comment, include: [User] }
        ]
      })
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(user_id)
      //新增瀏覽次數
      restaurant = await restaurant.update({
        viewCounts: restaurant.viewCounts += 1
      })

      return res.render('detail', { restaurant: restaurant.toJSON(), isFavorited })
    } catch (e) {
      console.warn(e)
    }
  },
  getFeeds: async (req, res) => {
    try {
      let getRestaurant = Restaurant.findAll({
        raw: true,
        nest: true,
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category]
      })

      let getComment = Comment.findAll({
        raw: true,
        nest: true,
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Restaurant, User]
      })

      let [restaurants, comments] = await Promise.all([getRestaurant, getComment])

      const currentPage = 'feeds'

      return res.render('feeds', { restaurants, comments, currentPage })
    } catch (e) {
      console.warn(e)
    }
  },
  getDashboard: async (req, res) => {
    const restaurant_id = req.params.id
    try {
      let restaurant = await Restaurant.findByPk(restaurant_id, {
        include: [
          Category,
          Comment
        ]
      })
      restaurant = restaurant.toJSON()

      return res.render('dashboard', {
        restaurant,
        categoryName: restaurant.Category.name,
        commentNumber: restaurant.Comments.length
      })
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = restController