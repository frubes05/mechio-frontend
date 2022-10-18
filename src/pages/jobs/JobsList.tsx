import React, { FC, useEffect, useState } from "react";
import { IJobsList } from "./Jobs.types";
import Job from "./Job";
import { Col, Row } from "react-bootstrap";

const JobsList: FC<IJobsList> = ({ jobs }) => {
  return (
    <ul className="jobs__list">
      <Row>
      {jobs.length > 0 &&
        jobs.map((job, i) => (
          <Col key={i} xlg={4} lg={4} md={6} sm={12} className="jobs__list-column">
            <li key={i} className="jobs__list-item">
              <Job job={job}></Job>
            </li>
          </Col>
        ))}
        </Row>
    </ul>
  );
};

export default JobsList;
