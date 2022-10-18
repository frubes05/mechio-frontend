import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import Editor from "../../components/Editor";

const SpecificFeedback = () => {
  const params = useParams();
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
  const [allFeedbacks, setAllFeedbacks] = useState<IFeedback[] | null>(
    company?.companyFeedbacks || null
  );

  const getCompanies = useFetch({
    url: `https://mechio-test-api.onrender.com/poslodavci/${params.id}`,
    method: "get",
    onSuccess: (data: any) => {
      setCompany(data);
    },
    onError: (error: any) => {
    },
  });

  const getFeedbacks = useFetch({
    url: `https://mechio-test-api.onrender.com/recenzije/${params.id}`,
    method: "get",
    onSuccess: (data: any) => {
      setAllFeedbacks(data);
    },
    onError: (error: any) => {
    },
  });

  const submitFeedback = useFetch({
    url: "https://mechio-test-api.onrender.com/recenzije/nova-recenzija",
    method: "post",
    onSuccess: (data: any) => {
      getFeedbacks.handleFetch(`https://mechio-test-api.onrender.com/recenzije/${params.id}`);
    },
    onError: (error: any) => {},
  });

  const deleteFeedback = useFetch({
    method: "delete",
    onSuccess: (data) => {
      setAllFeedbacks((prev: any) => prev?.filter((feedback:any) => feedback._id !== feedbackId));
    },
    onError: (error: any) => {
    },
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
        positives,
        negatives,
        rating,
        date: new Date(),
      };
      submitFeedback.handleFetch(
        "https://mechio-test-api.onrender.com/recenzije/nova-recenzija",
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
    deleteFeedback.handleFetch(`https://mechio-test-api.onrender.com/recenzije/izbrisi/${company?._id}/${id}`);
  };
  
  return (
    <Container>
      <Row className="feedbacks__specifics">
        {company && (
          <>
            <Col xlg={8} lg={8} md={8}>
              <section className="feedbacks__specific">
                {allFeedbacks &&
                  allFeedbacks?.length > 0 &&
                  allFeedbacks.map((feedback: IFeedback, index: number) => (
                    <article
                      className="feedbacks__specific-article"
                      key={index}
                    >
                      <div className="feedbacks__specific-headline">
                        <h1>{feedback.position}</h1>
                        <p className="feedbacks__specific-date">
                          {feedback.date}
                        </p>
                      </div>
                      <div className="feedbacks__specific-wrapper">
                        {(feedback.userId === state._id || feedback.userId === token?._id) && <div className="feedbacks__specific-delete">
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(feedback._id)}
                          >
                            X
                          </Button>
                        </div>}
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
                  ))}
              </section>
            </Col>
            <Col xlg={9} lg={3} md={3}>
              <aside className="feedbacks__aside">
                <div className="feedbacks__aside-company">
                  <img
                    src={"https://mechio-test-api.onrender.com/" + company?.companyImage}
                  ></img>
                  <div>
                    <h2>{company?.companyName}</h2>
                    <p>{company?.companyDescription}</p>
                  </div>
                </div>
                <Button onClick={() => setShow(true)} disabled={submitted}>
                  Dodaj osvrt
                </Button>
                <Modal
                  title="Nova recenzija"
                  show={show}
                  setShow={setShow}
                  handleClose={handleClose}
                  handleSubmit={handleSubmit}
                >
                  <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Vaša pozicija</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="vaša pozicija"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Neke od prednosti tvrtke</Form.Label>
                      <Form.Control
                        type="textarea"
                        placeholder="Prednosti tvrtke"
                        value={positives}
                        onChange={(e) => setPositives(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Neki od nedostataka tvrtke</Form.Label>
                      <Form.Control
                        type="textarea"
                        placeholder="Nedostatci tvrtke"
                        value={negatives}
                        onChange={(e) => setNegatives(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group></Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Vaša ocjena tvrtke</Form.Label>
                      <Rating rating={rating} setRating={setRating}></Rating>
                    </Form.Group>
                    <Form.Group>
                      <Button
                        size="lg"
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={submitted}
                      >
                        Dodaj recenziju
                      </Button>
                    </Form.Group>
                  </Form>
                </Modal>
              </aside>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
};

export default SpecificFeedback;
