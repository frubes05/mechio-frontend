import React, { useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { IFormSwitch } from "./Company.types";
import { Button, Form } from "react-bootstrap";
import ImageUpload from "../../components/ImageUpload";
import { ISteps } from "../../components/Steps.types";
import StepWizard from "react-step-wizard";
import Step1 from "../../components/Step1";
import Step2 from "../../components/Step2";
import Step3 from "../../components/Step3";
import Step4 from "../../components/Step4";

const CompanyRegister = ({
  changeShowingForm,
  handleToastError,
  handleToastSuccess,
}: IFormSwitch) => {
  const { dispatch } = useContext(AuthContext);
  const [companyName, setCompanyName] = useState<string>("");
  const [companyAddress, setCompanyAddress] = useState<string>("");
  const [companyNumber, setCompanyNumber] = useState<string>("");
  const [companyEmail, setCompanyEmail] = useState<string>("");
  const [companyPassword, setCompanyPassword] = useState<string>("");
  const [companyDescription, setCompanyDescription] = useState<string>("");
  const [companyImage, setCompanyImage] = useState<File | null>(null);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("companyAddress", companyAddress);
      formData.append("companyNumber", companyNumber);
      formData.append("companyEmail", companyEmail);
      formData.append("companyPassword", companyPassword);
      formData.append("companyDescription", companyDescription);
      if (companyImage) formData.append("image", companyImage);
      axios
        .post(
          "https://mechio-api-test.onrender.com/poslodavci/novi-poslodavac",
          formData
        )
        .then((res) => {
          if (res.data.token) {
            handleToastSuccess!(res.data.message);
            const decoded: any = jwt_decode(res.data.token);
            dispatch!({ type: "REGISTER", payload: { ...decoded } });
            localStorage.setItem("decodedToken", JSON.stringify(decoded));
          } else {
            handleToastError!(res.data.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Step1
        setCompanyName={setCompanyName}
        setCompanyEmail={setCompanyEmail}
        setCompanyPassword={setCompanyPassword}
      />
      <Step2
        setCompanyAddress={setCompanyAddress}
        setCompanyNumber={setCompanyNumber}
      />
      <Step4 setCompanyImage={setCompanyImage} />
      <Button className="company__switch-btn" onClick={changeShowingForm}>
        Vaša tvrtka već posjeduje račun? Slobodno se prijavite
      </Button>
    </Form>
  );
};

export default CompanyRegister;
