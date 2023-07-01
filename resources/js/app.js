import axios from "axios";
import Noty from 'noty'

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