import React from "react";
import { ISteps, IStep1 } from "./Steps.types";
import { Form, Button } from "react-bootstrap";

const Step1 = ({
  nextStep,
  setCompanyName,
  setCompanyEmail,
  setCompanyPassword,
  setFullname,
  setPassword,
  setEmail,
  emailRef
}: ISteps & IStep1) => {
  const location = window.location.href.split("/");
  const lastItem = location[location.length - 1];

  return (
    <div>
      {lastItem === "poslodavci" && (
        <>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Naziv tvrtke</Form.Label>
            <Form.Control
              type="string"
              placeholder="Puni naziv..."
              onChange={(e) => setCompanyName!(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Email tvrtke</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email..."
              onChange={(e) => setCompanyEmail!(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Lozinka poslodavca</Form.Label>
            <Form.Control
              type="password"
              placeholder="Lozinka..."
              onChange={(e) => setCompanyPassword!(e.target.value)}
            />
          </Form.Group>
        </>
      )}
      {lastItem === "posloprimci" && (
        <>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="string"
              placeholder="Ime i prezime"
              onChange={(e) => setFullname!(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="email"
              placeholder="Email"
              ref = {emailRef}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword!(e.target.value)}
            />
          </Form.Group>
        </>
      )}
    </div>
  );
};

export default Step1;
