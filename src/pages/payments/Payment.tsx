import React, { useState, useContext, useEffect, lazy } from "react";
import Button from "react-bootstrap/Button";
import StripeContainer from "./StripeContainer";
import { IUserToken } from "../users/User.types";
import { ICompanyToken } from "../companies/Company.types";
import { AuthContext } from "../../context/AuthContext";

const ModalForm = lazy(() => import('../../components/Modal'));

const Payment: React.FC<{ option: string, isSelected: boolean }> = ({ option, isSelected }) => {
  const [show, setShow] = useState<boolean>(false);
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<(ICompanyToken & IUserToken) | null>(null);

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const handleClose = () => setShow(false);

  return (
    <>
    <Button className={`payments__payment ${isSelected ? 'payments__payment--selected' : ''}`} onClick={() => option === 'premium' ? setShow(true) : setShow(false)}>
      {option === "standard" && (
        <>
          <span className="payments__pill">Standard</span>
          <div className="payments__logo">
            <span>0</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M19 16.166c0-3.529-3.023-4.962-6-6.255v-4.653c1.42.052 2.85.453 4.16.914l.725-3.295c-1.814-.551-3.438-.803-4.885-.841v-2.036h-2v2.134c-3.891.535-5.969 2.975-5.969 5.7 0 3.857 3.558 5.126 5.969 5.919v4.712c-1.706-.019-3.592-.62-5.091-1.202l-.909 3.288c1.787.923 3.931 1.417 6 1.453v1.996h2v-2.105c3.312-.464 6.005-2.293 6-5.729zm-8-10.643v3.482c-1.611-.921-1.678-2.771 0-3.482zm2 12.601v-3.591c1.841 1.065 1.605 2.864 0 3.591z" />
            </svg>
          </div>
          <h2>Paket:</h2>
          <div className="payments__info">
            <span>Oglašavanje</span>
            <span>Pregled prijava</span>
          </div>
        </>
      )}
      {option === "premium" && (
        <>
          <span className="payments__pill payments__pill--premium">
            Premium
          </span>
          <div className="payments__logo payments__logo--premium">
            <span>10</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M19 16.166c0-3.529-3.023-4.962-6-6.255v-4.653c1.42.052 2.85.453 4.16.914l.725-3.295c-1.814-.551-3.438-.803-4.885-.841v-2.036h-2v2.134c-3.891.535-5.969 2.975-5.969 5.7 0 3.857 3.558 5.126 5.969 5.919v4.712c-1.706-.019-3.592-.62-5.091-1.202l-.909 3.288c1.787.923 3.931 1.417 6 1.453v1.996h2v-2.105c3.312-.464 6.005-2.293 6-5.729zm-8-10.643v3.482c-1.611-.921-1.678-2.771 0-3.482zm2 12.601v-3.591c1.841 1.065 1.605 2.864 0 3.591z" />
            </svg>
          </div>
          <h2>Paket:</h2>
          <div className="payments__info">
            <span>Oglašavanje</span>
            <span>Pregled prijava</span>
            <span>Napredna Analitika</span>
            <span>Premium oglasi</span>
            <span>Pretraživanje korisnika</span>
          </div>
        </>
      )}
    </Button>
    {option === 'premium' && (!state.companyPremium || !token?.companyPremium) && 
    <ModalForm title="Plaćanje" classname="payment" show={show} setShow={setShow} handleClose={handleClose}>
      <StripeContainer></StripeContainer>
    </ModalForm>
    }
    </>
  );
};

export default Payment;
