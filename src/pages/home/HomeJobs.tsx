import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import Carousel from "../../components/Carousel";

const HomeJobs = () => {

  return (
    <div className="home__jobs">
      <Container>
        <h5>Relevantni poslovi u strojarstvu</h5>
        <h2 className="home__jobs-title">Posljednje dodani poslovi</h2>
      </Container>
      <Carousel></Carousel>
    </div>
  );
};

export default HomeJobs;
