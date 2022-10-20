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
            <Form.Control
              type="text"
              placeholder="Adresa tvrtke"
              onChange={(e) => setCompanyAddress!(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="tel"
              placeholder="Kontakt telefon tvrtke"
              onChange={(e) => setCompanyNumber!(e.target.value)}
            />
          </Form.Group>
        </>
      )}
    </>
  );
};

export default Step2;
