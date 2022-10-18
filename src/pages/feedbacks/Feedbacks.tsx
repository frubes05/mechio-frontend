import React, { FC, useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { ICompanyToken } from "../companies/Company.types";
import LoadingSpinner from "../../components/LoadingSpinner";
import Paginate from "../../components/Paginate";
import { IoMdAddCircle } from "react-icons/io";

import { ICompany } from "../companies/Company.types";

import useFetch from '../../hooks/useFetch';
import FeedbackCompanies from "./FeedbackCompanies";

interface IFeedbacks {
  status: string;
}

const Feedbacks: React.FC<IFeedbacks> = ({ status }) => {
  const { state } = useContext(AuthContext);
  const [firm, setFirm] = useState<string>('');
  const [token, setToken] = useState<ICompanyToken>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [companies, setCompanies] = useState<ICompany[] | []>([]);

  const getCompanies = useFetch({
    url: "https://mechio-test-api.onrender.com/poslodavci",
    method: 'get',
    onSuccess: (data) => {
      setCompanies(data);
    },
    onError: (error) => {
    }
  })

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  return (
    <main className="feedbacks">
      <Container>
        <div className="feedbacks__wrapper">
          <div className="feedbacks__options">
            <div className="feedbacks__options-wrapper">
              <h1 className="feedbacks__options-title">Tvrtke:</h1>
              <input className="feedbacks__options-select" type="text" placeholder="Pretraži tvrtke..." onChange={(e) => setFirm(e.target.value)}></input>
            </div>
            {companies.length > 0 && <FeedbackCompanies companies={companies} value={firm}/>}
          </div>
        </div>
      </Container>
      {status === 'Pending' && <LoadingSpinner></LoadingSpinner>}
    </main>
  );
};

export default Feedbacks;
