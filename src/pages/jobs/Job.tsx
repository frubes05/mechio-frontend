import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IJob } from "./Jobs.types";
import moment from "moment";
import { Badge } from "react-bootstrap";
import "moment/locale/hr";
import { AuthContext } from "../../context/AuthContext";
import { ICompany, ICompanyToken } from "../companies/Company.types";
import { IFeedback } from "../feedbacks/Feedbacks.types";

import useFetch from '../../hooks/useFetch';

const Job: FC<IJob> = ({ job }) => {
  moment().locale("hr");
  const [companies, setCompanies] = useState<null | ICompany[]>(null);

  const getCompanies = useFetch({
    url: "https://mechio-api-test.onrender.com/poslodavci",
    method: 'get',
    onSuccess: (data) => {
      setCompanies(data);
    },
    onError: (error) => {
    }
  })
  
  const level = () => {
    if (job.seniority === 'junior') {
      return <Badge pill bg="warning">{job.seniority}</Badge>
    } else if (job.seniority === 'mid-level') {
      return <Badge pill bg="primary">{job.seniority}</Badge>
    } else if (job.seniority === 'senior') {
      return <Badge pill bg="success">{job.seniority}</Badge>
    }
  }

  const pay = () => {
    if (+job.pay < 10000) {
      return <Badge pill bg="secondary">{job.pay} HRK</Badge>
    } else if (+job.pay >= 10000 && +job.pay < 15000) {
      return <Badge pill bg="primary">{job.pay} HRK</Badge>
    } else if (+job.pay >= 15000) {
      return <Badge pill bg="success">{job.pay} HRK</Badge>
    }
  }

  return (
    <>
    {job && <Link to={`/poslovi/${job._id}`} id={job._id}>
      <article className="jobs__card">
        <div className="jobs__card-picture">
          <img className="jobs__card-image" src={'https://mechio-api-test.onrender.com/'+ job.companyImage} />
        </div>
        <div className="jobs__card-content">
          <h2 className="jobs__card-title">{job.position}</h2>
          <ul className="jobs__card-list">
            <li className="jobs__card-item">{job.company}</li>
            <li className="jobs__card-item">{'Here'}</li>
            <li className="jobs__card-item">{job.location}</li>
          </ul>
          <p className="jobs__card-seniority">
            <span>Razina iskustva:</span>
            {level()}
          </p>
          <div className="jobs__card-specifics">
            <p className="jobs__card-pay">
              <span>Plaća:</span>
                {pay()}
            </p>
            <p className="jobs__card-date">
              {moment(job.date.toString()).format("LL")}.
            </p>
          </div>
        </div>
      </article>
    </Link>}
    </>
  );
};

export default Job;
