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
  setNumber,
  setAddress,
  setLocation,
  emailRef
}: ISteps & IStep1) => {
  const location = window.location.href.split("/");
  const lastItem = location[location.length - 1];

  return (
    <div>
      {lastItem === "poslodavci" && (
        <>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="string"
              placeholder="Naziv tvrtke"
              onChange={(e) => setCompanyName!(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="email"
              placeholder="Email tvrtke"
              onChange={(e) => setCompanyEmail!(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
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
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Broj mobitela"
              onChange = {(e) => setNumber!(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Adresa"
              onChange = {(e) => setAddress!(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Grad"
              onChange = {(e) => setLocation!(e.target.value)}
            />
          </Form.Group>
        </>
      )}
    </div>
  );
};

export default Step1;
