const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')

module.exports = app => {
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
}