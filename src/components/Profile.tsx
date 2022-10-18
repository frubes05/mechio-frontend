import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Container, Col, Row, Button, Modal } from "react-bootstrap";
import Editor from "./Editor";
import { IUserProfile } from "./UserProfile.types";
import { ICompanyToken, ICompany } from "../pages/companies/Company.types";
import { IUserToken } from "../pages/users/User.types";
import { AuthContext } from "../context/AuthContext";
import ModalForm from "./Modal";

const Profile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AuthContext);
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

  const getProfileInformation = useFetch({
    url: `https://mechio-test-api.onrender.com/profil/${params.id}`,
    method: "get",
    onSuccess: (information) => {
      const { data, type } = information;
      type === "user" ? setUser(data) : setCompany(data);
      if (type === "user") {
        setMoreInformation(data.about);
      }
      if (type === "company") {
        setMoreInformation(data.companyDescription);
      }
    },
    onError: (error) => {
    },
  });

  const getUserFeedbacks = useFetch({
    url: `https://mechio-test-api.onrender.com/profil/feedbacks/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setFeedbackInformation(data);
    },
    onError: (error) => {
    },
  });

  const getSpecificUserFeedback = useFetch({
    url: `https://mechio-test-api.onrender.com/profil/userfeedbacks/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setUserFeedbacks(data);
    },
    onError: (error) => {
    },
  });

  const getCompanyJobs = useFetch({
    url: `https://mechio-test-api.onrender.com/profil/jobs/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setCompanyJobs(data);
    },
    onError: (error) => {
    },
  });

  const getCompanyJobApplications = useFetch({
    url: `https://mechio-test-api.onrender.com/profil/applications/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setCompanyJobApplications(data);
    },
    onError: (error) => {
    },
  });

  const getUserJobApplications = useFetch({
    url: `https://mechio-test-api.onrender.com/profil/userapplications/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setUserApplications(data);
    },
    onError: (error) => {
    },
  });

  const editProfileInformation = useFetch({
    url: `https://mechio-test-api.onrender.com/profil/izmijeni/${params.id}`,
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
    onError: (error) => {
    },
  });

  const deleteProfile = useFetch({
    url: `https://mechio-test-api.onrender.com/profil/izbrisi/${params.id}`,
    method: "delete",
    onSuccess: (data) => {
      localStorage.removeItem("decodedToken");
      dispatch!({ type: "LOGOUT" });
      setToken(null);
      navigate("/");
    },
    onError: (error) => {
    },
  });

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const logout = () => {
    deleteProfile.handleFetch(
      `https://mechio-test-api.onrender.com/profil/izbrisi/${params.id}`
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

  return (
    <Container>
      {user && (
        <>
          <Row className="profile">
            <Col sm={4} md={4} lg={2} xlg={2}>
              <aside className="profile__aside">
                <div className="profile__about">
                  <h1 className="profile__about-title">
                    <span className="profile__style">Ime i Prezime:</span>
                    <span>{user.fullname}</span>
                  </h1>
                  <img
                    src={`https://mechio-test-api.onrender.com/${user.image}`}
                    alt={user.fullname}
                  />
                  <p className="profile__about-title">
                    <span className="profile__style">Email:</span>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </p>
                  <div>
                    <p className="profile__style">CV:</p>
                    {user.cv}
                  </div>
                </div>
                <div className="profile__info">
                  <h2>
                    Vaše prijave na oglase (
                    <span>{userApplications.length}</span>)
                  </h2>
                  {userApplications.length > 0 && (
                    <Button onClick={() => setShowApplication(true)}>
                      Pogledaj
                    </Button>
                  )}
                  {showApplication && (
                    <ModalForm
                      title="Vaše prijave na oglase"
                      show={showApplication}
                      setShow={setShowApplication}
                      handleClose={() => setShowApplication(false)}
                    >
                      <ul className="profile__applications">
                        {userApplications.length > 0 &&
                          userApplications.map((app: any, i) => (
                            <li
                              key={i}
                              className="profile__applications-application"
                            >
                              <Link to={`/poslovi/${app._id}`}>
                                <img
                                  src={`https://mechio-test-api.onrender.com/${app.companyImage}`}
                                ></img>
                                <h3>{app.company}</h3>
                                <p>{app.position}</p>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </ModalForm>
                  )}
                </div>
                <div className="profile__info">
                  <h2>
                    Vaše recenzije (<span>{userFeedbacks.length}</span>)
                  </h2>
                  {userFeedbacks.length > 0 && (
                    <Button onClick={() => setShowFeedbacks(true)}>
                      Pogledaj
                    </Button>
                  )}
                  {showFeedbacks && (
                    <ModalForm
                      title="Vaše recenzije"
                      show={showFeedbacks}
                      setShow={setShowFeedbacks}
                      handleClose={() => setShowFeedbacks(false)}
                    >
                      <ul className="profile__applications">
                        {userFeedbacks &&
                          userFeedbacks.length > 0 &&
                          userFeedbacks.map((info: any, i) => (
                            <li
                              key={i}
                              className="profile__applications-application"
                            >
                              <Link to={`/recenzije/${info.companyId}`}>
                                <h3>{info.position}</h3>
                                <p>{info.date}</p>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </ModalForm>
                  )}
                </div>
              </aside>
            </Col>
            <Col sm={4} md={4} lg={8} xlg={8}>
              <article className="profile__article">
                <div className="profile__article-edit">
                  {!edit && (
                    <>
                      <span>
                        <h1>O meni</h1>
                        {moreInformation && (
                          <div
                            className="profile__article-edit--rte"
                            dangerouslySetInnerHTML={{
                              __html: moreInformation,
                            }}
                          />
                        )}
                        {user.about && !moreInformation && (
                          <div
                            className="profile__article-edit--rte"
                            dangerouslySetInnerHTML={{ __html: user.about }}
                          />
                        )}
                      </span>
                      <Button variant="warning" onClick={() => setEdit(true)}>
                        Izmijeni
                      </Button>
                    </>
                  )}
                </div>
                {edit && (
                  <>
                    <div className="profile__article-revert">
                      <h1>Dodajte nešto više o sebi</h1>
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
                            `https://mechio-test-api.onrender.com/profil/izmijeni/${params.id}`,
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
              </article>
            </Col>
            <Col sm={4} md={4} lg={2} xlg={2}>
              <div className="profile__delete">
                <Button variant="danger" onClick={() => logout()}>
                  Izbriši profil
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
      {company && (
        <>
          <Row className="profile">
            <Col sm={4} md={4} lg={2} xlg={2}>
              <aside className="profile__aside">
                <div className="profile__about">
                  <h1 className="profile__about-title">
                    <span className="profile__style">Ime tvrtke:</span>
                    <span>{company.companyName}</span>
                  </h1>
                  <img
                    src={`https://mechio-test-api.onrender.com/${company.companyImage}`}
                    alt={"Image"}
                  />
                  <p className="profile__about-title">
                    <span className="profile__style">Email:</span>
                    <a href={`mailto:${company.companyEmail}`}>
                      <span>{company.companyEmail}</span>
                    </a>
                  </p>
                  <div className="profile__about-title">
                    <span className="profile__style">Kontakt:</span>
                    <span>{company.companyNumber}</span>
                  </div>
                </div>
                <div className="profile__info">
                  <h2>
                    Vaši oglasi (<span>{companyJobs.length}</span>)
                  </h2>
                  {companyJobs.length > 0 && (
                    <Button onClick={() => setShowJobs(true)}>Pogledaj</Button>
                  )}
                  {showJobs && (
                    <ModalForm
                      title="Vaši oglasi"
                      show={showJobs}
                      setShow={setShowJobs}
                      handleClose={() => setShowJobs(false)}
                    >
                      <ul className="profile__applications">
                        {companyJobs.length > 0 &&
                          companyJobs.map((job: any, i) => (
                            <li
                              key={i}
                              className="profile__applications-application"
                            >
                              <Link to={`/poslovi/${job._id}`}>
                                <h3>{job.position}</h3>
                                <p>{job.location}</p>
                                <p>{job.date}</p>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </ModalForm>
                  )}
                </div>
                <div className="profile__info">
                  <h2>
                    Prijavljeni na oglase (
                    <span>{companyJobApplications.length}</span>)
                  </h2>
                  {companyJobApplications.length > 0 && (
                    <Button onClick={() => setShowJobApplicants(true)}>
                      Pogledaj
                    </Button>
                  )}
                  {showJobApplicants && (
                    <ModalForm
                      title="Prijavljeni na oglase"
                      show={showJobApplicants}
                      setShow={setShowJobApplicants}
                      handleClose={() => setShowJobApplicants(false)}
                    >
                      <ul className="profile__applications">
                        {companyJobApplications.length > 0 &&
                          companyJobApplications.map((applicant: any, i) => (
                            <li
                              key={i}
                              className="profile__applications-application"
                            >
                              <Link to={`/profil/default/${applicant._id}`}>
                                <h3>{applicant.fullname}</h3>
                                <p>{applicant.email}</p>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </ModalForm>
                  )}
                </div>
              </aside>
            </Col>
            <Col sm={4} md={4} lg={8} xlg={8}>
              <article className="profile__article">
                <div className="profile__article-edit">
                  {!edit && (
                    <>
                      <span>
                        <h1>O tvrtki</h1>
                        {moreInformation && (
                          <div
                            className="profile__article-edit--rte"
                            dangerouslySetInnerHTML={{
                              __html: moreInformation,
                            }}
                          />
                        )}
                        {company.companyDescription && !moreInformation && (
                          <div
                            className="profile__article-edit--rte"
                            dangerouslySetInnerHTML={{
                              __html: company.companyDescription,
                            }}
                          />
                        )}
                      </span>
                      <Button variant="warning" onClick={() => setEdit(true)}>
                        Izmijeni
                      </Button>
                    </>
                  )}
                </div>
                {edit && (
                  <>
                    <div className="profile__article-revert">
                      <h1>Napišite nešto više o tvrtki</h1>
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
                            `https://mechio-test-api.onrender.com/profil/izmijeni/${params.id}`,
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
            </Col>
            <Col sm={4} md={4} lg={2} xlg={2}>
              <div className="profile__delete">
                <Button variant="danger" onClick={() => logout()}>
                  Izbrišite profil
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Profile;
