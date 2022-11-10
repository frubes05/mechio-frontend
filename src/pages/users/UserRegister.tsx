import React, { useState, useContext, useRef, RefObject } from "react";
import ImageUpload from "../../components/ImageUpload";
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

const UserRegister = ({
  changeShowingForm,
  handleToastError,
  handleToastSuccess,
}: IFormSwitch) => {
  const { dispatch } = useContext(AuthContext);
  const [fullname, setFullname] = useState<string>("");
  const email = useRef() as RefObject<HTMLInputElement>;
  const [password, setPassword] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [cv, setCv] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const checkUser = useFetch({
    url: email.current
      ? `http://localhost:9000/posloprimci/odredeni-posloprimac/${
          email.current!.value
        }`
      : "",
    method: "get",
    onSuccess: (data) => {
      setFullname(data[0]?.fullname);
    },
    onError: (error) => {},
    onInit: false,
  });

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

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await checkUser.handleFetch(
      `http://localhost:9000/posloprimci/odredeni-posloprimac/${
        email.current!.value
      }`
    );
    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email.current!.value);
      formData.append("password", password);
      formData.append("number", number);
      formData.append("address", address);
      formData.append("location", location);
      formData.append("about", about);
      if (cv) {
        formData.append("cv", cv);
      }
      if (image) formData.append("image", image);

      await registerUser.handleFetch(
        "http://localhost:9000/posloprimci/novi-posloprimac",
        formData
      );
    } catch (error) {}
  };

  const onInput = (file: File, valid: any) => {
    setImage(file);
  };

  const onPDFInput = (file: File, valid: any) => {
    setCv(file);
  };

  return (
    <>
      <Form onSubmit={submitHandler} className="company__form-register">
      <div className="company__form-register--left">
        <Step1
          setFullname={setFullname}
          setNumber={setNumber}
          emailRef={email}
          setPassword={setPassword}
        ></Step1>
      </div>
      <div className="company__form-register--right">
        <Step3
          setAddress={setAddress}
          setLocation={setLocation}
          onPDFInput={onPDFInput}
          onInput={onInput}
        ></Step3>
      </div>
      </Form>
      <Button variant="primary" type="submit" className="user__login-btn" onClick={submitHandler}>
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
