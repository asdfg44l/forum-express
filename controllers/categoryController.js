const { Category } = require('../models')

const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_msg', data.message)
        return res.redirect('/admin/categories')
      }
      req.flash('success_msg'.data.message)
      return res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_msg', data.message)
        return res.redirect('/admin/categories')
      }
      req.flash('success_msg', data.message)
      return res.redirect('/admin/categories')
    })
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