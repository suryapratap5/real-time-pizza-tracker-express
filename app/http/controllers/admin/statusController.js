const Order = require("../../../models/order");

function statusController(){
    return {

        async update(req, res){
            try {

                const { orderId, status} = req.body;
                await Order.updateOne({ _id : orderId }, { status })

                // Emit event
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: orderId, status })
                
                return res.redirect('/admin-orders')
                
            } catch (error) {
                console.log(error, 'error')

            }
        }


    }
}

module.exports = statusController;