const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUp')
  },

  signUp: async (req, res) => {
    const { name, email, password } = req.body

    try {
      let user = await User.findOne({ where: { email } })
      if (user) {
        console.log('此帳號已被註冊')
        return res.render('signUp', {
          name,
          email
        })
      }
      await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      return res.redirect('/')
    } catch (e) {
      console.warn(e)
    }

  }
}

module.exports = userController