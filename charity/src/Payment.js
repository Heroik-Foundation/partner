import React, { Fragment, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import banner from "./assets/banner.png";

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setLoader] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      return;
    }

    setLoader(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/donations/one-time-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(props.formData),
        }
      );

      const { clientSecret } = await response.json();

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: "http://football.hiroek.io/success",
        },
      });

      setLoader(false);

      if (error) {
        setErrorMessage(error.message);
      } else {
      }
    } catch (err) {
      setLoader(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <img src={banner} alt="banner image" className="w-full rounded-md" />
      <div className="mb-4">
        <div className="flex justify-between border-gray-300 border-b">
          <div className="w-full py-5 px-1">Donation Amount: </div>
          <div className=" w-full py-5 px-1 text-right">
            £{props.formData.amount}
          </div>
        </div>
        <div className="flex justify-between border-gray-300 border-b">
          <div className="w-full py-5 px-1">System Fee: </div>
          <div className=" w-full py-5 px-1 text-right">£0.5</div>
        </div>
        <div className="flex justify-between border-gray-300 border-b">
          <div className="w-full py-5 px-1">Payment Processor Fee: </div>
          <div className=" w-full py-5 px-1 text-right">
            £{props.paymentFee}
          </div>
        </div>
        <div className="flex justify-between border-gray-300">
          <div className="w-full py-5 px-1 text-lg font-medium">Total: </div>
          <div className=" w-full py-5 px-1 text-right text-lg font-medium">
            £{props.finalAmount}
          </div>
        </div>
      </div>
      {confirmed ? (
        <Fragment>
          <PaymentElement />

          <button
            className="px-10 py-3 my-3 mx-auto rounded-lg w-full bg-purple-700 font-medium text-sm text-white"
            type="submit"
            disabled={!stripe || !elements || isLoading}
          >
            Finalize
          </button>

          {errorMessage && <div>{errorMessage}</div>}
        </Fragment>
      ) : (
        <button
          className="px-10 py-3 my-3 rounded-lg w-full text-center  bg-purple-700 font-medium text-sm text-white"
          onClick={() => {
            setConfirmed(true);
          }}
        >
          Confirm
        </button>
      )}
    </form>
  );
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);

const Payment = (props) => {
  const amount = props.payload.amount;
  const fee = 50; // 0.5 gbp
  const percentageToAdd = (amount * 10) / 100;
  const amountInPounds = amount * 100;
  const newAmount = amountInPounds + percentageToAdd * 100 + fee;

  const options = {
    mode: "payment",
    payment_method_types: ["card"],
    currency: "gbp",
    amount: parseInt(newAmount),

    appearance: {},
  };
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        formData={props.payload}
        finalAmount={parseInt(newAmount) / 100}
        paymentFee={percentageToAdd}
      />
    </Elements>
  );
};

export default Payment;
