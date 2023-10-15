const stripe = require('stripe')(process.env.SECRET_KEY)
const Order = require("../../../models/order")
const moment = require('moment')

function orderController() {
    return {

       async index(req, res){

            try {
                const orders = await Order.find({ customerId: req.user._id }, null, { sort: { createdAt : -1 } })

                req.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0' )

                return res.render('customer/orders', { orders, moment: moment })
            } catch (error) {
                console.log(error, 'order index')
            }


        },

        async store(req,res){
            try {
                
                const { address, phone, paymentType, stripeToken } = req.body
                // validate request
                if(!address || !phone){
                    // req.flash('error', 'All fields are required')
                    // return res.redirect('/cart')
                    return res.status(422).json({message: 'All fields are required'})

                }
    
                const order = new Order({
                    customerId: req.user._id,
                    items: req.session.cart.items,
                    phone,
                    address,
                })
    
                
                const result = await order.save()
                const placedOrder = await Order.populate(result, { path: 'customerId' })

                // req.flash('success', 'Order placed successfully')


                // Get client secret for stripe checkout page
                if(paymentType === 'card'){
                    console.log(req.session.cart.totalPrice, stripeToken)

                   const paymentIntent =  await stripe.paymentIntents.create({
                        amount: req.session.cart.totalPrice * 100,
                        currency: 'inr',
                        shipping : {
                            address: {
                                city: 'Kakrahti'
                            },
                            name : 'surya'
                        },
                        description: `Order id ${placedOrder._id}`,
                        automatic_payment_methods : {
                            enabled: true
                        }
                    })

                    console.log(paymentIntent)
                    
                    return res.send({
                    clientSecret: paymentIntent.client_secret,
                    });
                   
                }
                

                // emit
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderPlaced',  placedOrder)
              
                delete req.session.cart

                return res.status(200).json({message: 'Order placed successfully'})

                // return res.redirect('/orders')

                
            } catch (error) {
                req.flash('error', 'Something went wrong')
                // return res.redirect('/cart')
            }

            

        },

        async show(req, res){
            try {
                const order = await Order.findById(req.params.id)
                console.log(order, 'order')
                // authorize user
                if(req.user._id.toString() === order.customerId.toString()){
                    return res.render('customer/singleOrder', { order })
                }
            } catch (error) {
               console.log(error,'error>>>>>>>>>') 
            }
        }
    }
}

module.exports = orderController