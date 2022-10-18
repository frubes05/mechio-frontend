import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ICompanyToken } from "../companies/Company.types";
import { toast, ToastContainer } from "react-toastify";
import { Container, Form, Button, Accordion } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/LoadingSpinner";

import useFetch from "../../hooks/useFetch";

interface INewJob {
  setRefetch: (bool: boolean) => void;
  status: string;
}

const NewJob: React.FC<INewJob> = ({ setRefetch, status }) => {
  const { state } = useContext(AuthContext);
  const [position, setPosition] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>('');
  const [pay, setPay] = useState<string>('');
  const [token, setToken] = useState<ICompanyToken | null>(null);
  const [description, setDescription] = useState<string>("");
  const [duties, setDuties] = useState<[] | {}[]>([{}]);
  const [skills, setSkills] = useState<[] | {}[]>([{}]);
  const [benefits, setBenefits] = useState<[] | {}[]>([{}]);
  const navigate = useNavigate();

  const addNewJob = useFetch({
    url: `https://mechio-test-api.onrender.com/poslovi/novi-oglas`,
    method: "post",
    onSuccess: (data) => {
      data.message !== 200 ? toast.error(data.message, { autoClose: 3000 }) : toast.success(data.message, { autoClose: 3000});
      setTimeout(() => {
        navigate(-1);
      }, 4000);
      setRefetch(true);
    },
    onError: (error) => {
      toast.error("Došlo je do pogrješke", { autoClose: 3000 });
    },
  });


  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const duties = checkItems("duties");
    const skills = checkItems("skills");
    const benefits = checkItems("benefits");
    const newPost = {
      companyId: state._id || token?._id,
      company: state.companyName || token?.companyName,
      position,
      description,
      requirementsList: duties,
      skillsList: skills,
      benefitsList: benefits,
      location,
      pay,
      seniority: selectValue,
      date: new Date()
    };
   addNewJob.handleFetch('https://mechio-test-api.onrender.com/poslovi/novi-oglas', newPost);
  };

  const generateNewItem = (fn: Function) => {
    fn((prev: any) => {
      return [...prev, {}];
    });
  };

  const checkItems = (filter: string) => {
    const inputs = Array.from(document.querySelectorAll("input"));
    const selected = inputs
      .filter((input) => input.classList.contains(filter))
      .map((input) => input.value)
      .filter((value) => value !== "");
    return selected;
  };

  return (
    <div className="newjob">
      <ToastContainer></ToastContainer>
      <Container>
        <Form className="newjob__form" onSubmit={submitHandler}>
          <h1 className="newjob__form-title">Novi oglas za posao</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Navedite naziv pozicije</Form.Label>
            <Form.Control
              type="text"
              placeholder="Pozicija"
              onChange={(e) => setPosition(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Navedite lokaciju</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lokacija"
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Dajte kratki opis pozicije</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Opis pozicije"
              style={{ height: "100px" }}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Očekivanja, kompetencije i pogodnosti rada na odabranoj poziciji
            </Form.Label>
            <Accordion alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Obaveze pozicije</Accordion.Header>
                <Accordion.Body>
                  <div className="newjob__accordion-items">
                    {duties &&
                      duties.map((d, i) => (
                        <Form.Group key={i + 1}>
                          <Form.Control
                            className="duties"
                            type="text"
                            placeholder={`Obaveza ${i + 1}`}
                          ></Form.Control>
                        </Form.Group>
                      ))}
                  </div>
                  <Button
                    className="newjob__accordion-button"
                    onClick={() => generateNewItem(setDuties)}
                  >
                    Dodaj novu obavezu
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Kompetencije pozicije</Accordion.Header>
                <Accordion.Body>
                  <div className="newjob__accordion-items">
                    {skills &&
                      skills.map((d, i) => (
                        <Form.Group key={i + 1}>
                          <Form.Control
                            className="skills"
                            type="text"
                            placeholder={`Kompetencija ${i + 1}`}
                          ></Form.Control>
                        </Form.Group>
                      ))}
                  </div>
                  <Button
                    className="newjob__accordion-button"
                    onClick={() => generateNewItem(setSkills)}
                  >
                    Dodaj novu kompetenciju
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Pogodnosti pozicije</Accordion.Header>
                <Accordion.Body>
                  <div className="newjob__accordion-items">
                    {benefits &&
                      benefits.map((d, i) => (
                        <Form.Group key={i + 1}>
                          <Form.Control
                            className="benefits"
                            type="text"
                            placeholder={`Pogodnost ${i + 1}`}
                          ></Form.Control>
                        </Form.Group>
                      ))}
                  </div>
                  <Button
                    className="newjob__accordion-button"
                    onClick={() => generateNewItem(setBenefits)}
                  >
                    Dodaj novu pogodnost
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Form.Group>
          <Form.Group>
            <Form.Label>Odaberite potrebnu razinu znanja</Form.Label>
            <Form.Select aria-label="Default select example" onChange={(e) => setSelectValue(e.target.value)}>
              <option value="junior">Junior</option>
              <option value="mid-level">Mid-level</option>
              <option value="senior">Senior</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Navedite iznos plaće (HRK)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Iznos plaće"
              onChange={(e) => setPay(e.target.value)}
            />
          </Form.Group>
          <Button type="submit">Dodaj novi oglas</Button>
        </Form>
      </Container>
      {status === 'Pending' && <LoadingSpinner></LoadingSpinner>}
    </div>
  );
};

export default NewJob;
