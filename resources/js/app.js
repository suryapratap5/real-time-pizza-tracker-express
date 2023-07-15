import axios from "axios";
import Noty from 'noty'
import initAdmin from "./admin";
import moment from "moment";
import initStripe from "./stripe";

let addToCart = document.querySelectorAll('.add-to-card')
let cartCounter = document.querySelector('#cartCounter')


async function updateCart(pizza) {
    try {
        const response = await axios.post('/update-cart', pizza)
        console.log(response, 'response')
        cartCounter.innerText =response.data.totalQty
        new Noty({
            type: 'success',
            text: 'Item added to cart',
            timeout: 1000
        }).show()
        
        
    } catch (error) {
        console.log(error, 'error')
        new Noty({
            type: 'error',
            text: 'Something went wrong',
            timeout: 1000
        }).show()
    }
}

addToCart.forEach((btn) =>{
    btn.addEventListener('click', () => {
        let pizza = btn.dataset.pizza;
        pizza = JSON.parse(pizza)
        updateCart(pizza)
    })
})


const alertMsg = document.querySelector('#success-alert')

if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    }, 2000);
}



// Change order status
let statuses = document.querySelectorAll('.status_line')
const hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null

order = order ? JSON.parse(order) : null

let time= document.createElement('small')

function updatedStatus(order){

    statuses.forEach((status) =>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    
    let stepCompleted = true;

    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }

        if(dataProp === order.status){
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }
    })


}

updatedStatus(order)

// payment gateway
initStripe()


// Socket

let socket = io()

// Call admin init function
initAdmin(socket)

if(order){
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
   
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updatedStatus(updatedOrder)
    new Noty({
        type: 'success',
        text: 'Order updated',
        progressBar: false,
        timeout: 1000
    }).show()
})


