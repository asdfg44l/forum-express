const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const db = require('./models')
const { urlencoded } = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('passport')
const usePassport = require('./config/passport')
const hbsHelpers = require('./utils/handlebarsHelpers')

const port = 3000

//view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: hbsHelpers }))
app.set('view engine', 'hbs')

//bodyParser
app.use(urlencoded({ extended: true }))
app.use(methodOverride('_method'))
//session
app.use(session({
  secret: 'GreenFrog',
  resave: false,
  saveUninitialized: true
}))

//usePassport
usePassport(app)

//flash
app.use(flash())

//listening
app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use((req, res, next) => {
  const isAdmin = () => {
    let isAdminPath = req.path.includes('/admin/')
    let haveAdmin = req.user ? req.user.isAdmin : false
    return isAdminPath && haveAdmin
  }
  res.locals.isAdmin = isAdmin()
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  return next()
})

require('./routes')(app, passport)

module.exports = app
