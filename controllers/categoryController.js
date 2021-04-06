const { Category } = require('../models')

let categoryController = {
  getCategories: async (req, res) => {
    try {
      let categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/categories', { categories })
    } catch (e) {
      console.warn(e)
    }
  },
  postCategory: async (req, res) => {
    const { name } = req.body
    try {
      let ifCatrgory = await Category.findOne({ where: { name } })
      if (ifCatrgory) {
        req.flash('error_msg', '已有此分類')
        return res.redirect('/admin/categories')
      }
      await Category.create({ name })

      return res.redirect('/admin/categories')
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = categoryController