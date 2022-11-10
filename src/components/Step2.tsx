import React from "react";
import { ISteps, IStep2 } from "./Steps.types";
import { Form, Button } from "react-bootstrap";
import ImageUpload from "./ImageUpload";

const Step2 = ({
  nextStep,
  previousStep,
  setCompanyAddress,
  setCompanyLocation,
  setCompanyImage,
  setAbout,
}: IStep2 & ISteps) => {
  const location = window.location.href.split("/");
  const lastItem = location[location.length - 1];
  const onInput = (file: File, valid: any) => {
    setCompanyImage!(file);
  };

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
              type="text"
              placeholder="Sjedište tvrtke"
              onChange={(e) => setCompanyLocation!(e.target.value)}
            />
          </Form.Group>
          <ImageUpload onInput={onInput} />
        </>
      )}
    </>
  );
};

export default Step2;
