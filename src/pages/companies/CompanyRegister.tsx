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
import LoadingSpinner from "../../components/LoadingSpinner";

import useFetch from "../../hooks/useFetch";
import ReactGA from "react-ga4";

const CompanyRegister = ({
  changeShowingForm,
  handleToastError,
  handleToastSuccess,
}: IFormSwitch) => {
  const { dispatch } = useContext(AuthContext);
  const [companyName, setCompanyName] = useState<string>("");
  const [companyAddress, setCompanyAddress] = useState<string>("");
  const [companyLocation, setCompanyLocation] = useState<string>("");
  const [companyNumber, setCompanyNumber] = useState<string>("");
  const [companyEmail, setCompanyEmail] = useState<string>("");
  const [companyPassword, setCompanyPassword] = useState<string>("");
  const [companyDescription, setCompanyDescription] = useState<string>("");
  const [companyImage, setCompanyImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const registerCompany = useFetch({
    url: `https://mechio-api-test.onrender.com/poslodavci/novi-poslodavac`,
    method: "post",
    onSuccess: (data: any) => {
      if (data.token) {
        handleToastSuccess!(data.message);
        const decoded: any = jwt_decode(data.token);
        dispatch!({ type: "REGISTER", payload: { ...decoded, companyPremium: JSON.parse(decoded.companyPremium) } });
        localStorage.setItem("decodedToken", JSON.stringify(decoded));
        setStatus("Pending");
        ReactGA.event("tvrtka_registracija", {
          category: "tvrtka_registracija",
          action: "Registracija tvrtke",
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
    onInit: true
  });

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("companyAddress", companyAddress);
      formData.append("companyLocation", companyLocation);
      formData.append("companyNumber", companyNumber);
      formData.append("companyEmail", companyEmail);
      formData.append("companyPassword", companyPassword);
      formData.append("companyDescription", companyDescription);
      formData.append("companyPremium", 'false');
      if (companyImage) formData.append("image", companyImage);
      await registerCompany.handleFetch(
        "https://mechio-api-test.onrender.com/poslodavci/novi-poslodavac",
        formData
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form onSubmit={submitHandler}>
        <Step1
          setCompanyName={setCompanyName}
          setCompanyEmail={setCompanyEmail}
          setCompanyPassword={setCompanyPassword}
        />
        <Step2
          setCompanyAddress={setCompanyAddress}
          setCompanyLocation={setCompanyLocation}
          setCompanyNumber={setCompanyNumber}
        />
        <Step4 setCompanyImage={setCompanyImage} />
        <Button className="company__switch-btn" onClick={changeShowingForm}>
          Vaša tvrtka već posjeduje račun? Slobodno se prijavite
        </Button>
      </Form>
      {status === "Pending" && <LoadingSpinner />}
    </>
  );
};

export default CompanyRegister;
