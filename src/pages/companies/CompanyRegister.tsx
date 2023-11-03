import { useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { IFormSwitch } from "./Company.types";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ImageUpload from "../../components/ImageUpload";
import LoadingSpinner from "../../components/LoadingSpinner";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useSWRMutation from "swr/mutation";
import { sendRequest } from "../../services/fetcher";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup
  .object({
    companyName: yup.string().required('Ime je obavezno polje'),
    companyEmail: yup
      .string()
      .email("Unesite valjani email")
      .required("Email je obavezno polje"),
    companyPassword: yup.string().min(8, 'Unesite minimalno 8 znamenaka').required("Password je obavezno polje"),
    companyNumber: yup.string().matches(phoneRegExp, 'Unesite valjani telefonski broj'),
    companyAddress: yup.string().required('Unesite valjanu adresu'),
    companyLocation: yup.string().required('Unesite valjani grad'),
  })
  .required();

const CompanyRegister = ({
  changeShowingForm,
  handleToastError,
  handleToastSuccess,
}: IFormSwitch) => {
  const { dispatch } = useContext(AuthContext);
  const [companyImage, setCompanyImage] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });
  const { trigger: companyRegisterTrigger } = useSWRMutation(
    `https://mechio-api-test.onrender.com/poslodavci/novi-poslodavac`,
    sendRequest,
    {
      onSuccess: (data) => {
        if (data.token) {
          handleToastSuccess!(data.message);
          const decoded: any = jwt_decode(data.token);
          dispatch!({ type: "REGISTER", payload: { ...decoded } });
          localStorage.setItem(
            "decodedToken",
            JSON.stringify({ ...decoded })
          );
        }
      },
      onError: (error) => handleToastError!(error.message),
    }
  );

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("companyName", data.companyName);
    formData.append("companyAddress", data.companyAddress);
    formData.append("companyLocation", data.companyLocation);
    formData.append("companyNumber", data.companyNumber);
    formData.append("companyEmail", data.companyEmail);
    formData.append("companyPassword", data.companyPassword);
    formData.append("companyDescription", data.companyDescription);
    formData.append("companyPremium", "false");
    if (companyImage) formData.append("image", companyImage);
    companyRegisterTrigger(formData);
  };

  const onInput = (file: File, valid: any) => {
    setCompanyImage!(file);
  };

  return (
    <>
      <Form className="company__form-register">
        <div className="company__form-register--left">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="string"
              placeholder="Naziv tvrtke"
              className={`${errors.companyName?.message ? 'error' : ''}`}
              {...register("companyName", { required: true })}
            />
            <Form.Text>
              {errors.companyName?.message}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="email"
              placeholder="Email tvrtke"
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
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Kontakt telefon tvrtke"
              className={`${errors.companyNumber?.message ? 'error' : ''}`}
              {...register("companyNumber", { required: true })}
            />
            <Form.Text>
              {errors.companyNumber?.message}
            </Form.Text>
          </Form.Group>
        </div>
        <div className="company__form-register--right">
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Adresa tvrtke"
              className={`${errors.companyAddress?.message ? 'error' : ''}`}
              {...register("companyAddress", { required: true })}
            />
            <Form.Text>
              {errors.companyAddress?.message}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Sjedište tvrtke"
              className={`${errors.companyLocation?.message ? 'error' : ''}`}
              {...register("companyLocation", { required: true })}
            />
            <Form.Text>
              {errors.companyLocation?.message}
            </Form.Text>
          </Form.Group>
          <ImageUpload onInput={onInput} />
        </div>
      </Form>
      <Button
        variant="primary"
        type="submit"
        className="company__login-btn"
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid}
      >
        Registracija
      </Button>
      <Button className="company__switch-btn" onClick={changeShowingForm}>
        Vaša tvrtka već posjeduje račun? Slobodno se prijavite
      </Button>
    </>
  );
};

export default CompanyRegister;
