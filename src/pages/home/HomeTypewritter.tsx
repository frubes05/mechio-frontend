import { Container } from "react-bootstrap";
import Typewriter from "typewriter-effect";

const HomeTypewritter = () => {
  return (
    <Container>
      <div className="home__typewritter">
        <div className="home__typewritter-content">
          <Typewriter
            options={{
                loop: true,
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString("Dobrodošli na prvu platform")
                .pauseFor(1500)
                .deleteAll()
                .typeString(
                  "Dosta vam je traženja poslova po različitim stranicama?"
                )
                .pauseFor(1500)
                .typeString(
                  " Ne znate gdje pronaći i kako zadržati kvalitetne zaposlenike?"
                )
                .pauseFor(1500)
                .typeString(
                  " Ne očajavajte, jer sve što vam je potrebno možete naći ovdje, na mech.io !"
                )
                .start()
                .pauseFor(15000);
            }}
          ></Typewriter>
        </div>
      </div>
    </Container>
  );
};

export default HomeTypewritter;
