import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { ICompany, IFormSwitch } from "./Company.types";
import { Button, Form } from "react-bootstrap";

import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../../components/LoadingSpinner";

const CompanyLogin = ({
  handleToastError,
  handleToastSuccess,
  changeShowingForm,
}: IFormSwitch) => {
  const { dispatch } = useContext(AuthContext);
  const [companies, setCompanies] = useState<ICompany[] | []>([]);
  const [companyEmail, setCompanyEmail] = useState<string>("");
  const [companyPassword, setCompanyPassword] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const checkUser = useFetch({
    url: companyEmail ? `http://localhost:9000/poslodavci/email/${companyEmail}` : "",
    method: "get",
    onSuccess: (data) => {
      if (data) {
        setCompanyName(data.companyName);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const getCompanies = useFetch({
    url: "http://localhost:9000/poslodavci",
    method: "get",
    onSuccess: (data) => {
      setCompanies(data);
    },
    onError: (error) => {},
  });

  const checkLogin = useFetch({
    url: "http://localhost:9000/poslodavci/login-poslodavac",
    method: "post",
    onSuccess: (data) => {
      console.log(data, companyName);
      if (data.token && companyName) {
        handleToastSuccess!(data.message);
        const decoded: any = jwt_decode(data.token);
        dispatch!({ type: "LOGIN", payload: { ...decoded, companyName } });
        localStorage.setItem(
          "decodedToken",
          JSON.stringify({ ...decoded, companyName })
        );
        setStatus("Pending");
      }
    },
    onError: (error) => {
      handleToastError!(error.message);
      setStatus("Pending");
      setTimeout(() => {
        setStatus("Fullfilled");
      }, 3000);
    },
  });

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    await checkUser.handleFetch(
      `http://localhost:9000/poslodavci/email/${companyEmail}`
    );

    try {
      await checkLogin.handleFetch(
        "http://localhost:9000/poslodavci/login-poslodavac",
        {
          companyEmail,
          companyPassword,
        }
      );
    } catch (error) {}
  };

  return (
    <>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Email"
            onChange={(e) => setCompanyEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setCompanyPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="company__login-btn">
          Ulogirajte se
        </Button>
        <Button className="company__switch-btn" onClick={changeShowingForm}>
          Još niste registrirali tvrtku? Učinite to u par koraka
        </Button>
      </Form>
      {status === "Pending" && <LoadingSpinner />}
    </>
  );
};

export default CompanyLogin;
