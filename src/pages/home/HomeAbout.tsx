import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Splide, SplideSlide } from "@splidejs/react-splide";

import { IFeedbacks } from "../feedbacks/Feedbacks.types";
import Rating from "../../components/Rating";
import { carouselConfig } from "../../components/carousel.config";
import { Link } from "react-router-dom";

const HomeAbout: React.FC<IFeedbacks> = ({ latestFeedbacks }) => {  
  return (
    <section className="home__about">
      <Container>
        <Row>
          <Col md={12} lg={12} xlg={12}>
            <h5 className="home__about-subtitle">
              Što o tvrtkama kažu zaposlenici ?
            </h5>
            <h2 className="home__about-title">Posljednje dodane recenzije</h2>
            {latestFeedbacks?.length > 0 && (
              <Splide
                className="home__about-carousel"
                options={carouselConfig(4, true)}
              >
                {latestFeedbacks.slice(-4).map((elem, i) => (
                    <SplideSlide key={i}>
                      <article className="home__about-article">
                        <div className="home__about-main">
                          <img
                            src={`https://mechio-api-test.onrender.com/${elem.companyImage}`}
                            alt={elem.companyName}
                          />
                          <Link
                            to={`/profil/${elem.companyId}`}
                            className="home__about-mainlink"
                          >
                            <h3 className="home__about-maintitle">
                              {elem.companyName}
                            </h3>
                          </Link>
                        </div>
                        <div className="home__about-info">
                          <Rating rating={+elem.rating} />
                          <p className="home__about-info--category">
                            {elem.category}
                          </p>
                        </div>
                        <div className="home__about-section">
                          <h4 className="home__about-sectiontitle">
                            Prednosti
                          </h4>
                          <p>{elem.positives}</p>
                          <h4 className="home__about-sectiontitle">
                            Nedostatci
                          </h4>
                          <p>{elem.negatives}</p>
                        </div>
                        <div className="home__about-button">
                          <Link to={`/recenzije/${elem.companyId}`}>
                            Pogledaj
                          </Link>
                        </div>
                      </article>
                    </SplideSlide>
                  ))}
              </Splide>
            )}
            {latestFeedbacks?.length === 0 && (
              <p className="home__jobs-none">Trenutno nema recenzija</p>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HomeAbout;
