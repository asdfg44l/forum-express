const { Category } = require('../models')

const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
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
  },
  putCategory: async (req, res) => {
    const category_id = req.params.id
    const { name } = req.body
    try {
      let category = await Category.findByPk(category_id)
      await category.update({ name })
      return res.redirect('/admin/categories')
    } catch (e) {
      console.warn(e)
    }
  },
  deleteCategory: async (req, res) => {
    const category_id = req.params.id
    try {
      let category = await Category.findByPk(category_id)
      await category.destroy()
      return res.redirect('/admin/categories')
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = categoryController