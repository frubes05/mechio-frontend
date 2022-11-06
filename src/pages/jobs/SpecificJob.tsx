import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IJobs } from "./Jobs.types";
import { ICompany, ICompanyToken } from "../companies/Company.types";
import { IUserToken } from "../users/User.types";
import moment from "moment";
import "moment/locale/hr";
import { AuthContext } from "../../context/AuthContext";
import { Button, Container, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

import useFetch from "../../hooks/useFetch";

import {GTMTrackingHelper} from '../../services/GTMService';

interface ICompanies {
  companies: ICompany[];
  setRefetch: (bool: boolean) => void;
}

const SpecificJob: React.FC<ICompanies> = ({
  companies,
  setRefetch,
}) => {
  moment().locale("hr");
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<ICompanyToken & IUserToken>();
  const [job, setJob] = useState<null | IJobs>(null);
  const [showing, setShowing] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const params = useParams();
  const navigate = useNavigate();

  const fetchSpecificJob = useFetch({
    url: `http://localhost:9000/poslovi/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setJob(data);
    },
    onError: (error) => {},
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
      GTMTrackingHelper('Klik', 'Obrisan posao', `${job?.position}`, `${job?.company}`, `${job?.location}`)
    },
    onError: (error) => {
      toast.error("Došlo je do pogrješke", { autoClose: 3000 });
    },
  });

  const admitToSpecificJob = useFetch({
    url: `http://localhost:9000/poslovi/prijava/${params.id}`,
    method: "post",
    onSuccess: (data) => {
      data.message !== 200
        ? toast.error(data.message, { autoClose: 3000 })
        : toast.success(data.message, { autoClose: 3000 });
      setRefetch(true);
      GTMTrackingHelper('Klik', 'Prijava', `${job?.position}`, `${job?.company}`, null)
    },
    onError: (error) => {
      toast.error("Došlo je do pogrješke", { autoClose: 3000 });
    },
  });

  const trackAdmitance = useFetch({
    url: `http://localhost:9000/analitika`,
    method: 'post',
    onSuccess: (data) => {
      return;
    },
    onError: (data) => {
      return;
    }
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
    trackAdmitance.handleFetch('http://localhost:9000/analitika', {
      action: 'Prijava',
      category: 'Posao',
      companyId: job?.companyId,
      isEmployed: false,
      isRegistered: true,
      userId: state._id || token?._id,
      userLocation: 'Zagreb',
      jobId: params.id,
      jobPosition: job?.position,
      date: new Date()
    })
  };

  const handleDelete = () => {
    deleteSpecificJob.handleFetch(
      `http://localhost:9000/poslovi/izbrisi-oglas/${params.id}`
    );
    setStatus('Pending');
    }

  const selected = companies
    ? companies.filter(
        (company) =>
          (company._id === state._id ||
            company._id === token?._id) &&
          job?.companyId === company._id
      )
    : null;

  
  useEffect(() => {
   const user = (state._id || token?._id) ?? 'null';
    
    if (job) {
      trackAdmitance.handleFetch('http://localhost:9000/analitika', {
        action: 'Posjet',
        category: 'Posao',
        companyId: job.companyId,
        isEmployed: false,
        isRegistered: !!(state._id || token?._id),
        userId: user,
        userLocation: 'Zagreb',
        jobId: params.id,
        jobPosition: job?.position,
        date: new Date()
      })
    }
  }, [job]);

  return (
    <>
      <div className="specificjob">
        <ToastContainer></ToastContainer>
        <Container className="specificjob__wrapper">
          <Row className="specificjob__row">
            <Col md={4} lg={4} xlg={4} className="specificjob__first">
              <div className="specificjob__sticky">
                <Link
                  to={`/profil/${job?.companyId}`}
                  className="specificjob__img"
                >
                  <img
                    src={"http://localhost:9000/" + job?.companyImage}
                    alt={job?.company}
                  />
                </Link>
                {job && (
                  <>
                    <article className="specificjob__article">
                      <div className="specificjob__basic">
                        <h2 className="specificjob__basic-info">
                          <span>Tvrtka:</span>
                          <span className="specificjob__company">
                            {job.company}
                          </span>
                        </h2>
                        <p className="specificjob__basic-info">
                          <span>Senioritet:</span>
                          <span className="specificjob__seniority">
                            {job.seniority}
                          </span>
                        </p>
                        <p className="specificjob__basic-info">
                          <span>Plaća:</span>
                          <span className="specificjob__pay">
                            {job.pay} HRK (Neto)
                          </span>
                        </p>
                      </div>
                    </article>
                  </>
                )}
              </div>
            </Col>
            <Col md={7} lg={7} xlg={7} className="specificjob__second">
              {job && (
                <section>
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
                  </div>
                  <div className="specificjob__top">
                    <div className="specificjob__location">
                      {companies && selected!.length > 0 && (
                        <div className="specificjob__location-icons">
                          <Link to={`/poslovi/izmijeni-oglas/${job?._id}`}>
                            <FaRegEdit className="specificjob-cta__edit" />
                          </Link>
                          <button
                            className="specificjob-cta__delete"
                            onClick={handleDelete}
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </div>
                      )}
                      <span className="specificjob__location">
                        {job?.location},{" "}
                        {moment(job?.date.toString()).format("LL")}.
                      </span>
                    </div>
                    <h1 className="specificjob__title">
                      <span>Radno mjesto:</span>{" "}
                      <span className="specificjob__title--main">
                        {job.position}
                      </span>
                    </h1>
                  </div>
                  {job && (
                    <>
                      <article className="specificjob__article">
                        <div className="specificjob__content">
                          <p
                            className="specificjob__description"
                            dangerouslySetInnerHTML={{
                              __html: job.description,
                            }}
                          />
                        </div>
                        <div className="specificjob__buttons">
                          {state.user && !token?.user && (
                            <Button
                              className="specificjob__btn specificjob__btn--choose"
                              variant="success"
                              onClick={sendApplication}
                            >
                              Prijavi se
                            </Button>
                          )}
                          {token?.user && (
                            <Button
                              className="specificjob__btn specificjob__btn--choose"
                              variant="success"
                              onClick={sendApplication}
                            >
                              Prijavi se
                            </Button>
                          )}
                          {!state.user && !token?.user && (
                            <Button
                              className="specificjob__btn specificjob__btn--back"
                              variant="secondary"
                              onClick={() => navigate(-1)}
                            >
                              Natrag
                            </Button>
                          )}
                        </div>
                      </article>
                    </>
                  )}
                </section>
              )}
            </Col>
          </Row>
        </Container>
        {fetchSpecificJob.status === "Pending" && (
          <LoadingSpinner></LoadingSpinner>
        )}
        {status === "Pending" && (
          <LoadingSpinner></LoadingSpinner>
        )}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2560 1440"
        className="specificjob__svg"
        width="2560"
        height="1440"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: "100%",
          height: "100%",
          transform: "translate3d(0px, 0px, 0px)",
        }}
      >
        <defs>
          <clipPath id="__lottie_element_2">
            <rect width="2560" height="1440" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clipPath="url(#__lottie_element_2)">
          <g
            transform="matrix(3.3580501079559326,0,0,3.3580501079559326,1094.73828125,-278.769287109375)"
            opacity="0.1"
            style={{ display: "block" }}
          >
            <g
              opacity="1"
              transform="matrix(1,0,0,1,218.82699584960938,242.18699645996094)"
            >
              <path
                fill="rgb(156,150,150)"
                fillOpacity="1"
                d=" M-218.822998046875,-87.19499969482422 C-218.822998046875,-87.19499969482422 -218.822998046875,87.19599914550781 -218.822998046875,87.19599914550781 C-218.822998046875,111.41699981689453 -205.9010009765625,133.79800415039062 -184.9250030517578,145.90899658203125 C-184.9250030517578,145.90899658203125 -33.89799880981445,233.10400390625 -33.89799880981445,233.10400390625 C-12.92199993133545,245.21499633789062 12.92199993133545,245.21499633789062 33.89899826049805,233.10400390625 C33.89899826049805,233.10400390625 184.9250030517578,145.90899658203125 184.9250030517578,145.90899658203125 C205.90199279785156,133.79800415039062 218.822998046875,111.41699981689453 218.822998046875,87.19599914550781 C218.822998046875,87.19599914550781 218.822998046875,-87.19499969482422 218.822998046875,-87.19499969482422 C218.822998046875,-111.41600036621094 205.90199279785156,-133.79800415039062 184.9250030517578,-145.9080047607422 C184.9250030517578,-145.9080047607422 33.89899826049805,-233.10400390625 33.89899826049805,-233.10400390625 C12.92199993133545,-245.21499633789062 -12.92199993133545,-245.21499633789062 -33.89799880981445,-233.10400390625 C-33.89799880981445,-233.10400390625 -184.9250030517578,-145.9080047607422 -184.9250030517578,-145.9080047607422 C-205.9010009765625,-133.79800415039062 -218.822998046875,-111.41600036621094 -218.822998046875,-87.19499969482422z"
              ></path>
            </g>
          </g>
          <g
            transform="matrix(1.0870699882507324,0,0,1.0870699882507324,762.3887939453125,666.703125)"
            opacity="0.1"
            style={{ display: "block" }}
          >
            <g
              opacity="1"
              transform="matrix(1,0,0,1,218.82699584960938,242.18699645996094)"
            >
              <path
                fill="rgb(156,150,150)"
                fillOpacity="1"
                d=" M-218.822998046875,-87.19499969482422 C-218.822998046875,-87.19499969482422 -218.822998046875,87.19599914550781 -218.822998046875,87.19599914550781 C-218.822998046875,111.41699981689453 -205.9010009765625,133.79800415039062 -184.9250030517578,145.90899658203125 C-184.9250030517578,145.90899658203125 -33.89799880981445,233.10400390625 -33.89799880981445,233.10400390625 C-12.92199993133545,245.21499633789062 12.92199993133545,245.21499633789062 33.89899826049805,233.10400390625 C33.89899826049805,233.10400390625 184.9250030517578,145.90899658203125 184.9250030517578,145.90899658203125 C205.90199279785156,133.79800415039062 218.822998046875,111.41699981689453 218.822998046875,87.19599914550781 C218.822998046875,87.19599914550781 218.822998046875,-87.19499969482422 218.822998046875,-87.19499969482422 C218.822998046875,-111.41600036621094 205.90199279785156,-133.79800415039062 184.9250030517578,-145.9080047607422 C184.9250030517578,-145.9080047607422 33.89899826049805,-233.10400390625 33.89899826049805,-233.10400390625 C12.92199993133545,-245.21499633789062 -12.92199993133545,-245.21499633789062 -33.89799880981445,-233.10400390625 C-33.89799880981445,-233.10400390625 -184.9250030517578,-145.9080047607422 -184.9250030517578,-145.9080047607422 C-205.9010009765625,-133.79800415039062 -218.822998046875,-111.41600036621094 -218.822998046875,-87.19499969482422z"
              ></path>
            </g>
          </g>
          <g
            transform="matrix(0.34793999791145325,0,0,0.34793999791145325,2475.351806640625,615.2410888671875)"
            opacity="0.1"
            style={{ display: "block" }}
          >
            <g
              opacity="1"
              transform="matrix(1,0,0,1,218.82699584960938,242.18699645996094)"
            >
              <path
                fill="rgb(156,150,150)"
                fillOpacity="1"
                d=" M-218.822998046875,-87.19499969482422 C-218.822998046875,-87.19499969482422 -218.822998046875,87.19599914550781 -218.822998046875,87.19599914550781 C-218.822998046875,111.41699981689453 -205.9010009765625,133.79800415039062 -184.9250030517578,145.90899658203125 C-184.9250030517578,145.90899658203125 -33.89799880981445,233.10400390625 -33.89799880981445,233.10400390625 C-12.92199993133545,245.21499633789062 12.92199993133545,245.21499633789062 33.89899826049805,233.10400390625 C33.89899826049805,233.10400390625 184.9250030517578,145.90899658203125 184.9250030517578,145.90899658203125 C205.90199279785156,133.79800415039062 218.822998046875,111.41699981689453 218.822998046875,87.19599914550781 C218.822998046875,87.19599914550781 218.822998046875,-87.19499969482422 218.822998046875,-87.19499969482422 C218.822998046875,-111.41600036621094 205.90199279785156,-133.79800415039062 184.9250030517578,-145.9080047607422 C184.9250030517578,-145.9080047607422 33.89899826049805,-233.10400390625 33.89899826049805,-233.10400390625 C12.92199993133545,-245.21499633789062 -12.92199993133545,-245.21499633789062 -33.89799880981445,-233.10400390625 C-33.89799880981445,-233.10400390625 -184.9250030517578,-145.9080047607422 -184.9250030517578,-145.9080047607422 C-205.9010009765625,-133.79800415039062 -218.822998046875,-111.41600036621094 -218.822998046875,-87.19499969482422z"
              ></path>
            </g>
          </g>
        </g>
      </svg>
    </>
  );
};

export default SpecificJob;
