import Container from 'react-bootstrap/Container';
import { IJobsList } from "../jobs/Jobs.types";

import Carousel from "../../components/Carousel";

const HomeJobs: React.FC<IJobsList> = ({ jobs }) => {
  return (
    <div className="home__jobs">
      <Container>
        <h5>Kratak uvid u dio ponude poslova</h5>
        <h2 className="home__jobs-title">Posljednje dodano</h2>
      </Container>
      <Carousel jobs={jobs?.slice(-8).reverse()}></Carousel>
    </div>
  );
};

export default HomeJobs;
