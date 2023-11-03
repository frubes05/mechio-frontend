import { useState, useContext } from "react";
import ImageUpload from "../../components/ImageUpload";
import PDFUpload from "../../components/PDFUpload";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { IFormSwitch } from "./User.types";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useSWRMutation from "swr/mutation";
import { sendRequest } from "../../services/fetcher";

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
  const [cv, setCv] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });
  const { trigger: userRegisterTrigger } = useSWRMutation(
    () => `https://mechio-api-test.onrender.com/posloprimci/novi-posloprimac`,
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
    formData.append("fullname", data.fullname);
    formData.append("address", data.address);
    formData.append("location", data.location);
    formData.append("number", data.number);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (cv) {
      formData.append("cv", cv);
    }
    if (image) formData.append("image", image);
    userRegisterTrigger(formData);
  };

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
    </>
  );
};

export default UserRegister;
