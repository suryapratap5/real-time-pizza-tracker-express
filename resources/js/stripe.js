import axios from "axios";
import Noty from 'noty'
import moment from "moment";
import { placeOrderWithCard } from "./apiService";

async function initCheckout() {
    
    const paymentType = document.querySelector('#paymentType')
    if(!paymentType){
        return 
    }
    let card = false;
    paymentType.addEventListener('change', (e) => {
        let type = e.target.value
        if (type === 'card') {
            card = true
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

            if(card){
                placeOrderWithCard(formObject)
            }



        })

    }

}

export default initCheckout