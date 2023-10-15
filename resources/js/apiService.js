import axios from "axios";
import Noty from 'noty'
import { loadStripe } from '@stripe/stripe-js';

let emailAddress;
export async function placeOrderWithCard(formObject){

  const stripe = await loadStripe('pk_test_51MxrccSB1UP4F9lf1ICZv0KxjhJyua2773WvyvzZHIYZqJERfXI0jcmOCYCgg2FixidiqrK6s407fZvS7KW2GK0H000V9MNAmr');
  let elements;

  try {

    
    async function initialize() {
      
      const res = await axios.post('/orders', formObject)
      const { clientSecret } = res.data

      let cardPaymentForm =  document.querySelector("#payment-form")
      cardPaymentForm.style.display = 'block'

      cardPaymentForm.addEventListener("submit", handleSubmit);

      const appearance = {
        theme: 'stripe',
      };
    
      elements = stripe.elements({ appearance, clientSecret });
    
      const linkAuthenticationElement = elements.create("linkAuthentication");
    
      linkAuthenticationElement.mount("#link-authentication-element");
    
      linkAuthenticationElement.on('change', (event) => {
        emailAddress = event.value.email;
      });
    
      const paymentElementOptions = {
        layout: "tabs",
      };
    
      const paymentElement = elements.create("payment", paymentElementOptions);
      paymentElement.mount("#payment-element");
  }
  initialize();


  
  } catch (error) {
    console.log(error, 'error')
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "http://localhost:3000/orders",
      receipt_email: emailAddress,
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}


}

checkStatus()

// Fetches the payment intent status after payment submission
async function checkStatus() {

  const stripe = await loadStripe('pk_test_51MxrccSB1UP4F9lf1ICZv0KxjhJyua2773WvyvzZHIYZqJERfXI0jcmOCYCgg2FixidiqrK6s407fZvS7KW2GK0H000V9MNAmr');
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );


  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
  console.log(paymentIntent, 'intentt')

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}







