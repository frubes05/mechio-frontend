import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { IJobs } from "../jobs/Jobs.types";
import useFetch from "../../hooks/useFetch";

import Carousel from "../../components/Carousel";

const HomeJobs = () => {
  const [jobs, setJobs] = useState<IJobs[] | []>([]);

  const getJobs = useFetch({
    url: "https://mechio-api-test.onrender.com/poslovi",
    method: "get",
    onSuccess: (data) => {
      if (data) {
        setJobs(data.slice(-8));
      }
      if (localStorage.getItem('initial') === 'true') {
        getJobs.handleFetch("https://mechio-api-test.onrender.com/poslovi");
        localStorage.removeItem('initial');
      }
    },
    onError: (err) => {},
    onInit: true
  });  

  return (
    <div className="home__jobs">
      <Container>
        <h5>Kratak uvid u dio ponude poslova</h5>
        <h2 className="home__jobs-title">Posljednje dodano</h2>
      </Container>
      <Carousel jobs={jobs}></Carousel>
    </div>
  );
};

export default HomeJobs;
