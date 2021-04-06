const { Category } = require('../models')

let categoryController = {
  getCategories: async (req, res) => {
    let categories = await Category.findAll({ raw: true, nest: true })

    return res.render('admin/categories', { categories })
  }
}

module.exports = categoryController