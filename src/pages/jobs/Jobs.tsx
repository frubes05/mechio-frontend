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

interface IJob {
  status: string;
}

const Jobs: React.FC<IJob> = ({ status }) => {
  const { state } = useContext(AuthContext);
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

  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setJobs((prev) => prev.slice(indexOfFirstPost, indexOfLastPost));
  }, []);

  const getMaxNumbers = Math.ceil(jobs.length / postsPerPage);
  const getPageNumbers = [];

  for (let i = 1; i <= getMaxNumbers; i++) {
    getPageNumbers.push(i);
  }

  const paginate = (num: number) => {
    setCurrentPage(num);
  };

  return (
    <main className="jobs">
      <JobMain></JobMain>
      <JobsRegister/>
      <div className="jobs__wrapper">
        <div className="jobs__options">
          {(token?.company || state.company) && (
            <Link to={"/poslovi/novi-oglas"}>
              <Button variant="success">
                <span>Dodaj novi oglas</span>
                <IoMdAddCircle />
              </Button>
            </Link>
          )}
        </div>
      </div>
      {jobs && jobs.length > 0 && <JobsList jobs={jobs}></JobsList>}
      <Paginate getPageNumbers={getPageNumbers} paginate={paginate}></Paginate>
      {status === "Pending" && <LoadingSpinner></LoadingSpinner>}
    </main>
  );
};

export default Jobs;
