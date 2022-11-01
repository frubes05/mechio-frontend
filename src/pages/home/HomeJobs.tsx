import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { IJobs } from "../jobs/Jobs.types";
import useFetch from "../../hooks/useFetch";

import Carousel from "../../components/Carousel";
import LoadingSpinner from "../../components/LoadingSpinner";

const HomeJobs = () => {
  const [jobs, setJobs] = useState<IJobs[] | []>([]);

  const getJobs = useFetch({
    url: "https://mechio-test.onrender.com/poslovi",
    method: "get",
    onSuccess: (data) => {
      setJobs(data.slice(-8));
      getJobs.handleFetch("https://mechio-test.onrender.com/poslovi");
    },
    onError: (err) => {},
  });  

  return (
    <div className="home__jobs">
      <Container>
        <h5>Relevantni poslovi u strojarstvu</h5>
        <h2 className="home__jobs-title">Posljednje dodani poslovi</h2>
      </Container>
      <Carousel jobs={jobs}></Carousel>
    </div>
  );
};

export default HomeJobs;
