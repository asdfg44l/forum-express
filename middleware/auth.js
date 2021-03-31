module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/users/signIn')
  },

  authenticatedAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next()
    }
    res.redirect('/users/signIn')
  }
}