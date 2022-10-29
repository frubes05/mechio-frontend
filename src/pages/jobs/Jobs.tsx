import React, { useEffect, useState, useContext } from "react";
import { IJobs } from "./Jobs.types";
import { AuthContext } from "../../context/AuthContext";
import { ICompanyToken, ICompany } from "../companies/Company.types";
import JobsList from "./JobsList";
import LoadingSpinner from "../../components/LoadingSpinner";

import useFetch from "../../hooks/useFetch";
import JobMain from "./JobMain";
import JobsRegister from "./JobsRegister";
import Filter from "../../components/Filter";
import { filteringService } from "../../services/filtering";
import { Container, Row, Col } from "react-bootstrap";

interface IJob {
  status: string;
}

const Jobs: React.FC<IJob> = ({ status }) => {
  const { state } = useContext(AuthContext);
  const [selectedJobs, setSelectedJobs] = useState<IJobs[] | []>([]);
  const [token, setToken] = useState<ICompanyToken>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [postsPerPage, setPostsPerPage] = useState<number>(6);

  const getJobs = useFetch({
    url: "http://localhost:9000/poslovi",
    method: "get",
    onSuccess: (data) => {
      setJobs(data);
      setSelectedJobs(data);
    },
    onError: (error) => {},
  });

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const getAllSelected = (filterOptions: IJobs[]) => {
    setSelectedJobs(filteringService(filterOptions, jobs));
  };

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
      {selectedJobs.length === 0 && (
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
      {selectedJobs.length > 0 && <JobsList jobs={selectedJobs}></JobsList>}
      {status === "Pending" && <LoadingSpinner></LoadingSpinner>}
    </main>
  );
};

export default Jobs;
