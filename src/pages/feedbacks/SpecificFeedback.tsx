import React, { useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { ICompany, ICompanyToken } from "../companies/Company.types";
import { AuthContext } from "../../context/AuthContext";
import { IUserToken } from "../users/User.types";
import { IFeedback } from "./Feedbacks.types";
import moment from "moment";
import "moment/locale/hr";

import Modal from "../../components/Modal";

import useFetch from "../../hooks/useFetch";
import Rating from "../../components/Rating";
import Filter from "../../components/Filter";

import { filteringService } from "../../services/filtering";
import FeedbackCategories from "./FeedbackCategories";
import LoadingSpinner from "../../components/LoadingSpinner";

const SpecificFeedback = () => {
  const params = useParams();
  const navigate = useNavigate();
  moment().locale("hr");
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<ICompanyToken & IUserToken>();
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [company, setCompany] = useState<null | ICompany>();
  const [show, setShow] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [position, setPosition] = useState<string>("");
  const [positives, setPositives] = useState<string>("");
  const [negatives, setNegatives] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [allFeedbacks, setAllFeedbacks] = useState<any>(
    company?.companyFeedbacks
  );
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<IFeedback[] | []>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const getCompanies = useFetch({
    url: `http://localhost:9000/poslodavci/${params.id}`,
    method: "get",
    onSuccess: (data: any) => {
      setCompany(data);
    },
    onError: (error: any) => {},
  });

  const getFeedbacks = useFetch({
    url: `http://localhost:9000/recenzije/${params.id}`,
    method: "get",
    onSuccess: (data: any) => {
      setAllFeedbacks(data);
    },
    onError: (error: any) => {},
  });

  const submitFeedback = useFetch({
    url: "http://localhost:9000/recenzije/nova-recenzija",
    method: "post",
    onSuccess: (data: any) => {
      getFeedbacks.handleFetch(`http://localhost:9000/recenzije/${params.id}`);
    },
    onError: (error: any) => {},
  });

  const deleteFeedback = useFetch({
    method: "delete",
    onSuccess: (data) => {
      setAllFeedbacks((prev: any) =>
        prev?.filter((feedback: any) => feedback._id !== feedbackId)
      );
    },
    onError: (error: any) => {},
  });

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((token?._id || state?._id) && company?._id) {
      const feedback = {
        userId: state?._id || token?._id,
        companyId: company?._id,
        position,
        category: selectedCategory,
        positives,
        negatives,
        rating,
        date: new Date(),
      };
      submitFeedback.handleFetch(
        "http://localhost:9000/recenzije/nova-recenzija",
        feedback
      );
    }
    handleClose();
    setSubmitted(true);
  };

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const handleDelete = (id: string) => {
    setFeedbackId(id);
    deleteFeedback.handleFetch(
      `http://localhost:9000/recenzije/izbrisi/${company?._id}/${id}`
    );
  };

  const getAllSelected = (filterOptions: IFeedback[]) => {
    setSelectedFeedbacks(filteringService(filterOptions, allFeedbacks));
  };

  const resetSelected = () => setSelectedFeedbacks(allFeedbacks);

  const onSelected = (selected: string) => {
    setSelectedCategory(selected);
  };

  return (
    <>
      {allFeedbacks && (
        <>
          <Container>
            <Row className="feedbacks__specifics">
              {company && (
                <>
                  <Col xlg={7} lg={7} md={7}>
                    <Filter
                      filterOptions={[
                        { en: "position", hr: "Pozicija" },
                        { en: "rating", hr: "Ocjena" },
                        { en: "category", hr: "Kategorija"}
                      ]}
                      jobs={allFeedbacks}
                      getAllSelected={getAllSelected}
                      resetSelected={resetSelected}
                      title={`Odaberite recenziju za tvrtku ${company.companyName}`}
                      additional="feedbacks"
                    />
                    {selectedFeedbacks.length === 0 && (
                      <p className="feedbacks__none">
                        Trenutno ne postoji recenzija koja zadovoljava odabrane
                        vrijednosti filtriranja
                      </p>
                    )}
                    {allFeedbacks.length > 0 && (
                      <section className="feedbacks__specific">
                        {selectedFeedbacks.map(
                          (feedback: IFeedback, index: number) => (
                            <article
                              className="feedbacks__specific-article"
                              key={index}
                            >
                              <div className="feedbacks__specific-headline">
                                <div className="feedbacks__specific-rating">
                                  <p className="feedbacks__specific-rating--main">
                                    {feedback.rating}
                                  </p>
                                  <div className="feedbacks__specific-rating--img">
                                    <Rating rating={+feedback.rating}></Rating>
                                  </div>
                                </div>
                                <div className="feedbacks__specific-main">
                                  <h1>Osvrt od {feedback.position}</h1>
                                  <p className="feedbacks__specific-date">
                                    {moment(feedback.date.toString()).format(
                                      "LL"
                                    )}
                                    .
                                  </p>
                                </div>
                              </div>
                              <div className="feedbacks__specific-wrapper">
                                {(feedback.userId === state._id ||
                                  feedback.userId === token?._id) && (
                                  <div className="feedbacks__specific-delete">
                                    <Button
                                      variant="danger"
                                      onClick={() => handleDelete(feedback._id)}
                                    >
                                      X
                                    </Button>
                                  </div>
                                )}
                                <ul className="feedbacks__specific-overview">
                                  <h2 className="feedbacks__specific-title">
                                    Prednosti
                                  </h2>
                                  <p
                                    className="feedbacks__specific-text"
                                    dangerouslySetInnerHTML={{
                                      __html: feedback.positives,
                                    }}
                                  />
                                  <h2 className="feedbacks__specific-title">
                                    Nedostatci
                                  </h2>
                                  <p
                                    className="feedbacks__specific-text"
                                    dangerouslySetInnerHTML={{
                                      __html: feedback.negatives,
                                    }}
                                  />
                                </ul>
                              </div>
                            </article>
                          )
                        )}
                      </section>
                    )}
                  </Col>
                  <Col xlg={4} lg={4} md={4}>
                    <aside className="feedbacks__aside">
                      <div className="feedbacks__aside-company">
                        <Link to={`/profil/${company._id}`}>
                          <img
                            src={
                              "http://localhost:9000/" + company?.companyImage
                            }
                          ></img>
                        </Link>
                        <div className="feedbacks__aside-info">
                          <h2 className="feedbacks__aside-info--text">
                            <span>Tvrtka:</span>
                            <span className="feedbacks__aside-info--title">
                              {company?.companyName}
                            </span>
                          </h2>
                          <p className="feedbacks__aside-info--text">
                            <span>Adresa:</span>
                            <span className="feedbacks__aside-info--more">
                              {company?.companyAddress}
                            </span>
                          </p>
                          <p className="feedbacks__aside-info--text">
                            <span>Email:</span>
                            <span className="feedbacks__aside-info--more">
                              {company?.companyEmail}
                            </span>
                          </p>
                          <p className="feedbacks__aside-info--text">
                            <span>Kontakt:</span>
                            <span className="feedbacks__aside-info--more">
                              {company?.companyNumber}
                            </span>
                          </p>
                        </div>
                      </div>
                      {(state?.user || token?.user) && <Button
                        className="feedbacks__aside-btn"
                        onClick={() => setShow(true)}
                        disabled={submitted}
                      >
                        Dodaj osvrt
                      </Button>}
                      {(!state?.user && !token?.user) && <Button
                        className="feedbacks__aside-btn--alt"
                        onClick={() => navigate(-1)}
                        disabled={submitted}
                      >
                        Natrag
                      </Button>}
                      <Modal
                        title="Nova recenzija"
                        show={show}
                        setShow={setShow}
                        handleClose={handleClose}
                        handleSubmit={handleSubmit}
                      >
                        <Form>
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicEmail"
                          >
                            <Form.Control
                              type="text"
                              placeholder="Pozicija"
                              value={position}
                              onChange={(e) => setPosition(e.target.value)}
                            />
                          </Form.Group>
                          <FeedbackCategories
                            onSelected={onSelected}
                          ></FeedbackCategories>
                          <ul className={`modal-more ${selectedCategory ? 'modal-more--show': ''}`}>
                            <Form.Group
                              className="mb-3"
                              controlId="formBasicPassword"
                            >
                              <Form.Control
                                as="textarea"
                                placeholder="Prednosti"
                                style={{ height: "100px" }}
                                value={positives}
                                onChange={(e) => setPositives(e.target.value)}
                              />
                            </Form.Group>
                            <Form.Group
                              className="mb-3"
                              controlId="formBasicPassword"
                            >
                              <Form.Control
                                as="textarea"
                                placeholder="Nedostatci"
                                style={{ height: "100px" }}
                                value={negatives}
                                onChange={(e) => setNegatives(e.target.value)}
                              />
                            </Form.Group>
                            <Form.Group></Form.Group>
                            <Form.Group
                              className="mb-3"
                              controlId="formBasicEmail"
                            >
                              <Rating
                                rating={rating}
                                setRating={setRating}
                              ></Rating>
                            </Form.Group>
                          </ul>
                          <Form.Group>
                            {(token?.user || state.user) && <Button
                              className="modal-btn"
                              size="lg"
                              variant="primary"
                              onClick={handleSubmit}
                              disabled={submitted}
                            >
                              Dodaj recenziju
                            </Button>}
                          </Form.Group>
                        </Form>
                      </Modal>
                    </aside>
                  </Col>
                </>
              )}
            </Row>
          </Container>
          {getCompanies.status === 'Pending' && <LoadingSpinner></LoadingSpinner>}
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
      )}
    </>
  );
};

export default SpecificFeedback;
