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
            <h2 className="jobs__register-title">
              Obavite registraciju kako biste mogli dodati recenziju
            </h2>
            <NavLink to={"/posloprimci"}>
              <Button>Registracija</Button>
            </NavLink>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default JobsRegister;
