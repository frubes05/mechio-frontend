import { useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { IFormSwitch } from "./User.types";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { sendRequest } from "../../services/fetcher";
import useSWRMutation from "swr/mutation";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Unesite valjani email")
      .required("Email je obavezno polje"),
    password: yup.string().required("Password je obavezno polje"),
  })
  .required();

const UserLogin = ({
  changeShowingForm,
  handleToastError,
  handleToastSuccess,
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
  const { trigger: userLoginTrigger } = useSWRMutation(
    () => `https://mechio-api-test.onrender.com/posloprimci/login-posloprimac`,
    sendRequest,
    {
      onSuccess: (data) => {
        if (data.token) {
          handleToastSuccess!(data.message);
          const decoded: any = jwt_decode(data.token);
          dispatch!({ type: "LOGIN", payload: { ...decoded } });
          localStorage.setItem(
            "decodedToken",
            JSON.stringify({ ...decoded })
          );
        }
      },
      onError: (error) => handleToastError!(error.message),
    }
  );

  const onSubmit = async (data: any) => userLoginTrigger(data);

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Email"
            className={`${errors.email?.message ? "error" : ""}`}
            {...register("email", { required: true })}
          />
          <Form.Text>{errors.email?.message}</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            className={`${errors.password?.message ? "error" : ""}`}
            {...register("password", { required: true })}
          />
          <Form.Text>{errors.password?.message}</Form.Text>
        </Form.Group>
        <Button className="user__login-btn" type="submit" disabled={!isValid}>
          Login
        </Button>
        <Button className="user__switch-btn" onClick={changeShowingForm}>
          Još nisi registriran? Učini to u par koraka
        </Button>
      </Form>
    </>
  );
};

export default UserLogin;
