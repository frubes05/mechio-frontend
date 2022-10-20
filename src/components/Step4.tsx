import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import { IStep4, ISteps } from "./Steps.types";
import { Button } from "react-bootstrap";

const Step4 = ({ setCompanyImage, previousStep }: IStep4 & ISteps) => {
  const onInput = (file: File, valid: any) => {
    setCompanyImage(file);
  };
  return (
    <>
      <ImageUpload onInput={onInput} />
      <div className="company__form-buttons">
        <Button variant="primary" type="submit" className="company__login-btn">
          Registracija
        </Button>
      </div>
    </>
  );
};

export default Step4;
