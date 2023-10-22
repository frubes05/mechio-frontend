import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { ICompanyToken } from "../companies/Company.types";

import { ICompany } from "../companies/Company.types";
import { IUserToken } from "../users/User.types";

import useFetch from '../../hooks/useFetch';
import FeedbackCompanies from "./FeedbackCompanies";
import FeedbackMain from "./FeedbackMain";
import FeedbackRegister from "./FeedbackRegister";

import Filter from "../../components/Filter";
import { filteringService } from "../../services/filtering";

import ReactGA from 'react-ga4';
import Advices from "../../components/Advices";

interface IFeedbacks {
  status: string;
}

const Feedbacks: React.FC<IFeedbacks> = ({ status }) => {
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<ICompanyToken & IUserToken>();
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
    },
    onInit: true
  })

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
    ReactGA.event('/recenzije', {category: 'inicijalno_učitavanje_recenzija', action: 'inicijalno učitavanje recenzija', label: `${(state.user || token?.user) ? (state.fullname || token?.user) : (state.company || token?.company) ? (state.companyName || token?.companyName) : 'Anoniman korisnik'}`})
  }, []);

  const getAllSelected = (filterOptions: ICompany[]) => {
    setSelectedCompanies(filteringService(filterOptions, companies));
  };

  const resetSelected = () => setSelectedCompanies(companies);

  return (
    <main className="feedbacks">
      <FeedbackMain />
      <FeedbackRegister />
      <Filter filterOptions={[
          { en: "companyName", hr: "Tvrtka" },
          { en: "companyLocation", hr: "Lokacija" },
        ]}
        jobs={companies}
        getAllSelected={getAllSelected}
        resetSelected={resetSelected}
        title={'Odaberite tvrtku koja vas zanima'} />
      {selectedCompanies.length === 0 && (
        <Container>
          <Row>
            <Col xlg={8} lg={8} md={8}>
              <p className="feedbacks__none">
                Trenutno ne postoji tvrtka koja zadovoljava odabrane vrijednosti
                filtriranja
              </p>
            </Col>
          </Row>
        </Container>
      )}
      {companies.length > 0 && <FeedbackCompanies companies={selectedCompanies}/>}
      <Advices></Advices>
    </main>
  );
};

export default Feedbacks;
