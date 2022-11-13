import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import useFetch from "../hooks/useFetch";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { advicesConfig } from "../components/carousel.config";
import { AuthContext } from "../context/AuthContext";
import { ICompanyToken } from "../pages/companies/Company.types";
import { IUserToken } from "../pages/users/User.types";
import LoadingSpinner from "./LoadingSpinner";

const Advices = () => {
  const [advices, setAdvices] = useState<any[]>([]);
  const { state, dispatch, setShowAll, showAll } = useContext(AuthContext);
  const [token, setToken] = useState<(ICompanyToken & IUserToken) | null>(null);

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const getAdvices = useFetch({
    url: "http://localhost:9000/savjeti",
    method: "get",
    onSuccess: (data) => {
      setAdvices(data);
    },
    onError: (err) => {},
    onInit: false,
  });

  useEffect(() => {
    if ((state.user || token?.user) || (!state.user && !token?.user && !state.company && !token?.company)) {
      getAdvices.handleFetch('http://localhost:9000/savjeti/posloprimac')
    } else if (state.company || token?.company) {
      getAdvices.handleFetch('http://localhost:9000/savjeti/poslodavac')
    }
  }, [state, token])

  return (
    <>
    <section className="advices">
      <Container>
        <Row>
          <Col>
            {(state.user || token?.user) || (!state.user && !token?.user && !state.company && !token?.company) && 
            <>
              <h5>Kako napisati dobar životopis ?</h5>
              <h2>Savjeti</h2>
            </>
            }
            {(state.company || token?.company) && 
            <>
              <h5>Kako pronaći kvalitetnog zaposlenika ?</h5>
              <h2>Savjeti</h2>
            </>
            }
            <Splide options={advicesConfig()}>
              {advices.length > 0 &&
                advices.map((advice, i) => (
                  <SplideSlide key={i}>
                    <a href={advice.url} className="advices__link" target={'_blank'}>
                      <div className="advices__img">
                        <img src={advice.img} alt={advice.title} />
                      </div>
                      <div className="advices__content">
                        <h3 className="advices__title">{advice.title}</h3>
                        <p className="advices__intro">{advice.paragraph}</p>
                      </div>
                    </a>
                  </SplideSlide>
                ))}
            </Splide>
          </Col>
        </Row>
      </Container>
    </section>
    {getAdvices.status === 'Pending' && <LoadingSpinner></LoadingSpinner>}
    </>
  );
};

export default Advices;
