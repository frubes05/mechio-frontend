import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ICompanyToken } from "../companies/Company.types";
import { IUserToken } from "../users/User.types";
import moment from "moment";
import "moment/locale/hr";
import { AuthContext } from "../../context/AuthContext";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import useSWR from "swr";
import { deleteRequest, fetcher, sendRequest } from "../../services/fetcher";
import useSWRMutation from "swr/mutation";

const SpecificJob: React.FC = () => {
  moment().locale("hr");
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<ICompanyToken & IUserToken>();
  const [showing, setShowing] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const { data: companies } = useSWR(`https://mechio-api-test.onrender.com/poslodavci`, fetcher);
  const { data: job} = useSWR(() => `https://mechio-api-test.onrender.com/poslovi/${params.id}`, fetcher);
  const { trigger: deleteTrigger } = useSWRMutation(() => `https://mechio-api-test.onrender.com/poslovi/izbrisi-oglas/${params.id}`, deleteRequest, {
    onSuccess: () => {
      toast.success("Oglas uspjesno obrisan", { autoClose: 3000 });
      setTimeout(() => {
        navigate(-1);
      }, 4000);
    },
    onError: () => toast.error("Došlo je do pogrješke", { autoClose: 3000 })
  });
  const { trigger: admittanceTrigger } = useSWRMutation(() => `https://mechio-api-test.onrender.com/poslovi/prijava/${params.id}`, sendRequest, {
    onSuccess: (data) => toast.success(data.message, { autoClose: 3000 }),
    onError: () => toast.error("Došlo je do pogrješke", { autoClose: 3000 })
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
    admittanceTrigger({ userId: state?._id || token?._id});
  };

  const handleDelete = () => deleteTrigger();

  const selected = companies
    ? companies.filter(
        (company: any) =>
          (company._id === state._id || company._id === token?._id) &&
          job?.companyId === company._id
      )
    : null;

  return (
    <>
      <div className="specificjob">
        <ToastContainer></ToastContainer>
        <Container className="specificjob__wrapper">
          <Row className="specificjob__row">
            <Col md={4} lg={4} xlg={4} className="specificjob__first">
              <div className="specificjob__sticky">
                <h2 className="profile__main-title">Posao</h2>
                <Link
                  to={`/profil/${job?.companyId}`}
                  className="specificjob__img"
                >
                  <img
                    src={"https://mechio-api-test.onrender.com/" + job?.companyImage}
                    alt={job?.company}
                  />
                </Link>
                {job && (
                  <>
                    <article className="specificjob__article">
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Control
                          type="text"
                          disabled
                          value={job.company}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Control
                          type="text"
                          disabled
                          value={job.seniority}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Control type="text" disabled value={job.pay} />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Control
                          type="text"
                          disabled
                          value={job.location}
                        />
                      </Form.Group>
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
