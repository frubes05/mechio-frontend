import React from "react";
import { ICompany } from "../companies/Company.types";
import FeedbackCompany from "./FeedbackCompany";
import { Container, Row } from "react-bootstrap";

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
