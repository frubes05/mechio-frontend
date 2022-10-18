import { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import { IJobs } from "../pages/jobs/Jobs.types";

const Carousel = () => {
  const [lastAdded, setLastAdded] = useState<IJobs[] | null>(null);

  useEffect(() => {
    axios
      .get("https://mechio-api-test.onrender.com/poslovi")
      .then((res) => setLastAdded(res.data.slice(-8)));
  }, []);

  return (
    <>
    {lastAdded && lastAdded.length > 0 && <Container>
      <Splide options= {{
        autoplay: false,
        drag: true,
        rewind: true,
        perPage: 4,
        gap: '20px',
        arrows: false,
        pagination: false
      }}>
        {lastAdded.map((job) => 
       <SplideSlide key={job._id}>
          <Link to={`/poslovi/${job._id}`}>
          <article className="home__jobs-article">
                <div className="home__jobs-overlay">
                  <img className="home__jobs-image" src={'https://mechio-api-test.onrender.com/'+ job.companyImage} />
                </div>
                <div className="home__jobs-text">
                  <h3 className="home__jobs-position">{job.position}</h3>
                </div>
              </article>
          </Link>
        </SplideSlide>)}
      </Splide>
    </Container>}
    </>
  );
};

export default Carousel;
