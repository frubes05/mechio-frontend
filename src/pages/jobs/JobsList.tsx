import React, { FC, useEffect, useState } from "react";
import { IJobs, IJobsList } from "./Jobs.types";
import Job from "./Job";
import { Container, Col, Row } from "react-bootstrap";
import Filter from "../../components/Filter";
import { filteringService } from "../../services/filtering";

const JobsList: FC<IJobsList> = ({ jobs }) => {
  const [selectedJobs, setSelectedJobs] = useState<IJobs[]>(jobs);

  const getAllSelected = (filterOptions: IJobs[]) => {
    setSelectedJobs(filteringService(filterOptions, jobs));
  };

  const resetSelected = () => setSelectedJobs(jobs);

  return (
    <ul className="jobs__list">
      <Container>
        <Row>
          <Col xlg={8} lg={8} md={8}>
            <h5 className="jobs__list-subtitle">Filtriranje mogućnosti</h5>
            <h2 className="jobs__list-title">
              Odaberite posao prema vašim afinitetima
            </h2>
          </Col>
          {jobs && (
            <>
            <Filter
              filterOptions={[
                { en: "company", hr: "Tvrtka" },
                { en: "location", hr: "Lokacija" },
                { en: "position", hr: "Pozicija" },
                { en: "seniority", hr: "Senioritet" },
              ]}
              jobs={jobs}
              getAllSelected={getAllSelected}
              resetSelected={resetSelected}
            ></Filter>
            </>
          )}
          {selectedJobs.length > 0 &&
            selectedJobs.map((job, i) => (
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
