import React from "react";
import { ICompany } from "../companies/Company.types";
import FeedbackCompany from "./FeedbackCompany";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const FeedbackCompanies: React.FC<{ companies: ICompany[] }> = ({
  companies,
}) => {
  return (
    <ul className="feedbacks__options-list">
      <Container>
        <Row>
          {companies?.length > 0 &&
            companies.map((company: any, i: number) => (
              <FeedbackCompany key={i} company={company} companyFeedbacksLength={company.companyFeedbacks?.length || 0} />
            ))}
        </Row>
      </Container>
    </ul>
  );
};

export default FeedbackCompanies;
