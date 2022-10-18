import React from "react";
import { ISteps, IStep2 } from "./Steps.types";
import { Form, Button } from "react-bootstrap";

const Step2 = ({
  nextStep,
  previousStep,
  setCompanyAddress,
  setCompanyNumber,
  setAbout,
}: IStep2 & ISteps) => {
  const location = window.location.href.split("/");
  const lastItem = location[location.length - 1];

  return (
    <>
      {lastItem === "poslodavci" && (
        <>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Adresa tvrtke</Form.Label>
            <Form.Control
              type="text"
              placeholder="Adresa tvrtke..."
              onChange={(e) => setCompanyAddress!(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Kontakt tvrtke</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Kontakt..."
              onChange={(e) => setCompanyNumber!(e.target.value)}
            />
          </Form.Group>
        </>
      )}
      {lastItem === "posloprimci" && (
        <>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Predstavite se</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Opišite nam se u kratkim crtama..."
              style={{ height: "100px" }}
              onChange={(e) => setAbout!(e.target.value)}
            />
          </Form.Group>
        </>
      )}
      <div className="user__form-buttons">
        <Button onClick={nextStep}>Idući korak</Button>
        <Button variant="warning" onClick={() => previousStep!()}>
          Natrag
        </Button>
      </div>
    </>
  );
};

export default Step2;
