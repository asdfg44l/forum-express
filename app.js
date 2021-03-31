const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const db = require('./models')
const { urlencoded } = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const usePassport = require('./config/passport')

const port = 3000

//view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//bodyParser
app.use(urlencoded({ extended: true }))

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
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  return next()
})

require('./routes')(app, passport)

module.exports = app
