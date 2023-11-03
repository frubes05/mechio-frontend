import React from "react";
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import { ICompany } from "../companies/Company.types";

import { GTMTrackingHelper } from "../../services/GTMService";

const FeedbackCompany: React.FC<{ company: ICompany, companyFeedbacksLength: number }> = ({ company, companyFeedbacksLength }) => {
  return (
    <Col xlg={3} lg={3} md={6} sm={12} className="feedbacks__list-column">
      <Link to={`/recenzije/${company._id}`} id={company._id} onClick={() => GTMTrackingHelper('Klik', 'Preusmjeravanje na tvrtku', `${company.companyName}`, `${company.companyAddress}`, null)}>
        <li className="feedbacks__options-item">
          <article className="jobs__card">
            <div className="jobs__card-picture">
              <img
                className="jobs__card-image"
                src={
                  "https://mechio-api-test.onrender.com/" + company.companyImage
                }
                alt={company.companyName}
              />
              <span className="jobs__card-pill">
                Recenzije ({companyFeedbacksLength})
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
