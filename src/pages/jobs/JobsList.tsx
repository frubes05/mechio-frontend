import React, { FC, useEffect, useState } from "react";
import { IJobs, IJobsList } from "./Jobs.types";
import Job from "./Job";
import { Container, Col, Row } from "react-bootstrap";
import Filter from "../../components/Filter";
import { filteringService } from "../../services/filtering";

const JobsList: FC<IJobsList> = ({ jobs }) => {
  return (
    <ul className="jobs__list" id="jobs-list">
      <Container>
        <Row>
          {jobs.length > 0 &&
            jobs.map((job, i) => (
              <Col
                key={i}
                xlg={3}
                lg={3}
                md={6}
                sm={12}
                className="jobs__list-column"
              >
                <li key={i} className="jobs__list-item">
                  <Job job={job}></Job>
                </li>
              </Col>
            ))}
        </Row>
      </Container>
    </ul>
  );
};

export default JobsList;
