import React, { useState, useContext, useRef, RefObject } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { IFormSwitch } from "./User.types";

import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReactGA from 'react-ga4';

const UserLogin = ({
  changeShowingForm,
  handleToastError,
  handleToastSuccess,
}: IFormSwitch) => {
  const { dispatch } = useContext(AuthContext);
  const email = useRef() as RefObject<HTMLInputElement>;
  const [password, setPassword] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const getUser = useFetch({
    url: email.current
      ? `http://localhost:9000/posloprimci/odredeni-posloprimac/${
          email.current!.value
        }`
      : "",
    method: "get",
    onSuccess: (data) => {
      setFullname(data.fullname);
    },
    onError: (error) => {
    },
    onInit: false
  });

  const loginUser = useFetch({
    url: `http://localhost:9000/posloprimci/login-posloprimac`,
    method: "post",
    onSuccess: (data) => {
      if (data.token && fullname) {
        handleToastSuccess!(data.message);
        const decoded: any = jwt_decode(data.token);
        dispatch!({ type: "LOGIN", payload: { ...decoded, fullname } });
        localStorage.setItem(
          "decodedToken",
          JSON.stringify({ ...decoded, fullname })
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

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await getUser.handleFetch(
      `http://localhost:9000/posloprimci/odredeni-posloprimac/${
        email.current!.value
      }`
    );
    await loginUser.handleFetch(
      "http://localhost:9000/posloprimci/login-posloprimac",
      {
        email: email.current!.value,
        password,
      }
    );
  };

  return (
    <>
    <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control type="email" placeholder="Email" ref={email} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button className="user__login-btn" type="submit">
        Login
      </Button>
      <Button className="user__switch-btn" onClick={changeShowingForm}>
        Još nisi registriran? Učini to u par koraka
      </Button>
    </Form>
    {status === 'Pending' && <LoadingSpinner/>}
    </>
  );
};

export default UserLogin;
