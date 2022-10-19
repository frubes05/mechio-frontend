import { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { IJobs } from "../pages/jobs/Jobs.types";
import useFetch from "../hooks/useFetch";
import { carouselConfig } from "./carousel.config";

const Carousel = () => {
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
                  <article className="home__jobs-article">
                    <div className="home__jobs-overlay">
                      <img
                        className="home__jobs-image"
                        src={
                          "https://mechio-api-test.onrender.com/" +
                          job.companyImage
                        }
                      />
                    </div>
                    <div className="home__jobs-text">
                      <h3 className="home__jobs-position">{job.position}</h3>
                    </div>
                  </article>
                </Link>
              </SplideSlide>
            ))}
          </Splide>
        </Container>
      )}
    </>
  );
};

export default Carousel;
