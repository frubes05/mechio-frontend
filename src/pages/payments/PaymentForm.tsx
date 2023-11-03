import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { AuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { IUserToken } from "../users/User.types";
import { ICompanyToken } from "../companies/Company.types";
import jwt_decode from "jwt-decode";
import { sendRequest } from "../../services/fetcher";
import useSWRMutation from "swr/mutation";

const Payments = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [token, setToken] = useState<(ICompanyToken & IUserToken) | null>(null);
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { trigger: paymentTrigger } = useSWRMutation(`https://mechio-api-test.onrender.com/placanja`, sendRequest, {
    onSuccess: (data) => {
      toast.success("Odabrali ste premium paket!", { autoClose: 1000 });
      if (data.success) setSuccess(true);
      if (data.token) {
        const decoded: any = jwt_decode(data.token);
        dispatch!({ type: "PAYMENT", payload: { ...decoded } });
        localStorage.setItem("decodedToken", JSON.stringify({ ...decoded }));
      }
      navigate("/poslovi");
    }
  });

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe!.createPaymentMethod({
      type: "card",
      card: elements!.getElement(CardNumberElement) as any,
    });
    if (!error) {
      try {
        const { id } = paymentMethod;
        if (state.company || token?.company) {
          const paymentInfo = { amount: 1000, id, companyId: state?._id || token?._id };
          paymentTrigger(paymentInfo);
        }
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      return;
    }
  };

  const cardHandleChange = () => {};

  const cardStyle = {
    style: {
      base: {
        color: "white",
        fontFamily: "Poppins, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          fontFamily: "Poppins, sans-serif",
          color: "#5b5c63",
        },
      },
      invalid: {
        fontFamily: "Poppins, sans-serif",
        color: "#dc3545",
        iconColor: "#dc3545",
      },
    },
    showIcon: true,
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      {!success && (
        <form className="payment-form" onSubmit={handleSubmit}>
          <CardNumberElement
            id="card-element"
            onChange={cardHandleChange}
            options={cardStyle}
          ></CardNumberElement>
          <div className="payment-form--more">
            <CardExpiryElement
              id="card-element"
              onChange={cardHandleChange}
              options={cardStyle}
            />
            <CardCvcElement
              id="card-element"
              onChange={cardHandleChange}
              options={cardStyle}
            />
          </div>
          <button className="cardButton">Plati 10$</button>
        </form>
      )}
    </>
  );
};

export default Payments;
