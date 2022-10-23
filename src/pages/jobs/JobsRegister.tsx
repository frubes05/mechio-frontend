import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
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
    <section className="jobs__register">
      <Container>
        <Row>
          <Col md={8} lg={8} xlg={8}>
            <h5 className="jobs__register-subtitle">
              Još niste registrirani ?
            </h5>
            {(token?.user || state.user || !token || !state) && (
              <h2 className="jobs__register-title">
                Obavite registraciju kako biste se mogli prijaviti na poslove
              </h2>
            )}
            {(token?.company || state.company) && (
              <h2 className="jobs__register-title">
                Obavite registraciju kako biste se mogli dodati svoje oglase
              </h2>
            )}
            {(token?.company || state.company) && (
              <NavLink to={"/poslodavci"}>
                <Button>Registracija</Button>
              </NavLink>
            )}
            {(token?.user || state.user || !token || !state) && (
              <NavLink to={"/posloprimci"}>
                <Button>Registracija</Button>
              </NavLink>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default JobsRegister;
