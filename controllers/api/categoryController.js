const { Category } = require('../../models')

const categoryController = {
  getCategories: async (req, res) => {
    const category_id = req.params.id
    try {
      let categories = await Category.findAll({ raw: true, nest: true })
      if (category_id) {
        let edit_category = await Category.findByPk(category_id)
        return res.json({ categories, category: edit_category.toJSON() })
      }
      return res.json({ categories })
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = categoryController