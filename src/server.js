const express = require('express')
const morgan  = require('morgan')
const cors = require('cors')
const compression = require('compression')
const session = require('express-session')
const {sessionStore} = require('./config/sessionDB')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const showData = require('./middleware/helpers')

const app = express()
const port = process.env.PORT || 5000

// Session
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60000 * 60 //? Session expire in 1 hour
      },
      store: sessionStore, 
    })
  )

// Helper
app.use(showData)


// CORS Policy
const whiteList = ['http://localhost:3000']
app.use(cors({
  origin: whiteList,
  credentials: true,
}))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Gzip
app.use(compression(
    {
        level: 6,
        threshold: 100 * 1000,
        filter: (req, res) => {
            if(req.headers['x-no-compression']){
                return false;
            }
            return compression.filter(req, res)
        } 
    }
))

// Flash
app.use(flash());

// Override
app.use(methodOverride('_method'));


// Public
app.use(express.static(path.join(__dirname, './public')));


// Template Engine
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Logger
app.use(morgan('dev'))

// Route Init
const route = require('./routes')
route(app)

// Connect to DB
const db = require('./config/mongodb');
db.connect();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})