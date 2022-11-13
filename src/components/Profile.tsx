import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  LegacyRef,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import Editor from "./Editor";
import { IUserProfile } from "./UserProfile.types";
import { ICompanyToken, ICompany } from "../pages/companies/Company.types";
import { IUserToken } from "../pages/users/User.types";
import { AuthContext } from "../context/AuthContext";
import ModalForm from "./Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import moment from "moment";
import "moment/locale/hr";
import { RiDeleteBin6Line } from "react-icons/ri";
import ChartsContainer from "./ChartsContainer";
import Paginate from "./Paginate";

const Profile = () => {
  moment().locale("hr");
  const params = useParams();
  const navigate = useNavigate();
  const articleWidth = useRef() as any;
  const { state, dispatch, showAll, setShowAll } = useContext(AuthContext);
  const [showApplication, setShowApplication] = useState<boolean>(false);
  const [showFeedbacks, setShowFeedbacks] = useState<boolean>(false);
  const [showJobs, setShowJobs] = useState<boolean>(false);
  const [showJobApplicants, setShowJobApplicants] = useState<boolean>(false);
  const [user, setUser] = useState<null | IUserProfile>(null);
  const [company, setCompany] = useState<null | ICompany>(null);
  const [token, setToken] = useState<(ICompanyToken & IUserToken) | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [moreInformation, setMoreInformation] = useState<string>("");
  const [feedbackInformation, setFeedbackInformation] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [companyJobApplications, setCompanyJobApplications] = useState([]);
  const [trackingData, setTrackingData] = useState([]);
  const [columnWidth, setColumnWidth] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage, setPostsPerPage] = useState<number>(4);
  const [getPageNumbers, setPageNumbers] = useState<[] | number[]>([]);
  const [showingData, setShowingData] = useState<any[]>([]);

  const getProfileInformation = useFetch({
    url: `https://mechio-api-test.onrender.com/profil/${params.id}`,
    method: "get",
    onSuccess: (information) => {
      const { data, type } = information;
      type === "user" ? setUser(data) : setCompany(data);
      if (type === "user") {
        setMoreInformation(data.about);
        setCompany(null);
      }
      if (type === "company") {
        setMoreInformation(data.companyDescription);
        setUser(null);
      }
    },
    onError: (error) => {},
    onInit: true,
  });

  const getUserFeedbacks = useFetch({
    url: `https://mechio-api-test.onrender.com/profil/feedbacks/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setFeedbackInformation(data);
    },
    onError: (error) => {},
    onInit: true,
  });

  const getSpecificUserFeedback = useFetch({
    url: `https://mechio-api-test.onrender.com/profil/userfeedbacks/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setUserFeedbacks(data);
    },
    onError: (error) => {},
    onInit: true,
  });

  const getCompanyJobs = useFetch({
    url: `https://mechio-api-test.onrender.com/profil/jobs/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setCompanyJobs(data);
    },
    onError: (error) => {},
    onInit: false,
  });

  const getCompanyJobApplications = useFetch({
    url: `https://mechio-api-test.onrender.com/profil/applications/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setCompanyJobApplications(data);
    },
    onError: (error) => {},
    onInit: true,
  });

  const getUserJobApplications = useFetch({
    url: `https://mechio-api-test.onrender.com/profil/userapplications/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setUserApplications(data);
    },
    onError: (error) => {},
    onInit: true,
  });

  const editProfileInformation = useFetch({
    url: `https://mechio-api-test.onrender.com/profil/izmijeni/${params.id}`,
    method: "put",
    onSuccess: (information) => {
      const { data, type } = information;
      if (type === "user") {
        setUser(data);
        setMoreInformation(data.about);
      } else if (type === "company") {
        setCompany(data);
        setMoreInformation(data.companyDescription);
      }
    },
    onError: (error) => {},
    onInit: true,
  });

  const deleteProfile = useFetch({
    url: `https://mechio-api-test.onrender.com/profil/izbrisi/${params.id}`,
    method: "delete",
    onSuccess: (data) => {
      localStorage.removeItem("decodedToken");
      dispatch!({ type: "LOGOUT" });
      setToken(null);
      navigate("/");
    },
    onError: (error) => {},
    onInit: true,
  });

  const getTrackingData = useFetch({
    url: `https://mechio-api-test.onrender.com/analitika/${company?._id}`,
    method: "get",
    onSuccess: (data) => {
      setTrackingData(data);
    },
    onError: (err) => {},
    onInit: false,
  });

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const logout = () => {
    setShowAll(false);
    deleteProfile.handleFetch(
      `https://mechio-api-test.onrender.com/profil/izbrisi/${params.id}`
    );
    const href = window.location.href.split("/");
    const location = href[href.length - 1];
    localStorage.removeItem("decodedToken");
    dispatch!({ type: "LOGOUT" });
    setToken(null);
    navigate("/");
  };

  useEffect(() => {
    if ((user && user?.about) || (company && company?.companyDescription)) {
      setEdit(false);
    } else if (
      (user && !user?.about) ||
      (company && !company?.companyDescription)
    ) {
      setEdit(true);
    }
  }, []);

  useEffect(() => {
    if (params.id) {
      getProfileInformation.handleFetch(
        `https://mechio-api-test.onrender.com/profil/${params.id}`
      );
      getCompanyJobs.handleFetch(
        `https://mechio-api-test.onrender.com/profil/jobs/${params.id}`
      );
      getCompanyJobApplications.handleFetch(
        `https://mechio-api-test.onrender.com/profil/applications/${params.id}`
      );
    }
  }, [params.id]);

  useEffect(() => {
    if (state.user || state.company) {
      setShowAll(true);
    }
  }, [state]);

  useEffect(() => {
    if (company) {
      getTrackingData.handleFetch(
        `https://mechio-api-test.onrender.com/analitika/${company?._id}`
      );
    }
  }, [company]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 768) {
        setColumnWidth(window.innerWidth - 50);
      } else {
        setColumnWidth(window.innerWidth / 2 - 50);
      }
    });
    if (window.innerWidth < 768) {
      setColumnWidth(window.innerWidth - 50);
    } else {
      setColumnWidth(window.innerWidth / 2 - 50);
    }
  }, []);

  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setShowingData([]);
    setPageNumbers([]);
    if (user && showApplication) {
      handleDataManipulation(
        userApplications,
        indexOfFirstPost,
        indexOfLastPost
      );
    } else if (user && showFeedbacks) {
      handleDataManipulation(userFeedbacks, indexOfFirstPost, indexOfLastPost);
    } else if (company && showJobs) {
      handleDataManipulation(companyJobs, indexOfFirstPost, indexOfLastPost);
    } else if (company && showJobApplicants) {
      handleDataManipulation(
        companyJobApplications,
        indexOfFirstPost,
        indexOfLastPost
      );
    }
  }, [
    showApplication,
    showFeedbacks,
    showJobs,
    showJobApplicants,
    currentPage,
  ]);

  const handleDataManipulation = (
    data: any,
    indexOfFirstPost: number,
    indexOfLastPost: number
  ) => {
    setShowingData(data?.slice(indexOfFirstPost, indexOfLastPost));
    const getMaxNumbers = Math.ceil(data?.length / postsPerPage);

    for (let i = 1; i <= getMaxNumbers; i++) {
      setPageNumbers((prev: any) =>
        !prev!.includes(i) ? [...prev, i] : [...prev]
      );
    }
  };

  const paginate = (num: number) => {
    setCurrentPage(num);
  };

  return (
    <section className="profile">
      <Container>
        {user && (
          <>
            <Row className="profile__row">
              <Col sm={4} md={4} lg={4} xlg={4}>
                <aside className="profile__aside">
                  <div className="profile__info">
                    {(state._id === params.id|| token?._id === params.id) && (
                      <>
                        <h2 className="profile__main-title">Vaš profil</h2>
                        <div className="profile__info-options">
                          <Button
                            disabled={user.applications.length === 0}
                            onClick={() => setShowApplication(true)}
                          >
                            Prijave ({userApplications.length})
                          </Button>
                          {showApplication && (
                            <ModalForm
                              title="Vaše prijave na oglase"
                              show={showApplication}
                              setShow={setShowApplication}
                              handleClose={() => setShowApplication(false)}
                            >
                              <>
                                <ul className="profile__applications">
                                  {showingData.length > 0 &&
                                    showingData.map((app: any, i) => (
                                      <li
                                        key={i}
                                        className="profile__applications-application"
                                      >
                                        <Link to={`/poslovi/${app._id}`}>
                                          <img
                                            src={`https://mechio-api-test.onrender.com/${app.companyImage}`}
                                          ></img>
                                          <h3>{app.position}</h3>
                                          <p className="modal-date">
                                            {moment(app.date.toString()).format(
                                              "LL"
                                            )}
                                            .
                                          </p>
                                        </Link>
                                      </li>
                                    ))}
                                </ul>
                                <Paginate
                                  getPageNumbers={getPageNumbers}
                                  paginate={paginate}
                                ></Paginate>
                              </>
                            </ModalForm>
                          )}
                          <Button
                            disabled={userFeedbacks.length === 0}
                            onClick={() => setShowFeedbacks(true)}
                          >
                            Recenzije ({userFeedbacks.length})
                          </Button>
                          {showFeedbacks && (
                            <ModalForm
                              title="Vaše recenzije"
                              show={showFeedbacks}
                              setShow={setShowFeedbacks}
                              handleClose={() => setShowFeedbacks(false)}
                            >
                              <>
                                <ul className="profile__applications">
                                  {showingData &&
                                    showingData.length > 0 &&
                                    showingData.map((info: any, i) => (
                                      <li
                                        key={i}
                                        className="profile__applications-application"
                                      >
                                        <Link
                                          to={`/recenzije/${info.companyId}`}
                                        >
                                          <img
                                            src={`https://mechio-api-test.onrender.com/${info.companyImage}`}
                                          />
                                          <h3>{info.category}</h3>
                                          <p className="modal-date">
                                            {moment(
                                              info.date.toString()
                                            ).format("LL")}
                                            .
                                          </p>
                                        </Link>
                                      </li>
                                    ))}
                                </ul>
                                <Paginate
                                  getPageNumbers={getPageNumbers}
                                  paginate={paginate}
                                ></Paginate>
                              </>
                            </ModalForm>
                          )}
                          <a
                            href={`https://mechio-api-test.onrender.com/${user.cv}`}
                            target="_blank"
                          >
                            CV
                          </a>
                        </div>
                      </>
                    )}
                    {(state._id !== params.id) || (token?._id !== params.id) && (
                      <>
                        <h2 className="profile__main-title">Profil</h2>
                        <a
                          href={`https://mechio-api-test.onrender.com/${user.cv}`}
                          target="_blank"
                        >
                          CV
                        </a>
                      </>
                    )}
                  </div>
                  <div className="profile__about">
                    <div className="profile__img">
                      <img
                        src={`https://mechio-api-test.onrender.com/${user.image}`}
                        alt={user.fullname}
                      />
                    </div>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control
                        type="text"
                        disabled
                        value={user.fullname}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control type="text" disabled value={user.email} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control type="text" disabled value={user.number} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control type="text" disabled value={user.address} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control
                        type="text"
                        disabled
                        value={user.location}
                      />
                    </Form.Group>
                  </div>
                  {(state._id === params.id || token?._id === params.id) && (
                    <article className="profile__article">
                      <div className="profile__article-edit">
                        {!edit && (
                          <Button
                            variant="warning"
                            onClick={() => setEdit(true)}
                          >
                            Dodajte nešto o sebi
                          </Button>
                        )}
                      </div>
                    </article>
                  )}
                </aside>
              </Col>
              <Col sm={4} md={7} lg={7} xlg={7}>
                <div className="profile__delete">
                  {(state._id === params.id || token?._id === params.id) && (
                    <div className="profile__delete">
                      <button
                        className="specificjob-cta__delete"
                        onClick={() => logout()}
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  )}
                  {state._id !== params.id && token?._id !== params.id && (
                    <Button
                      className="profile__delete--back"
                      onClick={() => navigate(-1)}
                    >
                      Natrag
                    </Button>
                  )}
                </div>
                {!edit && !moreInformation && (
                  <div
                    className="profile__article-edit--rte feedbacks__specific-wrapper"
                    dangerouslySetInnerHTML={{
                      __html: "<h2>Trenutno nema podataka o korisniku</h2>",
                    }}
                  />
                )}
                {!edit && moreInformation && (
                  <div
                    className="profile__article-edit--rte feedbacks__specific-wrapper"
                    dangerouslySetInnerHTML={{
                      __html: moreInformation,
                    }}
                  />
                )}
                {!edit && user.about && !moreInformation && (
                  <div
                    className="profile__article-edit--rte feedbacks__specific-wrapper"
                    dangerouslySetInnerHTML={{ __html: user.about }}
                  />
                )}
                {edit && (
                  <>
                    <div className="profile__article-revert">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEdit(!edit)}
                      >
                        Natrag
                      </Button>
                    </div>
                    <Editor
                      value={moreInformation}
                      setValue={setMoreInformation}
                    ></Editor>
                    <div className="profile__article-buttons">
                      <Button
                        size="lg"
                        onClick={() => {
                          editProfileInformation.handleFetch(
                            `https://mechio-api-test.onrender.com/profil/izmijeni/${params.id}`,
                            { about: moreInformation }
                          );
                          setEdit(false);
                        }}
                      >
                        Potvrdi
                      </Button>
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </>
        )}
        {company && (
          <>
            <Row className="profile__row">
              <Col sm={4} md={4} lg={4}>
                <aside className="profile__aside">
                  <div className="profile__info">
                    {(state._id !== params.id || token?._id !== params.id) && (
                      <h2 className="profile__main-title">Profil</h2>
                    )}
                    {(state._id === params.id || token?._id === params.id) && (
                      <h2 className="profile__main-title">Vaš Profil</h2>
                    )}
                    <Button
                      disabled={companyJobs.length === 0}
                      onClick={() => setShowJobs(true)}
                    >
                      Oglasi ({companyJobs.length})
                    </Button>
                    {showJobs && (
                      <ModalForm
                        title="Vaši oglasi"
                        show={showJobs}
                        setShow={setShowJobs}
                        handleClose={() => setShowJobs(false)}
                      >
                        <>
                          <ul className="profile__applications">
                            {showingData.length > 0 &&
                              showingData.map((job: any, i) => (
                                <li
                                  key={i}
                                  className="profile__applications-application"
                                >
                                  <Link to={`/poslovi/${job._id}`}>
                                    <h3>{job.position}</h3>
                                    <p className="modal-date">
                                      {job.location},{" "}
                                      {moment(job.date.toString()).format("LL")}
                                      .
                                    </p>
                                  </Link>
                                </li>
                              ))}
                          </ul>
                          <Paginate
                            getPageNumbers={getPageNumbers}
                            paginate={paginate}
                          ></Paginate>
                        </>
                      </ModalForm>
                    )}
                    {(state._id === params.id || token?._id === params.id) && (
                      <>
                        <Button
                          disabled={companyJobApplications.length === 0}
                          onClick={() => setShowJobApplicants(true)}
                        >
                          Prijavljeni ({companyJobApplications.length})
                        </Button>
                        {showJobApplicants && (
                          <ModalForm
                            title="Prijavljeni na oglase"
                            show={showJobApplicants}
                            setShow={setShowJobApplicants}
                            handleClose={() => setShowJobApplicants(false)}
                          >
                            <>
                              <ul className="profile__applications">
                                {showingData.length > 0 &&
                                  showingData.map((applicant: any, i) => {
                                    const allFromCompany =
                                      applicant.applications.filter(
                                        (application: any) =>
                                          application.companyId === params.id
                                      );
                                    if (allFromCompany.length > 0) {
                                      return allFromCompany.map((app: any) => (
                                        <li
                                          key={i}
                                          className="profile__applications-application"
                                        >
                                          <Link to={`/profil/${applicant._id}`}>
                                            <img
                                              src={`https://mechio-api-test.onrender.com/${applicant.image}`}
                                            />
                                            <h3>{applicant.fullname}</h3>
                                            <p className="modal-date">
                                              {app.position}
                                            </p>
                                          </Link>
                                        </li>
                                      ));
                                    }
                                  })}
                              </ul>
                              <Paginate
                                getPageNumbers={getPageNumbers}
                                paginate={paginate}
                              ></Paginate>
                            </>
                          </ModalForm>
                        )}
                      </>
                    )}
                  </div>
                  <div className="profile__about">
                    <div className="profile__img">
                      <img
                        src={`https://mechio-api-test.onrender.com/${company.companyImage}`}
                        alt={"Image"}
                      />
                    </div>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control
                        type="text"
                        disabled
                        value={company.companyName}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control
                        type="text"
                        disabled
                        value={company.companyEmail}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control
                        type="text"
                        disabled
                        value={company.companyNumber}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control
                        type="text"
                        disabled
                        value={company.companyAddress}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control
                        type="text"
                        disabled
                        value={company.companyLocation}
                      />
                    </Form.Group>
                  </div>
                  <div className="profile__article-edit">
                    {!edit &&
                      (state._id === params.id || token?._id === params.id) && (
                        <Button variant="warning" onClick={() => setEdit(true)}>
                          Dodajte nešto o tvrtki
                        </Button>
                      )}
                    {state._id !== params.id && token?._id !== params.id && (
                      <Button
                        className="profile__delete--back"
                        onClick={() => navigate(-1)}
                      >
                        Natrag
                      </Button>
                    )}
                  </div>
                </aside>
              </Col>
              <Col sm={4} md={7} lg={7} xlg={7}>
                <div className="profile__charts" ref={articleWidth}>
                  {(state._id === params.id || token?._id === params.id) && (
                    <article className="profile__article" ref={articleWidth}>
                      <div className="profile__delete">
                        {(state._id === params.id ||
                          token?._id === params.id) && (
                          <button
                            className="specificjob-cta__delete"
                            onClick={() => logout()}
                          >
                            <RiDeleteBin6Line />
                          </button>
                        )}
                        {state._id !== params.id && token?._id !== params.id && (
                          <Button
                            className="profile__delete--back"
                            onClick={() => navigate(-1)}
                          >
                            Natrag
                          </Button>
                        )}
                      </div>
                      {edit && (
                        <>
                          <div className="profile__article-revert">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setEdit(!edit)}
                            >
                              Natrag
                            </Button>
                          </div>
                          <Editor
                            value={moreInformation}
                            setValue={setMoreInformation}
                          ></Editor>
                          <div className="profile__article-buttons">
                            <Button
                              size="lg"
                              onClick={() => {
                                editProfileInformation.handleFetch(
                                  `https://mechio-api-test.onrender.com/profil/izmijeni/${params.id}`,
                                  { companyDescription: moreInformation }
                                );
                                setEdit(false);
                              }}
                            >
                              Potvrdite
                            </Button>
                          </div>
                        </>
                      )}
                    </article>
                  )}
                  {!edit && moreInformation === "undefined" && (
                    <div
                      className="profile__article-edit--rte feedbacks__specific-wrapper"
                      dangerouslySetInnerHTML={{
                        __html: "<h2>Trenutno nema podataka o tvrtki</h2>",
                      }}
                    />
                  )}
                  {!edit && moreInformation !== "undefined" && (
                    <div
                      className="profile__article-edit--rte feedbacks__specific-wrapper"
                      dangerouslySetInnerHTML={{
                        __html: moreInformation,
                      }}
                    />
                  )}
                  {!edit && company.companyDescription && !moreInformation && (
                    <div
                      className="profile__article-edit--rte feedbacks__specific-wrapper"
                      dangerouslySetInnerHTML={{
                        __html: company.companyDescription,
                      }}
                    />
                  )}
                  {!edit &&
                    (state.companyPremium || token?.companyPremium) &&
                    (state._id === params.id || token?._id === params.id) &&
                    trackingData?.length > 0 && (
                      <ChartsContainer
                        page="company"
                        width={columnWidth}
                        data={trackingData}
                      ></ChartsContainer>
                    )}
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
      {getProfileInformation.status === "Pending" && (
        <LoadingSpinner></LoadingSpinner>
      )}
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
    </section>
  );
};

export default Profile;
