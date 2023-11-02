import React, { useRef, useEffect, useState } from "react";
import ChartsContainer from "../../components/ChartsContainer";
import { IJobs } from "../jobs/Jobs.types";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface IHomeAnalytics {
  jobs?: IJobs[];
  feedbacks?: any[];
}

const HomeAnalytics: React.FC<IHomeAnalytics> = ({ jobs, feedbacks }) => {
  const wrapper = useRef() as any;
  const [wrapperWidth, setWrapperWidth] = useState<any>();

  useEffect(() => {
    setWrapperWidth(wrapper.current.clientWidth);
    window.addEventListener("resize", () => {
      const width = wrapper.current.clientWidth;
      setWrapperWidth(width - 50);
    });
  }, []);

  return (
    <section className="home__analytics home__benefits">
      <Container>
        <Row>
          <div className="home__analytics-wrapper" ref={wrapper}>
            <Col md={8} lg={8}>
              <h5>Statistika je rekla svoje</h5>
              <h2 className="home__benefits-title">
                Najkorištenija stranica u strojarstvu
              </h2>
            </Col>
            <Col md={12} lg={12}>
              <div className="home__analytics-section">
                {jobs && jobs.length && (
                  <ChartsContainer
                    width={wrapperWidth}
                    labelName="jobs"
                    page={"general"}
                    data={jobs}
                  ></ChartsContainer>
                )}
                {feedbacks && feedbacks?.length && (
                  <ChartsContainer
                    width={wrapperWidth}
                    labelName="feedbacks"
                    page={"general"}
                    data={feedbacks}
                  ></ChartsContainer>
                )}
              </div>
            </Col>
          </div>
        </Row>
      </Container>
    </section>
  );
};

export default HomeAnalytics;
