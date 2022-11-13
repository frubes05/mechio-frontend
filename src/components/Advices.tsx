import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import useFetch from "../hooks/useFetch";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { advicesConfig } from "../components/carousel.config";

const Advices = () => {
  const [advices, setAdvices] = useState<any[]>([]);

  const getAdvices = useFetch({
    url: "http://localhost:9000/savjeti",
    method: "get",
    onSuccess: (data) => {
      setAdvices(data);
    },
    onError: (err) => {},
    onInit: true,
  });

  return (
    <section className="advices">
      <Container>
        <Row>
          <Col>
            <h5>Kako napisati dobar životopis ?</h5>
            <h2>Savjeti</h2>
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
  );
};

export default Advices;
