import React from 'react';
import { Col, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { ICompany } from '../companies/Company.types';

const FeedbackCompany: React.FC<{company: ICompany}> = ({company}) => {
  return (
    <Col xlg={3} lg={3} md={6} sm={12} className="feedbacks__list-column">
    <li className='feedbacks__options-item'>
        <article className='feedbacks__options-article'>
            <div className='feedbacks__options-image'>
                <img src={'http://localhost:9000/' + company.companyImage} />
            </div>
            <h1>{company.companyName}</h1>
            <h3>{company.companyDescription}</h3>
            <div className='feedbacks__options-ctas'>
                <p>Prosječna ocjena</p>
                <Link className='feedbacks__options-button' to={`/recenzije/${company._id}`} >
                    Recenzije: ({company.companyFeedbacks?.length})
                </Link>
            </div>
            <div className='feedbacks__options-address'>
                <span>{company.companyAddress}</span>
            </div>
        </article>
    </li>
    </Col>
  )
}

export default FeedbackCompany;