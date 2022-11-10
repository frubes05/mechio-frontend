import React, { useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { ICompany, IFormSwitch } from "./Company.types";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../../components/LoadingSpinner";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    companyEmail: yup.string().email("Unesite valjani email").required('Email je obavezno polje'),
    companyPassword: yup.string().required('Password je obavezno polje'),
  })
  .required();

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
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: any) => {
    const {companyEmail, companyPassword} = data;
    await checkUser.handleFetch(
      `http://localhost:9000/poslodavci/email/${companyEmail}`
    );
    await checkLogin.handleFetch(
      "http://localhost:9000/poslodavci/login-poslodavac",
      {
        companyEmail,
        companyPassword,
      }
    );
  };

  const checkUser = useFetch({
    url: companyEmail ? `http://localhost:9000/poslodavci/email/${companyEmail}` : "",
    method: "get",
    onSuccess: (data) => {
      if (data) {
        setCompanyName(data.companyName);
      }
      console.log(data);
    },
    onError: (error) => {
    },
    onInit: false
  });

  const getCompanies = useFetch({
    url: "http://localhost:9000/poslodavci",
    method: "get",
    onSuccess: (data) => {
      setCompanies(data);
    },
    onError: (error) => {},
    onInit: true
  });

  const checkLogin = useFetch({
    url: "http://localhost:9000/poslodavci/login-poslodavac",
    method: "post",
    onSuccess: (data) => {
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
    onInit: true
  });


  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Email"
            className={`${errors.companyEmail?.message ? 'error' : ''}`}
            {...register("companyEmail", { required: true })}
          />
          <Form.Text>
            {errors.companyEmail?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            className={`${errors.companyPassword?.message ? 'error' : ''}`}
            {...register("companyPassword", { required: true })}
          />
          <Form.Text>
            {errors.companyPassword?.message}
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit" className="company__login-btn" disabled={!isValid}>
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
