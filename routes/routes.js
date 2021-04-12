const express = require('express')
const router = express.Router()

const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const passport = require('passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

//rest
router.get('/', authenticated, (req, res) => {
  return res.redirect('/restaurants')
})
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)

//favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

//like
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

//follow
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

//admin
router.get('/admin', authenticatedAdmin, (req, res) => {
  return res.redirect('/admin/restaurants')
})
//admin
//admin-restaurant
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurat)
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
//admin-users
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

//user
router.get('/users/signUp', userController.signUpPage)
router.post('/users/signUp', userController.signUp)

//top
router.get('/users/top', authenticated, userController.getTopUser)

//auth
router.get('/users/signIn', userController.signInPage)
router.post('/users/signIn',
  passport.authenticate('local', {
    successRedirect: '/restaurants',
    failureRedirect: '/users/signIn'
  })
)
router.get('/users/logout', userController.logout)

//profile
router.get('/users/:id', userController.getUser)
router.get('/users/:id/edit', userController.editUser)
router.put('/users/:id', upload.single('image'), userController.putUser)

//category
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

//comment
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

module.exports = router