import React, { useRef, useEffect, useState } from "react";
import ChartsContainer from "../../components/ChartsContainer";
import { IJobs } from "../jobs/Jobs.types";
import { Container, Row, Col } from "react-bootstrap";
import useFetch from "../../hooks/useFetch";

interface IHomeAnalytics {
  data?: IJobs[];
}

const HomeAnalytics: React.FC<IHomeAnalytics> = ({ data }) => {
  const wrapper = useRef() as any;
  const [feedbacks, setFeedbacks] = useState([]);
  const [wrapperWidth, setWrapperWidth] = useState<any>();

  const getFeedbacks = useFetch({
    url: `https://mechio-api-test.onrender.comrecenzije`,
    method: "get",
    onSuccess: (data: any) => {
      setFeedbacks(data);
    },
    onError: (error: any) => {},
    onInit: true,
  });

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
                {data && data.length && (
                  <ChartsContainer
                    width={wrapperWidth}
                    labelName="jobs"
                    page={"general"}
                    data={data}
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
