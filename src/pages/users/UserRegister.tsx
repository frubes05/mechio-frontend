import React, { useState, useContext, useRef, RefObject } from "react";
import ImageUpload from "../../components/ImageUpload";
import PDFUpload from "../../components/PDFUpload";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { Form, Button } from "react-bootstrap";
import { IFormSwitch } from "./User.types";
import Step1 from "../../components/Step1";
import Step2 from "../../components/Step2";
import Step3 from "../../components/Step3";

import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReactGA from "react-ga4";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup
  .object({
    fullname: yup.string().required("Ime je obavezno polje"),
    email: yup
      .string()
      .email("Unesite valjani email")
      .required("Email je obavezno polje"),
    password: yup
      .string()
      .min(8, "Unesite minimalno 8 znamenaka")
      .required("Password je obavezno polje"),
    number: yup
      .string()
      .matches(phoneRegExp, "Unesite valjani telefonski broj"),
    address: yup.string().required("Unesite valjanu adresu"),
    location: yup.string().required("Unesite valjani grad"),
  })
  .required();

const UserRegister = ({
  changeShowingForm,
  handleToastError,
  handleToastSuccess,
}: IFormSwitch) => {
  const { dispatch } = useContext(AuthContext);
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [cv, setCv] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("address", data.address);
    formData.append("location", data.location);
    formData.append("number", data.number);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("about", about);
    if (cv) {
      formData.append("cv", cv);
    }
    if (image) formData.append("image", image);
    await registerUser.handleFetch(
      "http://localhost:9000/posloprimci/novi-posloprimac",
      formData
    );
  };

  const registerUser = useFetch({
    url: `http://localhost:9000/posloprimci/novi-posloprimac`,
    method: "post",
    onSuccess: (data) => {
      if (data.token) {
        handleToastSuccess!(data.message);
        const decoded: any = jwt_decode(data.token);
        dispatch!({ type: "REGISTER", payload: { ...decoded, fullname } });
        localStorage.setItem(
          "decodedToken",
          JSON.stringify({ ...decoded, fullname })
        );
        setStatus("Pending");
        ReactGA.event("korisnička_registracija", {
          category: "korisnička_registracija",
          action: "Nova Registracija",
        });
      }
    },
    onError: (error) => {
      handleToastError!(error);
      setStatus("Pending");
      setTimeout(() => {
        setStatus("Fullfilled");
      }, 3000);
    },
    onInit: true,
  });

  const onInput = (file: File, valid: any) => {
    setImage(file);
  };

  const onPDFInput = (file: File, valid: any) => {
    setCv(file);
  };

  return (
    <>
      <Form className="company__form-register">
        <div className="company__form-register--left">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="string"
              placeholder="Ime i prezime"
              className={`${errors.fullname?.message ? 'error' : ''}`}
              {...register("fullname", { required: true })}
            />
            <Form.Text>
              {errors.fullname?.message}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
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
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Broj mobitela"
              className={`${errors.number?.message ? 'error' : ''}`}
              {...register("number", { required: true })}
            />
            <Form.Text>
              {errors.number?.message}
            </Form.Text>
          </Form.Group>
        </div>
        <div className="company__form-register--right">
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Adresa"
              className={`${errors.address?.message ? 'error' : ''}`}
              {...register("address", { required: true })}
            />
            <Form.Text>
              {errors.address?.message}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Grad"
              className={`${errors.location?.message ? 'error' : ''}`}
              {...register("location", { required: true })}
            />
            <Form.Text>
              {errors.location?.message}
            </Form.Text>
          </Form.Group>
          <PDFUpload onInput={onPDFInput!} />
          <ImageUpload onInput={onInput!} />
        </div>
      </Form>
      <Button
        variant="primary"
        type="submit"
        className="user__login-btn"
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid}
      >
        Registracija
      </Button>
      <Button className="user__switch-btn" onClick={changeShowingForm}>
        Posjeduješ već račun? Slobodno se prijavi
      </Button>
      {status === "Pending" && <LoadingSpinner />}
    </>
  );
};

export default UserRegister;
