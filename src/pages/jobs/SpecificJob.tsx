import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IJobs } from "./Jobs.types";
import { ICompany, ICompanyToken } from "../companies/Company.types";
import { IUserToken } from "../users/User.types";
import moment from "moment";
import "moment/locale/hr";
import { AuthContext } from "../../context/AuthContext";
import { Button, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

import useFetch from "../../hooks/useFetch";

interface ICompanies {
  companies: ICompany[];
  setRefetch: (bool: boolean) => void;
  status: string;
}

const SpecificJob: React.FC<ICompanies> = ({ companies, setRefetch, status }) => {
  moment().locale("hr");
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<ICompanyToken & IUserToken>();
  const [job, setJob] = useState<null | IJobs>(null);
  const [showing, setShowing] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();

  const fetchSpecificJob = useFetch({
    url: `http://localhost:9000/poslovi/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setJob(data);
    },
    onError: (error) => {
    },
  });

  const deleteSpecificJob = useFetch({
    url: `http://localhost:9000/poslovi/izbrisi-oglas/${params.id}`,
    method: "delete",
    onSuccess: (data) => {
      toast.success("Oglas uspjesno obrisan", { autoClose: 3000 });
      setTimeout(() => {
        navigate(-1);
      }, 4000);
      setRefetch(true);
    },
    onError: (error) => {
      toast.error("Došlo je do pogrješke", { autoClose: 3000 });
    },
  });

  const admitToSpecificJob = useFetch({
    url: `http://localhost:9000/poslovi/prijava/${params.id}`,
    method: "post",
    onSuccess: (data) => {
      data.message !== 200 ? toast.error(data.message, { autoClose: 3000 }) : toast.success(data.message, { autoClose: 3000});
      setRefetch(true);
    },
    onError: (error) => {
      toast.error("Došlo je do pogrješke", { autoClose: 3000 });
    },
  });

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const sendApplication = (e: React.FormEvent) => {
    setShowing(!showing);
    admitToSpecificJob.handleFetch(
      `http://localhost:9000/poslovi/prijava/${params.id}`,
      {
        userId: state._id || token?._id,
      }
    );
  };

  const handleDelete = () =>
  deleteSpecificJob.handleFetch(
    `http://localhost:9000/poslovi/izbrisi-oglas/${params.id}`
  );


  const listFormatter: Function = (list: string[]) => {
    return (
      <ul className="specificjob__list">
        {list.map((req, i) => (
          <li key={i}>{req}</li>
        ))}
      </ul>
    );
  };

  const selected = companies
    ? companies.filter(
        (company) =>
          (company.companyName === state.companyName ||
            company.companyName === token?.companyName) &&
          job?.company === company.companyName
      )
    : null;

  return (
    <div className="specificjob">
      <ToastContainer></ToastContainer>
      <Container>
        <div className="specificjob__img">
          <img
            src={"http://localhost:9000/" + job?.companyImage}
            alt={job?.company}
          />
        </div>
        {job && (
          <section className="specificjob__wrapper">
            <div className="specificjob-cta">
              {state.user && !token?.user && (
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Natrag
                </Button>
              )}
              {token?.user && (
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Natrag
                </Button>
              )}
              {selected!.length > 0 && (
                <>
                  <Link to={`/poslovi/izmijeni-oglas/${job?._id}`}>
                    <FaRegEdit className="specificjob-cta__edit" />
                  </Link>
                  <button
                    className="specificjob-cta__delete"
                    onClick={handleDelete}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </>
              )}
            </div>
            <div className="specificjob__top">
              <h1 className="specificjob__title">
                Oglas za radno mjesto {job.position}-a
              </h1>
            </div>
            {job && (
              <>
                <article className="specificjob__article">
                  <div className="specificjob__basic">
                    <h2 className="specificjob__company">{job.company}</h2>
                    <p className="specificjob__location">
                      {job.location}
                      .
                    </p>
                  </div>
                  <div className="specificjob__content">
                    <div>
                      <h3 className="specificjob__subtitle">Opis pozicije</h3>
                      <p className="specificjob__description">
                        {job.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="specificjob__subtitle">
                        Vaša dužnost na poziciji
                      </h3>
                      {listFormatter(job.requirementsList)}
                    </div>
                    <div>
                      <h3 className="specificjob__subtitle">
                        Vaše kompetencije
                      </h3>
                      {listFormatter(job.skillsList)}
                    </div>
                    <div>
                      <h3 className="specificjob__subtitle">Vaši benefiti</h3>
                      {listFormatter(job.benefitsList)}
                    </div>
                  </div>
                  <div className="specificjob__buttons">
                    {state.user && !token?.user && (
                      <Button
                        className="specificjob__btn"
                        variant="success"
                        onClick={sendApplication}
                      >
                        Prijavi se
                      </Button>
                    )}
                    {token?.user && (
                      <Button
                        className="specificjob__btn"
                        variant="success"
                        onClick={sendApplication}
                      >
                        Prijavi se
                      </Button>
                    )}
                    {!state.user && !token?.user && (
                      <Button variant="secondary" onClick={() => navigate(-1)}>
                        Natrag
                      </Button>
                    )}
                  </div>
                </article>
              </>
            )}
          </section>
        )}
      </Container>
      {status === 'Pending' && <LoadingSpinner></LoadingSpinner>}
    </div>
  );
};

export default SpecificJob;
