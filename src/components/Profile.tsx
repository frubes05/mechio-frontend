import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Container, Col, Row, Button, Modal, Form } from "react-bootstrap";
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
    url: `http://localhost:9000/profil/${params.id}`,
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
    onError: (error) => {},
  });

  const getUserFeedbacks = useFetch({
    url: `http://localhost:9000/profil/feedbacks/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setFeedbackInformation(data);
    },
    onError: (error) => {},
  });

  const getSpecificUserFeedback = useFetch({
    url: `http://localhost:9000/profil/userfeedbacks/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setUserFeedbacks(data);
    },
    onError: (error) => {},
  });

  const getCompanyJobs = useFetch({
    url: `http://localhost:9000/profil/jobs/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setCompanyJobs(data);
    },
    onError: (error) => {},
  });

  const getCompanyJobApplications = useFetch({
    url: `http://localhost:9000/profil/applications/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setCompanyJobApplications(data);
    },
    onError: (error) => {},
  });

  const getUserJobApplications = useFetch({
    url: `http://localhost:9000/profil/userapplications/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setUserApplications(data);
    },
    onError: (error) => {},
  });

  const editProfileInformation = useFetch({
    url: `http://localhost:9000/profil/izmijeni/${params.id}`,
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
  });

  const deleteProfile = useFetch({
    url: `http://localhost:9000/profil/izbrisi/${params.id}`,
    method: "delete",
    onSuccess: (data) => {
      localStorage.removeItem("decodedToken");
      dispatch!({ type: "LOGOUT" });
      setToken(null);
      navigate("/");
    },
    onError: (error) => {},
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
      `http://localhost:9000/profil/izbrisi/${params.id}`
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
    <section className="profile">
      <Container className="profile__container">
        {user && (
          <>
            <Row className="profile__row">
              <Col sm={4} md={6} lg={6} xlg={6}>
                <aside className="profile__aside">
                  <h2 className="profile__main-title">Vaš profil</h2>
                  <div className="profile__about">
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
                      <Form.Control
                        type="text"
                        disabled
                        value={user.address}
                      />
                    </Form.Group>
                  </div>
                  <article className="profile__article">
                    <div className="profile__article-edit">
                      {!edit && (
                        <Button variant="warning" onClick={() => setEdit(true)}>
                          Dodajte nešto o sebi
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
                                `http://localhost:9000/profil/izmijeni/${params.id}`,
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
                </aside>
              </Col>
              <Col sm={4} md={5} lg={5} xlg={5}>
                {!moreInformation && !user?.about &&
                <div
                className="profile__article-edit--rte"
                dangerouslySetInnerHTML={{
                  __html: "Trenutno nema podataka o korisniku",
                }}
                />
                }
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
                <div className="profile__img">
                  <img
                    src={`http://localhost:9000/${user.image}`}
                    alt={user.fullname}
                  />
                </div>
                <div>{user.cv}</div>
                <div className="profile__info">
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
                      <ul className="profile__applications">
                        {userApplications.length > 0 &&
                          userApplications.map((app: any, i) => (
                            <li
                              key={i}
                              className="profile__applications-application"
                            >
                              <Link to={`/poslovi/${app._id}`}>
                                <img
                                  src={`http://localhost:9000/${app.companyImage}`}
                                ></img>
                                <h3>{app.company}</h3>
                                <p>{app.position}</p>
                              </Link>
                            </li>
                          ))}
                      </ul>
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
            <Row className="profile__row">
              <Col sm={4} md={6} lg={6} xlg={6}>
                <aside className="profile__aside">
                  <h2 className="profile__main-title">Vaš profil</h2>
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
                  <article className="profile__article">
                    <div className="profile__article-edit">
                      {!edit && (
                        <Button variant="warning" onClick={() => setEdit(true)}>
                          Dodajte nešto o tvrtki
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
                                `http://localhost:9000/profil/izmijeni/${params.id}`,
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
                </aside>
              </Col>
              <Col sm={4} md={5} lg={5} xlg={5}>
                {!moreInformation && !company.companyDescription &&
                <div
                className="profile__article-edit--rte"
                dangerouslySetInnerHTML={{
                  __html: "Trenutno nema podataka o tvrtki",
                }}
                />
                }
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
                <div className="profile__img">
                  <img
                    src={`http://localhost:9000/${company.companyImage}`}
                    alt={"Image"}
                  />
                </div>
                <div className="profile__info">
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
                      <ul className="profile__applications">
                        {companyJobApplications.length > 0 &&
                          companyJobApplications.map((applicant: any, i) => (
                            <li
                              key={i}
                              className="profile__applications-application"
                            >
                              <Link to={`/profil/${applicant._id}`}>
                                <h3>{applicant.fullname}</h3>
                                <p>{applicant.email}</p>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </ModalForm>
                  )}
                </div>
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
    </section>
  );
};

export default Profile;
