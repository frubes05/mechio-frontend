import { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { IJobs } from "../pages/jobs/Jobs.types";
import useFetch from "../hooks/useFetch";
import { carouselConfig } from "./carousel.config";
import moment from "moment";
import "moment/locale/hr";

const Carousel = () => {
  moment().locale("hr");
  const [lastAdded, setLastAdded] = useState<IJobs[] | null>(null);

  const getJobs = useFetch({
    url: "https://mechio-api-test.onrender.com/poslovi",
    method: "get",
    onSuccess: (data) => {
      setLastAdded(data.slice(-8));
    },
    onError: (err) => {},
  });

  return (
    <>
      {lastAdded && lastAdded.length > 0 && (
        <Container>
          <Splide options={carouselConfig(lastAdded.length)}>
            {lastAdded.map((job) => (
              <SplideSlide key={job._id}>
                <Link to={`/poslovi/${job._id}`}>
                  <article className="jobs__card">
                    <div className="jobs__card-picture">
                      <img
                        className="jobs__card-image"
                        src={
                          "https://mechio-api-test.onrender.com/" +
                          job.companyImage
                        }
                      />
                      <span className="jobs__card-pill">
                        {moment(job.date.toString()).startOf("day").fromNow()}
                      </span>
                    </div>
                    <div className="jobs__card-content">
                      <ul className="jobs__card-list">
                        <li className="jobs__card-item">{job.company}, </li>
                        <li className="jobs__card-item">{job.location}</li>
                      </ul>
                      <h2 className="jobs__card-title">{job.position}</h2>
                    </div>
                  </article>
                </Link>
              </SplideSlide>
            ))}
          </Splide>
        </Container>
      )}
      {lastAdded?.length === 0 && (
        <Container>
          <Row>
            <Col>
              <p className="home__jobs-none">Trenutno nema ponuđenih poslova</p>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Carousel;
