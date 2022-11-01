import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { ICompanyToken } from "../companies/Company.types";
import LoadingSpinner from "../../components/LoadingSpinner";

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
    url: "https://mechio-test.onrender.com/poslodavci",
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
      {getCompanies.status === 'Pending' && <LoadingSpinner></LoadingSpinner>}
    </main>
  );
};

export default Feedbacks;
