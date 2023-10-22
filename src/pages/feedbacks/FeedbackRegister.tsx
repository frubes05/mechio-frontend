import { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ICompanyToken } from "../companies/Company.types";
import { IUserToken } from "../users/User.types";

const JobsRegister = () => {
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<ICompanyToken & IUserToken>();

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  return (
    <>
      {!token?.company && !state.company && !token?.user && !state.user && (
        <section className="jobs__register">
          <Container>
            <Row>
              <Col md={8} lg={8} xlg={8}>
                <article>
                  <h5 className="jobs__register-subtitle">
                    Još niste registrirani ?
                  </h5>
                  <h2 className="jobs__register-title">
                    Obavite registraciju kako biste mogli ostaviti recenziju o tvrtki
                  </h2>
                  <div className="jobs__register-buttons">
                    <NavLink to={"/poslodavci"}>Poslodavci</NavLink>
                    <NavLink to={"/posloprimci"}>posloprimci</NavLink>
                  </div>
                </article>
              </Col>
            </Row>
          </Container>
        </section>
      )}
      {(token?.company || state.company) && (
        <div className="jobs__videos">
          <video autoPlay muted loop className="jobs__videos-video">
            <source src="/assets/video.mp4" type="video/mp4"></source>
          </video>
          <div className="jobs__videos-overlay"></div>
        </div>
      )}
      {(token?.user || state.user) && (
        <div className="jobs__videos">
          <video autoPlay muted loop className="jobs__videos-video">
            <source src="/assets/video2.mp4" type="video/mp4"></source>
          </video>
          <div className="jobs__videos-overlay"></div>
        </div>
      )}
    </>
  );
};

export default JobsRegister;
