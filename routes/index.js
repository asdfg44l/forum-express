const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
  //rest
  app.get('/', (req, res) => {
    return res.redirect('/restaurants')
  })
  app.get('/restaurants', restController.getRestaurants)

  //admin
  app.get('/admin', (req, res) => {
    return res.redirect('/admin/restaurants')
  })
  app.get('/admin/restaurants', adminController.getRestaurants)

  //user
  app.get('/users/signUp', userController.signUpPage)
  app.post('/users/signUp', userController.signUp)

  //auth
  app.get('/users/signIn', userController.signInPage)
  app.post('/users/signIn',
    passport.authenticate('local', {
      successRedirect: '/restaurants',
      failureRedirect: '/users/signIn'
    })
  )
  app.get('/users/logout', userController.logout)
}