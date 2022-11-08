import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const PUBLIC_KEY =
  "pk_test_51M1ZvWBtfZhO1ByQ7yaYEO2gwPZuZV5OpR6C3UeYAu1i4MdSE7nM8cyrL37A1kIEb1zM6eTACPaUmRer8LQxgfH4004CZ9r21E";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const OPTIONS = {
  clientSecret: PUBLIC_KEY,
  appearance: {
    theme: 'night'
  }
}

const StripeContainer = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm></PaymentForm>
    </Elements>
  );
};

export default StripeContainer;
