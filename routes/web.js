const adminOrderController = require("../app/http/controllers/admin/orderController")
const statusController = require("../app/http/controllers/admin/statusController")
const authController = require("../app/http/controllers/authController")
const cartController = require("../app/http/controllers/customers/cartController")
const orderController = require("../app/http/controllers/customers/orderController")
const homeController = require("../app/http/controllers/homeController")
const admin = require("../app/http/middlewares/admin")
const auth = require("../app/http/middlewares/auth")
const guest = require("../app/http/middlewares/guest")

function initRoutes(app) {

    app.get('/', homeController().index)

    
    app.get('/login',guest, authController().login)

    app.post('/login', authController().postLogin)

    app.post('/logout', authController().logout)
    
    app.get('/register',guest, authController().register)

    app.post('/register', authController().postRegister)
    
    app.get('/cart', cartController().index)

    app.post('/update-cart', cartController().update)

    
    // Customers routes
    app.post('/orders',auth, orderController().store)

    app.get('/orders', auth ,orderController().index)

    app.get('/orders/:id', auth ,orderController().show)

    // Admin routes

    app.get('/admin-orders', admin ,adminOrderController().index)

    app.post('/admin-order/status', admin ,statusController().update)


}


module.exports = initRoutes






