import React from 'react'
import { ICompany } from '../companies/Company.types'
import FeedbackCompany from './FeedbackCompany';
import { Row } from 'react-bootstrap';


const FeedbackCompanies: React.FC<{companies: ICompany[], value: string}> = ({companies, value}) => {
  return (
    <ul className='feedbacks__options-list'>
        <Row>
        {companies && companies.filter(company => {
          if (typeof(company.companyName) === 'string') {
            return company.companyName.toUpperCase().startsWith(value.toUpperCase()) ||
            company.companyName.toUpperCase().includes(value.toUpperCase());
          }
          return;
        }).map((company: any, i: number) =>
            <FeedbackCompany key={i} company={company} />
        )}
        </Row>
    </ul>
  )
}

export default FeedbackCompanies