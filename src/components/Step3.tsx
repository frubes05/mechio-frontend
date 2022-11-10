import React from "react";
import { Form, Button } from "react-bootstrap";
import { IStep3, ISteps } from "./Steps.types";
import ImageUpload from "./ImageUpload";
import PDFUpload from "./PDFUpload";

const Step3 = ({
  setCompanyDescription,
  setAddress,
  setLocation,
  onPDFInput,
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
            <Form.Control
              type="text"
              placeholder="Adresa"
              onChange={(e) => setAddress!(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Grad"
              onChange={(e) => setLocation!(e.target.value)}
            />
          </Form.Group>
          <PDFUpload onInput={onPDFInput!} />
          <ImageUpload onInput={onInput!} />
        </>
      )}
    </>
  );
};

export default Step3;
