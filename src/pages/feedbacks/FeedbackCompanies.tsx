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
          {companies &&
            companies.map((company: any, i: number) => (
              <FeedbackCompany key={i} company={company} />
            ))}
        </Row>
      </Container>
    </ul>
  );
};

export default FeedbackCompanies;
