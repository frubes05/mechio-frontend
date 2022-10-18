import React, { useState, useContext, useRef, RefObject } from "react";
import ImageUpload from "../../components/ImageUpload";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { Form, Button } from "react-bootstrap";
import { IFormSwitch } from "./User.types";
import StepWizard from "react-step-wizard";
import Step1 from "../../components/Step1";
import Step2 from "../../components/Step2";
import Step3 from "../../components/Step3";

import useFetch from "../../hooks/useFetch";

const UserRegister = ({
  changeShowingForm,
  handleToastError,
  handleToastSuccess,
}: IFormSwitch) => {
  const { dispatch } = useContext(AuthContext);
  const [fullname, setFullname] = useState<string>("");
  const email = useRef() as RefObject<HTMLInputElement>;
  const [password, setPassword] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [cv, setCv] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const checkUser = useFetch({
    url: email.current
      ? `https://mechio-api-test.onrender.com/posloprimci/odredeni-posloprimac/${email.current!.value}`
      : "",
    method: "get",
    onSuccess: (data) => {
      setFullname(data[0]?.fullname);
    },
    onError: (error) => {
    },
  });

  const registerUser = useFetch({
    url: `https://mechio-api-test.onrender.com/posloprimci/novi-posloprimac`,
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
      }
    },
    onError: (error) => {
      handleToastError!(error);
    },
  });

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await checkUser.handleFetch(
      `https://mechio-api-test.onrender.com/posloprimci/odredeni-posloprimac/${email.current!.value}`
    );
    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email.current!.value);
      formData.append("password", password);
      formData.append("about", about);
      formData.append("cv", cv);
      if (image) formData.append("image", image);

      await registerUser.handleFetch(
        "https://mechio-api-test.onrender.com/posloprimci/novi-posloprimac",
        formData
      );
    } catch (error) {
    }
  };

  const onInput = (file: File, valid: any) => {
    setImage(file);
  };

  return (
    <Form onSubmit={submitHandler}>
      <StepWizard>
        <Step1
          setFullname={setFullname}
          emailRef = {email}
          setPassword={setPassword}
        ></Step1>
        <Step3 setCv={setCv} onInput={onInput}></Step3>
      </StepWizard>
      <Button className="user__switch-btn" onClick={changeShowingForm}>
        Posjeduješ već račun? Slobodno se prijavi
      </Button>
    </Form>
  );
};

export default UserRegister;
