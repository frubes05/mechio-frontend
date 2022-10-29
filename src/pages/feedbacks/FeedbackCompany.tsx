import React from "react";
import { Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ICompany } from "../companies/Company.types";

const FeedbackCompany: React.FC<{ company: ICompany }> = ({ company }) => {
  return (
    <Col xlg={3} lg={3} md={6} sm={12} className="feedbacks__list-column">
      <Link to={`/recenzije/${company._id}`} id={company._id}>
        <li className="feedbacks__options-item">
          <article className="jobs__card">
            <div className="jobs__card-picture">
              <img
                className="jobs__card-image"
                src={
                  "http://localhost:9000/" + company.companyImage
                }
              />
              <span className="jobs__card-pill">
                Recenzije ({company.companyFeedbacks?.length})
              </span>
            </div>
            <div className="jobs__card-content">
              <ul className="jobs__card-list">
                <li className="jobs__card-item">{company.companyEmail}, </li>
                <li className="jobs__card-item">{company.companyAddress}</li>
              </ul>
              <h2 className="jobs__card-title">{company.companyName}</h2>
            </div>
          </article>
        </li>
      </Link>
    </Col>
  );
};

export default FeedbackCompany;
