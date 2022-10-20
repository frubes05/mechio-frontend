import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const HomeAbout = () => {
  return (
    <section className="home__about">
      <Container>
        <Row>
          <Col md={12} lg={8} xlg={8}>
            <h5 className="home__about-subtitle">O nama</h5>
            <h2 className="home__about-title">Više od obične stranice</h2>
            <p className="home__about-text">
              mech.io nastao je kao odgovor na stvarnu potrebu tržišta za
              jedinstvenom aplikacijom pogodnom za korištenje svim zaposlenima u
              području strojarstva. Bilo da tražite posao ili ste poslodavac,
              mech.io pokriva vaše potrebe.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HomeAbout;
