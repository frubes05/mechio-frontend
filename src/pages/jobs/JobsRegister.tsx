import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const JobsRegister = () => {
  return (
    <section className="jobs__register">
      <Container>
        <Row>
          <Col md={8} lg={8} xlg={8}>
            <h5 className="jobs__register-subtitle">
              Još niste registrirani ?
            </h5>
            <h2 className="jobs__register-title">
              Obavite registraciju kako biste se mogli prijaviti na poslove
            </h2>
            <NavLink to={'/posloprimci'}>
                <Button>Registracija</Button>
            </NavLink>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default JobsRegister;
