const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { getUser } = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUp')
  },

  signUp: async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      req.flash('error_msg', '密碼與確認密碼不一致')
      return res.redirect('/users/signUp')
    }
    try {
      let user = await User.findOne({ where: { email } })
      if (user) {
        req.flash('error_msg', '此帳號已被註冊')
        return res.redirect('/users/signUp')
      }
      await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      req.flash('success_msg', '成功註冊帳號!')
      return res.redirect('/signIn')
    } catch (e) {
      console.warn(e)
    }

  },

  signInPage: (req, res) => {
    return res.render('signIn')
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/users/signIn')
  },

  //profile
  getUser: async (req, res) => {
    const user_id = req.params.id

    try {
      let user = await User.findByPk(user_id, {
        include: [
          { model: Comment, include: [Restaurant] }
        ]
      })
      user = user.toJSON()
      return res.render('profile/index', { user, comments: user.Comments, commentLength: user.Comments.length })
    } catch (e) {
      console.warn(e)
    }
  },
  editUser: async (req, res) => {
    const user_id = req.params.id
    try {
      let user = await User.findByPk(user_id)

      return res.render('profile/edit', { user: user.toJSON() })
    } catch (e) {
      console.warn(e)
    }
  },
  putUser: async (req, res) => {
    const user_id = req.params.id
    const { name } = req.body
    const { file } = req
    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          let user = await User.findByPk(user_id)
          await user.update({
            name,
            image: file ? img.data.link : user.image
          })

          return res.redirect(`/users/${user_id}`)
        })
      } else {
        let user = await User.findByPk(user_id)
        await user.update({
          name,
          image: user.image
        })
        return res.redirect(`/users/${user_id}`)
      }
    } catch (e) {
      console.warn(e)
    }
  },

  //favorite
  addFavorite: async (req, res) => {
    const user_id = getUser(req).id
    const restaurant_id = req.params.restaurantId
    try {
      await Favorite.create({
        UserId: user_id,
        RestaurantId: restaurant_id
      })

      return res.redirect('back')
    } catch (e) {
      console.warn(e)
    }
  },
  removeFavorite: async (req, res) => {
    const user_id = getUser(req).id
    const restaurant_id = req.params.restaurantId
    try {
      let favorite = await Favorite.findOne({ where: { UserId: user_id, RestaurantId: restaurant_id } })
      await favorite.destroy()

      return res.redirect('back')
    } catch (e) {
      console.warn(e)
    }
  },

  //Like
  addLike: async (req, res) => {
    const user_id = getUser(req).id
    const restaurant_id = req.params.restaurantId
    try {
      await Like.create({
        UserId: user_id,
        RestaurantId: restaurant_id
      })

      return res.redirect('/restaurants')
    } catch (e) {
      console.warn(e)
    }
  },
  removeLike: async (req, res) => {
    const user_id = getUser(req).id
    const restaurant_id = req.params.restaurantId
    try {
      let like = await Like.findOne({ where: { UserId: user_id, RestaurantId: restaurant_id } })
      await like.destroy()

      return res.redirect('/restaurants')
    } catch (e) {
      console.warn(e)
    }
  },
  getTopUser: async (req, res) => {
    try {
      let users = await User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ]
      })

      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: getUser(req).Followings.map(d => d.id).includes(user.id)
      }))

      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)

      const currentPage = 'topUser'

      return res.render('topUser', { users, currentPage })
    } catch (e) {
      console.warn(e)
    }
  },
  addFollowing: async (req, res) => {
    const user_id = getUser(req).id
    const following_id = req.params.userId
    try {
      await Followship.create({
        followerId: user_id,
        followingId: following_id
      })

      return res.redirect('/users/top')
    } catch (e) {
      console.warn(e)
    }
  },
  removeFollowing: async (req, res) => {
    const user_id = getUser(req).id
    const following_id = req.params.userId
    try {
      let followShip = await Followship.findOne({
        where: {
          followerId: user_id,
          followingId: following_id
        }
      })

      await followShip.destroy()
      return res.redirect('/users/top')
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = userController