import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ICompanyToken } from "../companies/Company.types";
import { toast, ToastContainer } from "react-toastify";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "react-toastify/dist/ReactToastify.css";
import Editor from "../../components/Editor";

import { GTMTrackingHelper } from "../../services/GTMService";
import moment from "moment";
import "moment/locale/hr";
import useSWRMutation from "swr/mutation";
import { sendRequest } from "../../services/fetcher";

const NewJob: React.FC = () => {
  moment().locale("hr");
  const { state } = useContext(AuthContext);
  const [position, setPosition] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");
  const [pay, setPay] = useState<string>("");
  const [token, setToken] = useState<ICompanyToken | null>(null);
  const [description, setDescription] = useState<string>("");
  const { trigger } = useSWRMutation(`https://mechio-api-test.onrender.com/poslovi/novi-oglas`, sendRequest, {
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

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      companyId: state._id || token?._id,
      company: state.companyName || token?.companyName,
      companyPremium: state.companyPremium || token?.companyPremium,
      position,
      description,
      location,
      pay,
      seniority: selectValue,
      date: new Date(),
    };
    console.log(newPost);
    trigger(newPost);
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
    </div>
  );
};

export default NewJob;
