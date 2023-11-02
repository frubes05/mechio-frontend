import { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { advicesConfig } from "../components/carousel.config";
import { AuthContext } from "../context/AuthContext";
import { ICompanyToken } from "../pages/companies/Company.types";
import { IUserToken } from "../pages/users/User.types";
import { fetcher } from "../services/fetcher";
import useSWR from "swr";

const Advices: React.FC = () => {
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<(ICompanyToken & IUserToken) | null>(null);
  const USER_ADVICES_CONDITION =
    state.user ||
    token?.user ||
    (!state.user && !token?.user && !state.company && !token?.company);
  const { data: advices } = useSWR(
    USER_ADVICES_CONDITION
      ? `https://mechio-api-test.onrender.com/savjeti/posloprimac`
      : `https://mechio-api-test.onrender.com/savjeti/poslodavac`,
    fetcher
  );

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  return (
    <>
      <section className="advices">
        <Container>
          <Row>
            <Col>
              {USER_ADVICES_CONDITION ? (
                <>
                  <h5>Kako napisati dobar životopis ?</h5>
                  <h2>Savjeti</h2>
                </>
              ) : (
                <>
                  <h5>Kako pronaći kvalitetnog zaposlenika ?</h5>
                  <h2>Savjeti</h2>
                </>
              )}
              <Splide options={advicesConfig()}>
                {advices?.length > 0 &&
                  advices.map((advice: any, i: number) => (
                    <SplideSlide key={i}>
                      <a
                        href={advice.url}
                        className="advices__link"
                        target={"_blank"}
                        rel="noreferrer"
                      >
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
    </>
  );
};

export default Advices;
