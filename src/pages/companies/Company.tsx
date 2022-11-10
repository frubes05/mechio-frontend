import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyLogin from "./CompanyLogin";
import CompanyRegister from "./CompanyRegister";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";

interface ICompany {
  status: string;
}

const Company: React.FC<ICompany> = ({ status }) => {
  const navigate = useNavigate();
  const [showingForm, setShowingForm] = useState<boolean>(false);

  const changeShowingForm = () => {
    setShowingForm(!showingForm);
  };

  const handleToastError = (message: string) =>
    toast.error(message, { autoClose: 1000 });
  const handleToastSuccess = (message: string) => {
    toast.success(message, { autoClose: 1000 });
    setTimeout(() => {
      navigate("/placanje");
    }, 2000);
  };

  return (
    <section className="company">
      <Container>
        <Row>
          <Col md={5} lg={5} className="company__form">
            <ToastContainer position="top-center" autoClose={3000} />
            {!showingForm && (
              <Col md={5} lg={5} className="company__form-inner">
                <div className="company__form-wrapper">
                  <h1>Prijava</h1>
                  <CompanyLogin
                    changeShowingForm={changeShowingForm}
                    handleToastError={handleToastError}
                    handleToastSuccess={handleToastSuccess}
                  ></CompanyLogin>
                </div>
              </Col>
            )}
            {showingForm && (
              <Col md={5} lg={5} className="company__form-register--wrapper">
                <div className="company__form-wrapper">
                  <h1>Registracija</h1>
                  <CompanyRegister
                    changeShowingForm={changeShowingForm}
                    handleToastError={handleToastError}
                    handleToastSuccess={handleToastSuccess}
                  ></CompanyRegister>
                </div>
              </Col>
            )}
          </Col>
          {!showingForm && (
            <Col md={6} lg={6} className="company__testimonial-wrapper">
              <div className="company__testimonial">
                <p className="company__testimonial-paragraph">
                  Iskreno u početku bio sam skeptičan u vezi mech.io-a. Sve
                  druge platforme koje smo probali do sada, nisu se pokazale
                  relativno uspješnima. No, drago mi je da sad nakon već tri
                  mjeseca korištenja mogu reći kako je mech.io jedna od
                  najboljih inovacija u hrvatskoj strojarskoj industriji.
                </p>
                <p className="company__testimonial-author">
                  Ivan Ivić, CEO C.A.B grupacije
                </p>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default Company;
