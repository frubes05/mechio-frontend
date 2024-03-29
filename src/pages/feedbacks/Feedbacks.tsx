import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ICompanyToken } from "../companies/Company.types";

import { ICompany } from "../companies/Company.types";
import { IUserToken } from "../users/User.types";

import FeedbackCompanies from "./FeedbackCompanies";
import FeedbackMain from "./FeedbackMain";
import FeedbackRegister from "./FeedbackRegister";

import Filter from "../../components/Filter";
import { filteringService } from "../../services/filtering";

import Advices from "../../components/Advices";
import useSWR from "swr";
import { fetcher } from "../../services/fetcher";

const Feedbacks: React.FC = () => {
  const [token, setToken] = useState<ICompanyToken & IUserToken>();
  const [selectedCompanies, setSelectedCompanies] = useState<ICompany[] | []>([]);
  const { data: companies } = useSWR(`https://mechio-api-test.onrender.com/poslodavci`, fetcher, {
    onSuccess: (data) => setSelectedCompanies(data)
  });

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
      <FeedbackRegister />
      <Filter filterOptions={[
          { en: "companyName", hr: "Tvrtka" },
          { en: "companyLocation", hr: "Lokacija" },
        ]}
        jobs={companies}
        getAllSelected={getAllSelected}
        resetSelected={resetSelected}
        title={'Odaberite tvrtku koja vas zanima'} />
      {selectedCompanies?.length === 0 && (
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
      {companies?.length > 0 && <FeedbackCompanies companies={selectedCompanies}/>}
      <Advices></Advices>
    </main>
  );
};

export default Feedbacks;
