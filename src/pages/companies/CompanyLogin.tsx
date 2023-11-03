import { useContext } from "react";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { IFormSwitch } from "./Company.types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useSWRMutation from "swr/mutation";
import { sendRequest } from "../../services/fetcher";

const schema = yup
  .object({
    companyEmail: yup
      .string()
      .email("Unesite valjani email")
      .required("Email je obavezno polje"),
    companyPassword: yup.string().required("Password je obavezno polje"),
  })
  .required();

const CompanyLogin = ({
  handleToastError,
  handleToastSuccess,
  changeShowingForm,
}: IFormSwitch) => {
  const { dispatch } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });
  const { trigger: companyLoginTrigger } = useSWRMutation(
    `https://mechio-api-test.onrender.com/poslodavci/login-poslodavac`,
    sendRequest,
    {
      onSuccess: (data) => {
        if (data.token) {
          handleToastSuccess!(data.message);
          const decoded: any = jwt_decode(data.token);
          dispatch!({ type: "LOGIN", payload: { ...decoded } });
          localStorage.setItem("decodedToken", JSON.stringify({ ...decoded }));
        }
      },
      onError: (error) => handleToastError!(error.message),
    }
  );

  const onSubmit = async (data: any) => companyLoginTrigger(data);

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Email"
            className={`${errors.companyEmail?.message ? "error" : ""}`}
            {...register("companyEmail", { required: true })}
          />
          <Form.Text>{errors.companyEmail?.message}</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            className={`${errors.companyPassword?.message ? "error" : ""}`}
            {...register("companyPassword", { required: true })}
          />
          <Form.Text>{errors.companyPassword?.message}</Form.Text>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="company__login-btn"
          disabled={!isValid}
        >
          Ulogirajte se
        </Button>
        <Button className="company__switch-btn" onClick={changeShowingForm}>
          Još niste registrirali tvrtku? Učinite to u par koraka
        </Button>
      </Form>
    </>
  );
};

export default CompanyLogin;
