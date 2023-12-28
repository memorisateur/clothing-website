import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

import Button from "../button/button.component"
import { PaymentButton, PaymentFormContainer } from './payment-form.styles';

const PaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();

    const paymentHandler = async (e) => {
        e.preventDefault();

        if(!stripe || !elements) {
            return;
        }

    const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'post',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ amount: 10000 })
    }).then(res => res.json());

    const {paymentIntent: { client_secret }} = response;

    const paymentResult = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
                name: 'Yihua Zhang'
            }
        }
    });

    if(paymentResult.error) {
        alert(paymentResult.error);
    } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
            alert('Payment Successful')
        }
    }

    };
  return (
    <PaymentFormContainer>
        <div className="form-container" onSubmit={paymentHandler}>
            <h2>Credit Card Payment: </h2>
            <CardElement />
        <Button> Pay now </Button>
        </div>
    </PaymentFormContainer>
  )
}

export default PaymentForm;