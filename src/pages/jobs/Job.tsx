import { FC } from "react";
import { Link } from "react-router-dom";
import { IJob } from "./Jobs.types";
import moment from "moment";
import "moment/locale/hr";
import { ICompany } from "../companies/Company.types";

const Job: FC<IJob & { companies: ICompany[] }> = ({ job, companies }) => {
  moment().locale("hr");
  return (
    <>
      {job && (
        <Link to={`/poslovi/${job._id}`} id={job._id}>
          <article className="jobs__card">
            <div className="jobs__card-picture">
              <img
                loading="lazy"
                className="jobs__card-image"
                src={"https://mechio-api-test.onrender.com/" + job.companyImage}
                alt={job.company}
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
