const { Comment } = require('../models')

const commentController = {
  postComment: async (req, res) => {
    const user_id = req.user.id
    const { text, restaurantId } = req.body
    try {
      await Comment.create({
        text,
        UserId: user_id,
        RestaurantId: restaurantId
      })

      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = commentController