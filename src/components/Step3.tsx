import React from "react";
import { Form, Button } from "react-bootstrap";
import { IStep3, ISteps } from "./Steps.types";
import ImageUpload from "./ImageUpload";

const Step3 = ({
  setCompanyDescription,
  setCv,
  onInput,
  nextStep,
  previousStep,
}: IStep3 & ISteps) => {
  const location = window.location.href.split("/");
  const lastItem = location[location.length - 1];

  return (
    <>
      {lastItem === "poslodavci" && (
        <>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Predstavite se</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Opišite nam se u kratkim crtama..."
              style={{ height: "100px" }}
              onChange={(e) => setCompanyDescription!(e.target.value)}
            />
          </Form.Group>
          <div className="company__form-buttons">
            <Button onClick={() => nextStep!()}>Idući korak</Button>
            <Button variant="warning" onClick={() => previousStep!()}>
              Natrag
            </Button>
          </div>
        </>
      )}
      {lastItem === "posloprimci" && (
        <>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Vaš životopis</Form.Label>
            <Form.Control
              type="text"
              placeholder="Priložite vaš životopis..."
              onChange={(e) => setCv!(e.target.value)}
            />
          </Form.Group>
          <ImageUpload onInput={onInput!} />
          <div className="user__form-buttons">
            <Button variant="primary" type="submit">
              Registriraj se
            </Button>
            <Button variant="warning" onClick={() => previousStep!()}>
              Natrag
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default Step3;
