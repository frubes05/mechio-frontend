import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import "react-toastify/dist/ReactToastify.css";

import Editor from '../../components/Editor';
import { changeRequest, fetcher } from "../../services/fetcher";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const ChangeJob: React.FC = () => {
  const [position, setPosition] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");
  const [pay, setPay] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showing, setShowing] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const { data: editCompany } = useSWR(() => `https://mechio-api-test.onrender.com/poslovi/${params.id}`, fetcher, {
    onSuccess: (data) => {
      if (data) {
        setPosition(data.position);
        setLocation(data.location);
        setPay(data.pay);
        setSelectValue(data.seniority);
        setDescription(data.description);
      }
    }
  });
  const { trigger: changeJobTrigger } = useSWRMutation(() => `https://mechio-api-test.onrender.com/poslovi/izmijeni-oglas/${params.id}`, changeRequest, {
    onSuccess: () => {
      toast.success("Uspješno ste izmjenili oglas", { autoClose: 3000 });
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    },
    onError: () => toast.error("Došlo je do pogrješke", { autoClose: 3000 })
  });

  const submitHandler = (e: React.FormEvent) => {
    setShowing(!showing);
    e.preventDefault();
    const editJob = {
      companyId: editCompany?.companyId,
      company: editCompany?.companyName,
      companyPremium: editCompany?.companyPremium,
      position,
      description,
      location,
      pay,
      seniority: selectValue,
      date: new Date(),
    };
    changeJobTrigger(editJob);
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
    </div>
  );
};

export default ChangeJob;
