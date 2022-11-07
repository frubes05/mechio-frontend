import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast, ToastContainer } from "react-toastify";
import { IUserToken } from "../users/User.types";
import { ICompanyToken } from "../companies/Company.types";


const Payments = () => {
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<(ICompanyToken & IUserToken) | null>(null);
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const getPayment = useFetch({
    url: 'http://localhost:9000/placanja',
    method: 'post',
    onSuccess: (data) => {
      toast.success('Odabrali ste premium paket!', { autoClose: 1000 });
      if (data.success) setSuccess(true);
      navigate('/poslovi');
    },
    onError: (err) => {
      console.log(err);
    },
    onInit: false
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe!.createPaymentMethod({
      type: "card",
      card: elements!.getElement(CardElement) as any,
    });
    if (!error) {
      try {
        const { id } = paymentMethod;
        if (state.company || token?.company) {
          await getPayment.handleFetch(`http://localhost:9000/placanja`, {
            amount: 1000,
            id,
            companyId: (state._id || token?._id)
          });
        }
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      console.log(error.message);
    }
  };

  return <>
      {getPayment.status === 'Pending' && <LoadingSpinner></LoadingSpinner>}
      <ToastContainer position="top-center" autoClose={3000} />
      {!success && 
      <form className="payment-form" onSubmit={handleSubmit} style={{background: 'lightblue'}}>
        <fieldset>
          <CardElement></CardElement>
        </fieldset>
        <button>Pay</button>
      </form>}
    </>;
};

export default Payments;
