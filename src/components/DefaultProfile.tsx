import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import useFetch from "../hooks/useFetch";
import { IUserProfile } from "./UserProfile.types";
import { ICompany } from "../pages/companies/Company.types";

const DefaultProfile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<null | IUserProfile>(null);
  const [company, setCompany] = useState<null | ICompany>(null);

  const getProfileInformation = useFetch({
    url: `http://localhost:9000/profil/${params.id}`,
    method: "get",
    onSuccess: (information) => {
      const { data, type } = information;
      type === "user" ? setUser(data) : setCompany(data);
    },
    onError: (error) => {
    },
  });

  return (
    <Container className="default">
      <Row className="default__row">
        <Col sm={4} md={8} lg={8} className="default__col">
          <article className="default__article">
            <div className="default__wrapper">
              <div className="default__information">
                {user && <img src={`http://localhost:9000/${user.image}`} />}
                <h2 className="default__title">{user && user.fullname}</h2>
              </div>
              <div className="default__placeholder">
                <p>CV:</p>
                <div>{user && user.cv}</div>
              </div>
              <div className="default__more">
                <p className="default__email">
                  {user && <a href={`mailto:${user.email}`}>{user.email}</a>}
                </p>
                {user && (
                  <div
                    className="default__about"
                    dangerouslySetInnerHTML={{ __html: user.about }}
                  />
                )}
                {company && (
                  <div
                    className="default__about"
                    dangerouslySetInnerHTML={{
                      __html: company.companyDescription,
                    }}
                  />
                )}
              </div>
            </div>
            <div className="default__back">
              <Button variant="secondary" onClick={() => navigate(-1)}>Natrag</Button>
            </div>
          </article>
        </Col>
      </Row>
    </Container>
  );
};

export default DefaultProfile;
