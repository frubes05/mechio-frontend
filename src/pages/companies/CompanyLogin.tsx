import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { ICompany, IFormSwitch } from "./Company.types";
import { Button, Form } from "react-bootstrap";

import useFetch from '../../hooks/useFetch';

const CompanyLogin = ({
  handleToastError,
  handleToastSuccess,
  changeShowingForm,
}: IFormSwitch) => {
  const { dispatch } = useContext(AuthContext);
  const [companies, setCompanies] = useState<ICompany[] | []>([]);
  const [companyEmail, setCompanyEmail] = useState<string>("");
  const [companyPassword, setCompanyPassword] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>('');

  const checkUser = useFetch({
    url: `https://mechio-api-test.onrender.com/poslodavci/${companyEmail}`,
    method: 'get',
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setCompanyName(data[0].companyName);
      }
    },
    onError: (error) => {
    }
  })

  const getCompanies = useFetch({
    url: "https://mechio-api-test.onrender.com/poslodavci",
    method: 'get',
    onSuccess: (data) => {
      setCompanies(data);
    },
    onError: (error) => {
    }
  })

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios
      .post("https://mechio-api-test.onrender.com/poslodavci/login-poslodavac", {
        companyEmail,
        companyPassword,
      })
      .then((res) => {
        if (res.data.token && companyName) {
          handleToastSuccess!(res.data.message);
          const decoded: any = jwt_decode(res.data.token);
          dispatch!({ type: "LOGIN", payload: { ...decoded, companyName } });
          localStorage.setItem("decodedToken", JSON.stringify({...decoded, companyName}));
        } else {
          handleToastError!(res.data.message);
        }
      });
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Upiši email tvrtke</Form.Label>
        <Form.Control
          type="email"
          placeholder="Email..."
          onChange={(e) => setCompanyEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Upiši lozinku tvrtke</Form.Label>
        <Form.Control
          type="password"
          placeholder="Lozinka..."
          onChange={(e) => setCompanyPassword(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Ulogirajte se
      </Button>
      <Button className="company__switch-btn" onClick={changeShowingForm}>
        Još niste registrirali tvrtku? Učinite to u par koraka
      </Button>
    </Form>
  );
};

export default CompanyLogin;
