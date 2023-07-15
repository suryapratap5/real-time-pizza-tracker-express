const Order = require("../../../models/order")

function adminOrderController() {
    return {
        async index(req, res){
            try {
                const orders = await Order.find({ status : { $ne: 'completed' } }, null, {sort : { 'createdAt' : -1  } }).populate('customerId', '-password')

               
                if(req.xhr){
                    return res.json(orders)
                }else{
                    return res.render('admin/orders')

                }
                
            } catch (error) {
                console.log(error, 'admin orders')
            }
        }
    }
}

module.exports = adminOrderController
