import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Form, Button, Accordion } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ICompany } from "../companies/Company.types";

import useFetch from "../../hooks/useFetch";

import Editor from '../../components/Editor';
import { IJobs } from "./Jobs.types";

interface IChangeJob {
  setRefetch: (bool: boolean) => void;
}

const ChangeJob: React.FC<IChangeJob> = ({ setRefetch }) => {
  const [editCompany, setEditCompany] = useState<null | (IJobs & ICompany)>(null);
  const [position, setPosition] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");
  const [pay, setPay] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showing, setShowing] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const params = useParams();
  const navigate = useNavigate();

  const getSpecificJob = useFetch({
    url: `http://localhost:9000/poslovi/${params.id}`,
    method: "get",
    onSuccess: (data) => {
      setEditCompany(data);
      if (data) {
        setPosition(data.position);
        setLocation(data.location);
        setPay(data.pay);
        setSelectValue(data.seniority);
        setDescription(data.description);
      }
    },
    onError: (error) => {},
  });

  const changeJob = useFetch({
    url: `http://localhost:9000/poslovi/izmijeni-oglas/${params.id}`,
    method: "put",
    onSuccess: (data) => {
      toast.success("Uspješno ste izmjenili oglas", { autoClose: 3000 });
      setRefetch(true);
      setTimeout(() => {
        navigate(-1);
      }, 3000);
      setStatus('Pending');
    },
    onError: (error) => {
      toast.error("Došlo je do pogrješke", { autoClose: 3000 });
    },
  });

  const submitHandler = (e: React.FormEvent) => {
    setShowing(!showing);
    e.preventDefault();

    changeJob.handleFetch(
      `http://localhost:9000/poslovi/izmijeni-oglas/${params.id}`,
      {
        companyId: editCompany?.companyId,
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
      {editCompany && <Form className="newjob__form" onSubmit={submitHandler}>
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
                    defaultValue={editCompany?.position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicLocation">
                  <Form.Control
                    type="text"
                    placeholder="Lokacija"
                    defaultValue={editCompany?.location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicSeniority">
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => setSelectValue(e.target.value)}
                    onLoad={() => setLocation(editCompany?.seniority)}
                    defaultValue={editCompany?.seniority}
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
                    defaultValue={editCompany?.pay}
                    onChange={(e) => setPay(e.target.value)}
                  />
                </Form.Group>
              </div>
            </Col>
            <Col md={6} lg={6}>
              <Editor defaultValue={editCompany?.description} value={description} setValue={setDescription}></Editor>
            </Col>
            <Col md={8} lg={8}>
              <Button className="newjob__btn" type="submit">Izmijeni oglas</Button>
            </Col>
          </Row>
        </Container>
      </Form>}
      {(getSpecificJob.status === "Pending" || status === 'Pending') && <LoadingSpinner></LoadingSpinner>}
    </div>
  );
};

export default ChangeJob;
