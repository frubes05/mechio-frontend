import React, { useState, useContext, useRef, RefObject } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { IFormSwitch } from "./User.types";

import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReactGA from "react-ga4";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    email: yup.string().email("Unesite valjani email").required('Email je obavezno polje'),
    password: yup.string().required('Password je obavezno polje'),
  })
  .required();

const UserLogin = ({
  changeShowingForm,
  handleToastError,
  handleToastSuccess,
}: IFormSwitch) => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const { email, password } = data;
    await getUser.handleFetch(
      `https://mechio-api-test.onrender.com/posloprimci/odredeni-posloprimac/${email}`
    );
    await loginUser.handleFetch(
      "https://mechio-api-test.onrender.com/posloprimci/login-posloprimac",
      {
        email,
        password
      }
    );
  };

  const getUser = useFetch({
    url: email
      ? `https://mechio-api-test.onrender.com/posloprimci/odredeni-posloprimac/${email}`
      : "",
    method: "get",
    onSuccess: (data) => {
      setFullname(data.fullname);
    },
    onError: (error) => {},
    onInit: false,
  });

  const loginUser = useFetch({
    url: `https://mechio-api-test.onrender.com/posloprimci/login-posloprimac`,
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
    onInit: true,
  });

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Email"
            className={`${errors.email?.message ? 'error' : ''}`}
            {...register("email", { required: true })}
          />
          <Form.Text>
            {errors.email?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            className={`${errors.password?.message ? 'error' : ''}`}
            {...register("password", { required: true })}
          />
          <Form.Text>
            {errors.password?.message}
          </Form.Text>
        </Form.Group>
        <Button className="user__login-btn" type="submit" disabled={!isValid}>
          Login
        </Button>
        <Button className="user__switch-btn" onClick={changeShowingForm}>
          Još nisi registriran? Učini to u par koraka
        </Button>
      </Form>
      {status === "Pending" && <LoadingSpinner />}
    </>
  );
};

export default UserLogin;
