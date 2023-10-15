require('dotenv').config()
const express = require('express')
var expressLayouts = require('express-ejs-layouts');
const app = express();
const path = require('path') 
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo');
const passport = require('passport')
const initRoutes = require('./routes/web')
const paymentRoute = require('./routes/payment')
const Emitter = require('events')

const port = process.env.PORT || 3000

// database connection
const DB_URL = 'mongodb://localhost:27017/pizza'

main().then(()=>console.log('connection successful...')).catch(err=>console.log('connection unsuccessful...', err.message))

async function main(){
    await mongoose.connect(DB_URL)
    // const connection = mongoose.connection;
    // console.log(connection,'connection')
  
}

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoDbStore.create({
        mongoUrl: DB_URL
    }),
    cookie: { maxAge: 1000* 60 * 60 * 24}

}))

// passport 
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Global middleware
app.use((req, res, next) => {
    
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})
// set template engine
app.set('view engine', 'ejs')
// console.log(app.get('view engine'))
// set views path
app.set('views', path.resolve(__dirname, 'resources/views'))
app.use(expressLayouts)

// call initRoutes function for web related routes
initRoutes(app)

app.use(paymentRoute)


const server = app.listen(port, () =>{
    console.log(`Server is listening on http://localhost:${port}`)
})


// socket 
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    console.log('socket connected', socket.id)

    // join
    socket.on('join', (orderId) =>{
        console.log(orderId, 'orderId')
        socket.join(orderId)
    })

})

eventEmitter.on('orderUpdated', (data) =>{
    console.log(`order_${data.id}`, '`order_${data.id}`')
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) =>{
    io.to('adminRoom').emit('orderPlaced', data)
})


