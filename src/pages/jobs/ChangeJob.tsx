import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Form, Button, Accordion } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ICompany } from "../companies/Company.types";

import useFetch from "../../hooks/useFetch";

interface IChangeJob {
  setRefetch: (bool: boolean) => void;
  status: string;
}

const ChangeJob: React.FC<IChangeJob> = ({ setRefetch, status }) => {
  const [editCompany, setEditCompany] = useState<null | ICompany>(null);
  const [position, setPosition] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [pay, setPay] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showing, setShowing] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();

  const getSpecificJob = useFetch({
    url: `https://mechio-api-test.onrender.com/poslovi/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setEditCompany(data);
    },
    onError: (error) => {},
  });

  const changeJob = useFetch({
    url: `https://mechio-api-test.onrender.com/poslovi/izmijeni-oglas/${params.id}`,
    method: "put",
    onSuccess: (data) => {
      toast.success("Uspješno ste izmjenili oglas", { autoClose: 3000 });
      setRefetch(true);
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    },
    onError: (error) => {
      toast.error("Došlo je do pogrješke", { autoClose: 3000 });
    },
  });

  const submitHandler = (e: React.FormEvent) => {
    setShowing(!showing);
    e.preventDefault();

    changeJob.handleFetch(
      `https://mechio-api-test.onrender.com/poslovi/izmijeni-oglas/${params.id}`,
      {
        companyId: editCompany?._id,
        company: editCompany?.companyName,
        position,
        description,
        location,
        pay,
        seniority: selectValue,
        date: new Date(),
      }
    );
  };

  return (
    <div className="newjob">
      <ToastContainer></ToastContainer>
      <Form className="newjob__form" onSubmit={submitHandler}>
        <Container>
          <Row className="newjob__form-row">
            <Col md={8} lg={8}>
              <h1 className="newjob__form-title">Izmijeni oglas</h1>
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
              <Form.Group className="mb-3" controlId="formBasicDescription">
                <Form.Control
                  as="textarea"
                  placeholder="Opis očekivanja, kompetencija i pogodnosti rada na poziciji"
                  style={{ height: "100px" }}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={8} lg={8}>
              <Button type="submit">Izmijeni oglas</Button>
            </Col>
          </Row>
        </Container>
      </Form>
      {status === "Pending" && <LoadingSpinner></LoadingSpinner>}
    </div>
  );
};

export default ChangeJob;
