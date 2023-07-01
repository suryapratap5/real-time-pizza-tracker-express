const authController = require("../app/http/controllers/authController")
const cartController = require("../app/http/controllers/customers/cartController")
const homeController = require("../app/http/controllers/homeController")

function initRoutes(app) {

    app.get('/', homeController().index)

    
    app.get('/login', authController().login)

    app.post('/login', authController().postLogin)

    app.post('/logout', authController().logout)
    
    app.get('/register', authController().register)

    app.post('/register', authController().postRegister)
    
    app.get('/cart', cartController().index)

    app.post('/update-cart', cartController().update)
}


module.exports = initRoutes






