import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ICompanyToken } from "../companies/Company.types";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Form, Button, Accordion } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/LoadingSpinner";
import Editor from "../../components/Editor";

import useFetch from "../../hooks/useFetch";
import { GTMTrackingHelper } from "../../services/GTMService";
import moment from "moment";
import "moment/locale/hr";

interface INewJob {
  setRefetch: (bool: boolean) => void;
}

const NewJob: React.FC<INewJob> = ({ setRefetch }) => {
  moment().locale("hr");
  const { state } = useContext(AuthContext);
  const [position, setPosition] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");
  const [pay, setPay] = useState<string>("");
  const [token, setToken] = useState<ICompanyToken | null>(null);
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate();

  const addNewJob = useFetch({
    url: `https://mechio-api-test.onrender.com/poslovi/novi-oglas`,
    method: "post",
    onSuccess: (data) => {
      data.message !== 200
        ? toast.error(data.message, { autoClose: 3000 })
        : toast.success(data.message, { autoClose: 3000 });
      setTimeout(() => {
        navigate(-1);
      }, 4000);
      setRefetch(true);
      setStatus('Pending');
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

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      companyId: state._id || token?._id,
      company: state.companyName || token?.companyName,
      position,
      description,
      location,
      pay,
      seniority: selectValue,
      date: new Date(),
    };
    addNewJob.handleFetch("https://mechio-api-test.onrender.com/poslovi/novi-oglas", newPost);
    GTMTrackingHelper('Klik', 'Novi oglas', 'Poslovi',  `${state.companyName || token?.companyName}`, `${moment((new Date())).format("LL")}`);
  };

  return (
    <div className="newjob">
      <ToastContainer></ToastContainer>
      <Form className="newjob__form" onSubmit={submitHandler}>
        <Container>
          <Row className="newjob__form-row">
            <Col md={8} lg={8}>
              <h1 className="newjob__form-title">Novi oglas</h1>
            </Col>
            <Col md={5} lg={5}>
              <div className="newjob__form-wrapper">
                <Form.Group className="mb-3" controlId="formBasicPosition">
                  <Form.Control
                    type="text"
                    placeholder="Pozicija"
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicLocation">
                  <Form.Control
                    type="text"
                    placeholder="Lokacija"
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicSeniority">
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => setSelectValue(e.target.value)}
                    defaultValue="junior"
                    placeholder="Senioritet"
                  >
                    <option value="junior">Junior</option>
                    <option value="mid-level">Mid-level</option>
                    <option value="senior">Senior</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPay">
                  <Form.Control
                    type="text"
                    placeholder="Iznos plaće (HRK)"
                    onChange={(e) => setPay(e.target.value)}
                  />
                </Form.Group>
              </div>
            </Col>
            <Col md={6} lg={6}>
              <Editor value={description} setValue={setDescription}></Editor>
            </Col>
            <Col md={8} lg={8} className="newjob__form-btn">
              <Button type="submit">Dodaj novi oglas</Button>
            </Col>
          </Row>
        </Container>
      </Form>
      {status === "Pending" && <LoadingSpinner></LoadingSpinner>}
    </div>
  );
};

export default NewJob;
