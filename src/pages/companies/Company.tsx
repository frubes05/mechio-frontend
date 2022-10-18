import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyLogin from "./CompanyLogin";
import CompanyRegister from "./CompanyRegister";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "../../components/LoadingSpinner";

const Company = () => {
  const navigate = useNavigate();
  const [showingForm, setShowingForm] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  const changeShowingForm = () => {
    setShowingForm(!showingForm);
  };

  
  const handleToastError = (message: string) => toast.error(message, {autoClose: 2000});
  const handleToastSuccess = (message: string) => {
    toast.success(message, {autoClose: 2000});
    setTimeout(() => {
      navigate('/poslovi')
    }, 4000)
}

  return (
      <section className="company">
        <div className="company__container">
          <video className="company__video" autoPlay loop muted playsInline>
            <source src="./media/video2.mp4"></source>
          </video>
        </div>
        <div className="company__wrapper">
          <div className="company__form">
            <ToastContainer position="top-center" autoClose={3000} />
            {!showingForm && (
              <div className="company__form-wrapper">
                <h1>Prijava</h1>
                <CompanyLogin changeShowingForm={changeShowingForm}
                  handleToastError={handleToastError}
                  handleToastSuccess={handleToastSuccess}></CompanyLogin>
              </div>
            )}
            {showingForm && (
              <div className="company__form-wrapper">
                <h1>Registracija</h1>
                <CompanyRegister changeShowingForm={changeShowingForm}
                  handleToastError={handleToastError}
                  handleToastSuccess={handleToastSuccess}></CompanyRegister>
              </div>
            )}
          </div>
        </div>
      </section>
  );
};

export default Company;
