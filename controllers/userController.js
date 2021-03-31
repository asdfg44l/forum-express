const bcrypt = require('bcryptjs')
const { User } = require('../models')

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

  signInPage: (req, res) => {
    res.render('signIn')
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/users/signIn')
  }
}

module.exports = userController