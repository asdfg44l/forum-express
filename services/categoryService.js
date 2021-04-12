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
  }
}

module.exports = categoryService