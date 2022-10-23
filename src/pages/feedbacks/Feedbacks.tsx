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
import { IUserToken } from "../users/User.types";

import useFetch from '../../hooks/useFetch';
import FeedbackCompanies from "./FeedbackCompanies";
import FeedbackMain from "./FeedbackMain";
import FeedbackRegister from "./FeedbackRegister";

import Filter from "../../components/Filter";
import { filteringService } from "../../services/filtering";

interface IFeedbacks {
  status: string;
}

const Feedbacks: React.FC<IFeedbacks> = ({ status }) => {
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<ICompanyToken & IUserToken>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [companies, setCompanies] = useState<ICompany[] | []>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<ICompany[] | []>([]);

  const getCompanies = useFetch({
    url: "https://mechio-api-test.onrender.com/poslodavci",
    method: 'get',
    onSuccess: (data) => {
      setCompanies(data);
      setSelectedCompanies(data);
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

  const getAllSelected = (filterOptions: ICompany[]) => {
    setSelectedCompanies(filteringService(filterOptions, companies));
  };

  const resetSelected = () => setSelectedCompanies(companies);

  return (
    <main className="feedbacks">
      <FeedbackMain />
      {(!state.company || !token?.company) && <FeedbackRegister />}
      <Filter filterOptions={[
          { en: "companyName", hr: "Tvrtka" },
          { en: "companyAddress", hr: "Lokacija" },
        ]}
        jobs={companies}
        getAllSelected={getAllSelected}
        resetSelected={resetSelected}
        title={'Odaberite tvrtku koja vas zanima'} />
      {companies.length > 0 && <FeedbackCompanies companies={selectedCompanies}/>}
      {status === 'Pending' && <LoadingSpinner></LoadingSpinner>}
    </main>
  );
};

export default Feedbacks;
