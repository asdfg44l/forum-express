const { Category } = require('../models')

const categoryService = {
  getCategories: async (req, res, callback) => {
    const category_id = req.params.id
    try {
      let categories = await Category.findAll({ raw: true, nest: true })
      if (category_id) {
        let edit_category = await Category.findByPk(category_id)
        return callback({ categories, category: edit_category.toJSON() })
      }
      return callback({ categories })
    } catch (e) {
      console.warn(e)
    }
  },
  postCategory: async (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      return callback({ status: 'error', message: '名稱為必填' })
    }
    try {
      let ifCatrgory = await Category.findOne({ where: { name } })
      if (ifCatrgory) {
        // req.flash('error_msg', '已有此分類')
        // return res.redirect('/admin/categories')
        return callback({ status: 'error', message: '已有此分類' })
      }
      await Category.create({ name })

      // return res.redirect('/admin/categories')
      return callback({ status: 'success', message: '已新增分類' })
    } catch (e) {
      return callback({ status: 'error', message: '' })
    }
  },
  putCategory: async (req, res, callback) => {
    const category_id = req.params.id
    const { name } = req.body
    if (!name) {
      return callback({ status: 'error', message: '名稱為必填' })
    }
    try {
      let category = await Category.findByPk(category_id)
      await category.update({ name })
      // return res.redirect('/admin/categories')
      return callback({ status: 'success', message: '分類名稱已變更' })
    } catch (e) {
      return callback({ status: 'error', message: '變更失敗' })
    }
  },
  deleteCategory: async (req, res, callback) => {
    const category_id = req.params.id
    try {
      let category = await Category.findByPk(category_id)
      await category.destroy()
      return callback({ status: 'success', message: '分類已刪除' })
    } catch (e) {
      return callback({ status: 'error', message: '刪除失敗' })
    }
  }
}

module.exports = categoryService