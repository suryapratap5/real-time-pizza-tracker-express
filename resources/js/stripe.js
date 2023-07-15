import axios from "axios";
import Noty from 'noty'
import moment from "moment";
import { loadStripe } from '@stripe/stripe-js';
import { placeOrder } from "./apiService";

async function initStripe() {

    
    const stripe = await loadStripe('pk_test_51MxrccSB1UP4F9lf1ICZv0KxjhJyua2773WvyvzZHIYZqJERfXI0jcmOCYCgg2FixidiqrK6s407fZvS7KW2GK0H000V9MNAmr');

    let card = null;
    
    function mountWidget(){
        let style = {
            base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
            },
            invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
            }
        };
          const element = stripe.elements()
      
           card = element.create('card', {style, hidePostalCode: true})
      
          card.mount('#cardElement')
      
    }
    
    const paymentType = document.querySelector('#paymentType')

    if(!paymentType){
        return 
    }

    paymentType.addEventListener('change', (e) => {
        let type = e.target.value
        if (type === 'card') {
            // Dispay widget
            mountWidget()

        } else {
            card.destroy()
        }
    })

    // ajax call
    const paymentForm = document.querySelector('#paymentForm')
    if (paymentForm) {

        paymentForm.addEventListener('submit', async(e) => {
            e.preventDefault()
            let formData = new FormData(paymentForm)
            let formObject = {}
            for (const [key, value] of formData.entries()) {
                formObject[key] = value
            }

            console.log(formObject, 'object')
            if(!card){
                // ajax
                placeOrder(formObject)
                return

            }

            // varify card
             stripe.createToken(card)
                .then((result) => {
                    formObject.stripeToken = result.token.id
                    placeOrder(formObject)

                })
                .catch((err) => console.log(err, 'err'))
            


        })

    }

}

export default initStripe