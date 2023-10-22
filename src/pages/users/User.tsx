import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserRegister from "./UserRegister";
import UserLogin from "./UserLogin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Row, Col } from "react-bootstrap";

interface IUser {
  status: string;
}

const User: React.FC<IUser> = () => {
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
      navigate("/poslovi");
    }, 2000);
  };
  return (
    <section className="user">
      <Container>
        <Row>
          <Col md={5} lg={5} className="company__form">
            <ToastContainer position="top-center" autoClose={3000} />
            {!showingForm && (
              <Col md={5} lg={5} className="company__form-inner">
                <div className="company__form-wrapper">
                  <h1>Prijava</h1>
                  <UserLogin
                    changeShowingForm={changeShowingForm}
                    handleToastError={handleToastError}
                    handleToastSuccess={handleToastSuccess}
                  />
                </div>
              </Col>
            )}
            {showingForm && (
              <Col md={6} lg={6} className="company__form-register--wrapper">
                <div className="company__form-wrapper">
                  <h1>Registracija</h1>
                  <UserRegister
                    changeShowingForm={changeShowingForm}
                    handleToastError={handleToastError}
                    handleToastSuccess={handleToastSuccess}
                  />
                </div>
              </Col>
            )}
          </Col>
          {!showingForm && (
            <Col md={6} lg={6} className="user__testimonial-wrapper">
              <div className="user__testimonial">
                <p className="user__testimonial-paragraph">
                  Već na početku školovanja uvidio sam kako ne postoji niti
                  jedno centralno mjesto na internetu koje okuplja stručnjake
                  strojarske struke i prepoznao sam priliku u tome za stvaranje
                  koristi društvu u kojem živim i s kojim sam okružen
                </p>
                <p className="user__testimonial-author">
                  Filip Rubes, osnivač mech.io-a
                </p>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default User;
