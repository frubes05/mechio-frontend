import { Container } from "react-bootstrap";
import Typewriter from "typewriter-effect";

const HomeTypewritter = () => {
  return (
    <div className="home__typewritter-container">
      <Container>
      <div className="home__typewritter">
        <div className="home__typewritter-content">
          <Typewriter
            options={{
                loop: true,
                delay: 50
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString("Dobrodošli na prvu platform")
                .pauseFor(100)
                .deleteAll()
                .typeString(
                  "Dobrodošli na mjesto gdje se nalazi Vaš posao iz snova !"
                )
                .start()
                .pauseFor(5000);
            }}
          ></Typewriter>
        </div>
      </div>
      </Container>
    </div>
  );
};

export default HomeTypewritter;
