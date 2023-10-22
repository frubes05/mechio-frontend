import { FC } from "react";
import { IJobsList } from "./Jobs.types";
import Job from "./Job";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const JobsList: FC<IJobsList> = ({ jobs }) => {
  return (
    <ul className="jobs__list">
      <Container>
        <Row>
          {jobs.length > 0 &&
            jobs.sort((jobA: any, jobB: any) => jobB.date > jobA.date ? 1 : -1).sort((jobA: any, jobB: any) => jobB.companyPremium - jobA.companyPremium).map((job, i) => (
              <Col
                key={i}
                xlg={3}
                lg={3}
                md={6}
                sm={12}
                className="jobs__list-column"
              >
                <li key={i} className="jobs__list-item">
                  <Job job={job}></Job>
                </li>
              </Col>
            ))}
        </Row>
      </Container>
    </ul>
  );
};

export default JobsList;
