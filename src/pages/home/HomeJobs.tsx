import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import Carousel from "../../components/Carousel";

const HomeJobs = () => {

  return (
    <div className="home__jobs">
      <Container>
        <h2 className="home__jobs-title">Posljednje dodani poslovi</h2>
      </Container>
      <Carousel></Carousel>
    </div>
  );
};

export default HomeJobs;
