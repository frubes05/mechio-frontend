import React, { useEffect, useState } from "react";
import { IJobs } from "./Jobs.types";
import { ICompanyToken } from "../companies/Company.types";
import JobsList from "./JobsList";

import JobMain from "./JobMain";
import JobsRegister from "./JobsRegister";
import Filter from "../../components/Filter";
import { filteringService } from "../../services/filtering";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { IUserToken } from "../users/User.types";
import Advices from "../../components/Advices";
import useSWR from "swr";
import { fetcher } from "../../services/fetcher";

const Jobs: React.FC = () => {
  const [selectedJobs, setSelectedJobs] = useState<IJobs[] | []>([]);
  const [token, setToken] = useState<ICompanyToken & IUserToken>();
  const { data: jobs } = useSWR(`https://mechio-api-test.onrender.com/poslovi`, fetcher, {
    onSuccess: (data) => setSelectedJobs(data)
  });

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const getAllSelected = (filterOptions: IJobs[]) => setSelectedJobs(filteringService(filterOptions, jobs));

  const resetSelected = () => setSelectedJobs(jobs);

  return (
    <main className="jobs">
      <JobMain></JobMain>
      <JobsRegister />
      <Filter
        filterOptions={[
          { en: "company", hr: "Tvrtka" },
          { en: "location", hr: "Lokacija" },
          { en: "position", hr: "Pozicija" },
        ]}
        jobs={jobs}
        getAllSelected={getAllSelected}
        resetSelected={resetSelected}
        title={"Odaberite posao prema vašim afinitetima"}
      ></Filter>
      {selectedJobs?.length === 0 && (
        <Container>
          <Row>
            <Col xlg={8} lg={8} md={8}>
              <p className="jobs__none">
                Trenutno ne postoji posao koji zadovoljava odabrane vrijednosti
                filtriranja
              </p>
            </Col>
          </Row>
        </Container>
      )}
      {selectedJobs?.length > 0 && <JobsList jobs={selectedJobs}></JobsList>}
      <Advices></Advices>
    </main>
  );
};

export default Jobs;
