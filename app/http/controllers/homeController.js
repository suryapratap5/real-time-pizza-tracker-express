const Menu = require("../../models/menu")

function homeController(app) {

    return {
        async index(req, res, next){
            const pizzas = await Menu.find()
            return res.render('home', {
                pizzas
            })
        }
    }
    
}


module.exports = homeController

