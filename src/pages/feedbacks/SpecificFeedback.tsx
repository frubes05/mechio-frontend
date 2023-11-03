import React, { useState, useContext, useEffect, lazy } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ICompanyToken } from "../companies/Company.types";
import { AuthContext } from "../../context/AuthContext";
import { IUserToken } from "../users/User.types";
import { IFeedback } from "./Feedbacks.types";
import moment from "moment";
import "moment/locale/hr";

import Rating from "../../components/Rating";
import Filter from "../../components/Filter";

import { filteringService } from "../../services/filtering";
import FeedbackCategories from "./FeedbackCategories";
import { deleteRequest, fetcher, sendRequest } from "../../services/fetcher";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const Modal = lazy(() => import("../../components/Modal"));

const categories = [
  {
    category: "team",
    hr: "Tim",
  },
  {
    category: "projects",
    hr: "Projekti",
  },
  {
    category: "technology",
    hr: "Tehnologije",
  },
  {
    category: "culture",
    hr: "Kultura",
  },
  {
    category: "pay",
    hr: "Plaća",
  },
];

const SpecificFeedback = () => {
  const params = useParams();
  const navigate = useNavigate();
  moment().locale("hr");
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<ICompanyToken & IUserToken>();
  const [show, setShow] = useState<boolean>(false);
  const [position, setPosition] = useState<string>("");
  const [positives, setPositives] = useState<string>("");
  const [negatives, setNegatives] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<IFeedback[] | []>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<{
    hr: string;
    category: string;
  } | null>(null);
  const { data: company } = useSWR(
    `https://mechio-api-test.onrender.com/poslodavci/${params.id}`,
    fetcher
  );
  const { data: allFeedbacks, mutate } = useSWR(
    `https://mechio-api-test.onrender.com/recenzije/${params.id}`,
    fetcher
  );
  const { trigger: submitFeedbackTrigger } = useSWRMutation(
    `https://mechio-api-test.onrender.com/recenzije/nova-recenzija`,
    sendRequest,
    {
      onSuccess: (data) => {
        const { data: newFeedbacks } = data;
        mutate(newFeedbacks)
      }
    }
  );
  const { trigger: deleteFeedbackTrigger } = useSWRMutation(
    () => `https://mechio-api-test.onrender.com/recenzije/izbrisi/${company?._id}`,
    deleteRequest,
    {
      onSuccess: (data) => {
        const { deleteId } = data;
        mutate(allFeedbacks?.filter((feedback: IFeedback) => feedback.userId !== deleteId) || [])
      }
    }
  );

  const handleClose = () => {
    setShow(false);
    setPosition("");
    setNegatives("");
    setPositives("");
    setRating(0);
    setSelectedCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((token?._id || state?._id) && company?._id) {
      const feedback = {
        userId: state?._id || token?._id,
        companyId: company?._id,
        companyImage: company?.companyImage,
        companyName: company?.companyName,
        position,
        category: selectedCategory?.hr,
        positives,
        negatives,
        rating,
        date: new Date(),
      };
      submitFeedbackTrigger(feedback);
      setPosition("");
      setNegatives("");
      setPositives("");
      setRating(0);
      setSelectedCategory(null);
    }
    handleClose();
  };

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const handleDelete = (id: string) => {
    deleteFeedbackTrigger(id);
  };

  const getAllSelected = (filterOptions: IFeedback[]) => {
    setSelectedFeedbacks(filteringService(filterOptions, allFeedbacks));
  };

  const resetSelected = () => setSelectedFeedbacks(allFeedbacks);

  const onSelected = (selected: { hr: string; category: string }) => {
    if (selected) {
      setSelectedCategory({ category: selected.category, hr: selected.hr });
    }
  };

  useEffect(() => {
    if (allFeedbacks) {
      setSelectedFeedbacks(allFeedbacks);
    }
  }, [allFeedbacks]);

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
                        { en: "category", hr: "Kategorija" },
                      ]}
                      jobs={allFeedbacks}
                      getAllSelected={getAllSelected}
                      resetSelected={resetSelected}
                      title={`Odaberite recenziju za tvrtku ${company.companyName}`}
                      additional="feedbacks"
                      condensed
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
                          (feedback: IFeedback, index: number) => {
                            const getCategoryName = categories.find(
                              (cat) => cat.hr === feedback.category
                            )?.category;
                            return (
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
                                      <Rating
                                        rating={+feedback.rating}
                                      ></Rating>
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
                                  <p
                                    className={`feedbacks__specific-category feedbacks__specific-category--${getCategoryName}`}
                                  >
                                    <span>{feedback.category}</span>
                                  </p>
                                  {(feedback.userId === state._id ||
                                    feedback.userId === token?._id) && (
                                    <div className="feedbacks__specific-delete">
                                      <Button
                                        variant="danger"
                                        onClick={() =>
                                          handleDelete(feedback._id)
                                        }
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
                            );
                          }
                        )}
                      </section>
                    )}
                  </Col>
                  <Col xlg={4} lg={4} md={4}>
                    <aside className="feedbacks__aside">
                      <div className="feedbacks__aside-company">
                        <h2 className="profile__main-title">Tvrtka</h2>
                        <Link to={`/profil/${company._id}`}>
                          <img
                            src={
                              "https://mechio-api-test.onrender.com/" +
                              company?.companyImage
                            }
                            alt={company?.companyName}
                          ></img>
                        </Link>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Control
                            type="text"
                            disabled
                            value={company.companyName}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Control
                            type="text"
                            disabled
                            value={company.companyEmail}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Control
                            type="text"
                            disabled
                            value={company.companyNumber}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Control
                            type="text"
                            disabled
                            value={company.companyAddress}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Control
                            type="text"
                            disabled
                            value={company.companyLocation}
                          />
                        </Form.Group>
                      </div>
                      {(state?.user || token?.user) && (
                        <Button
                          className="feedbacks__aside-btn"
                          onClick={() => setShow(true)}
                        >
                          Dodaj osvrt
                        </Button>
                      )}
                      {!state?.user && !token?.user && (
                        <Button
                          className="feedbacks__aside-btn--alt"
                          onClick={() => navigate(-1)}
                        >
                          Natrag
                        </Button>
                      )}
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
                            categories={categories}
                          ></FeedbackCategories>
                          <ul
                            className={`modal-more ${
                              selectedCategory && selectedCategory.category
                                ? "modal-more--show"
                                : "modal-more--remove"
                            }`}
                          >
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
                            <Form.Group
                              className="mb-3"
                              controlId="formBasicEmail"
                            >
                              <div className="modal-rating">
                                <Form.Label>
                                  Odaberite ocjenu kategorije
                                </Form.Label>
                                <Rating
                                  rating={rating}
                                  setRating={setRating}
                                ></Rating>
                              </div>
                            </Form.Group>
                          </ul>
                          <Form.Group>
                            {(token?.user || state.user) && (
                              <Button
                                className="modal-btn"
                                size="lg"
                                variant="primary"
                                onClick={handleSubmit}
                              >
                                Dodaj recenziju
                              </Button>
                            )}
                          </Form.Group>
                        </Form>
                      </Modal>
                    </aside>
                  </Col>
                </>
              )}
            </Row>
          </Container>
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
