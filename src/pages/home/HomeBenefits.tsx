import Container from 'react-bootstrap/Container';
import {BsFillMouse3Fill} from 'react-icons/bs';
import {RiEmotionNormalFill} from 'react-icons/ri';
import {GrDocumentPerformance} from 'react-icons/gr';

const HomeBenefits = () => {
  return (
    <section className="home__benefits home__image home__image--middle">
      <Container>
        <h5>Naše snage</h5>
        <h2 className="home__benefits-title">Zašto baš mech.io ?</h2>
        <ul className="home__benefits-list">
          <li className="home__benefits-item">
            <article className="home__benefits-article">
              <BsFillMouse3Fill></BsFillMouse3Fill>
              <h3 className="home__benefits-subtitle">JEDNOSTAVNOST</h3>
              <p className="home__benefits-text">
                  Sve mogućnosti aplikacije udaljene su od vas u nekoliko klikova mišem.
              </p>
            </article>
          </li>
          <li className="home__benefits-item">
            <article className="home__benefits-article">
              <RiEmotionNormalFill></RiEmotionNormalFill>
              <h3 className="home__benefits-subtitle">RAZUMLJIVOST</h3>
              <p className="home__benefits-text">
                  Mi, u mech.io-u, shvaćamo koliko stresno može biti
                  u strojarstvu pronaći novi posao ili kvalitetnog zaposlenika. 
              </p>
            </article>
          </li>
          <li className="home__benefits-item">
            <article className="home__benefits-article">
              <GrDocumentPerformance></GrDocumentPerformance>
              <h3 className="home__benefits-subtitle">PRISTUPAČNOST</h3>
              <p className="home__benefits-text">
                Intuitivan proces prijave i korištenja aplikacije.
              </p>
            </article>
          </li>
        </ul>
      </Container>
    </section>
  );
};

export default HomeBenefits;
