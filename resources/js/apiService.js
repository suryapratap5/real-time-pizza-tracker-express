import axios from "axios";
import Noty from 'noty'

export function placeOrder(formObject){
    axios.post('/orders', formObject)
    .then((res) => {

        new Noty({
            type: 'success',
            text: res.data.message,
            progressBar: false,
            timeout: 1000
        }).show()
        setTimeout(() => {
            window.location.href = '/orders'
        }, 1000);
    })
    .catch(err => console.log(err))
}