import React, { FC, useEffect, useState, useContext } from "react";
import { IJobs } from "./Jobs.types";
import { Link } from "react-router-dom";
import { Button, Container, Row } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { ICompanyToken } from "../companies/Company.types";
import JobsList from "./JobsList";
import LoadingSpinner from "../../components/LoadingSpinner";
import Paginate from "../../components/Paginate";
import { IoMdAddCircle } from "react-icons/io";

import useFetch from "../../hooks/useFetch";
import JobMain from "./JobMain";
import JobsRegister from "./JobsRegister";
import Filter from "../../components/Filter";
import { filteringService } from "../../services/filtering";

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
    url: "https://mechio-api-test.onrender.com/poslovi",
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
      ></Filter>
      {selectedJobs.length > 0 && <JobsList jobs={selectedJobs}></JobsList>}
      {status === "Pending" && <LoadingSpinner></LoadingSpinner>}
    </main>
  );
};

export default Jobs;
