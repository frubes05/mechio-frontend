import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IJob } from "./Jobs.types";
import moment from "moment";
import { Badge } from "react-bootstrap";
import "moment/locale/hr";
import { AuthContext } from "../../context/AuthContext";
import { ICompany, ICompanyToken } from "../companies/Company.types";
import { IFeedback } from "../feedbacks/Feedbacks.types";

import useFetch from "../../hooks/useFetch";

const Job: FC<IJob> = ({ job }) => {
  moment().locale("hr");
  const [companies, setCompanies] = useState<null | ICompany[]>(null);

  const getCompanies = useFetch({
    url: "https://mechio-api-test.onrender.composlodavci",
    method: "get",
    onSuccess: (data) => {
      setCompanies(data);
    },
    onError: (error) => {},
    onInit: true,
  });

  return (
    <>
      {job && (
        <Link to={`/poslovi/${job._id}`} id={job._id}>
          <article className="jobs__card">
            <div className="jobs__card-picture">
              <img
                loading="lazy"
                className="jobs__card-image"
                src={"https://mechio-api-test.onrender.com" + job.companyImage}
              />
              <span className="jobs__card-pill">
                {moment(job.date.toString()).startOf("day").fromNow()}
              </span>
              {job.companyPremium && (
                <div className="jobs__card-premium">
                  <span>PREMIUM</span>
                </div>
              )}
            </div>
            <div className="jobs__card-content">
              <ul className="jobs__card-list">
                <li className="jobs__card-item">{job.company}, </li>
                <li className="jobs__card-item">{job.location}</li>
              </ul>
              <h2 className="jobs__card-title">{job.position}</h2>
            </div>
          </article>
        </Link>
      )}
    </>
  );
};

export default Job;
