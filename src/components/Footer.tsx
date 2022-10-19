import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { SiGooglemaps } from "react-icons/si";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { ImLinkedin2 } from "react-icons/im";
import { BsGithub } from "react-icons/bs";
import ModalForm from "./Modal";

const Footer = () => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <footer className="footer">
      <Container className="footer__wrapper">
        <ul className="footer__list">
          <li className="footer__list-item" onClick={() => setShow(true)}>
            <div className="footer__list-item--svg">
              <SiGooglemaps></SiGooglemaps>
            </div>
            <address>
              <p>Zagrebačka 13</p>
              <p>10450, Jastrebarsko</p>
            </address>
          </li>
          <ModalForm
            title="Sjedište tvrtke"
            setShow={setShow}
            show={show}
            handleClose={() => setShow(false)}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2787.832299420238!2d15.649445615339891!3d45.67426682742305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476433fac2d86155%3A0x3d8686cac7c17f46!2sZagreba%C4%8Dka%20ul.%2013%2C%2010450%2C%20Jaska!5e0!3m2!1shr!2shr!4v1666172900469!5m2!1shr!2shr"
              width="600"
              height="450"
              loading="lazy"
              className="footer__list-iframe"
            ></iframe>
          </ModalForm>
          <li className="footer__list-item">
            <a href="tel:+385993073706" className="footer__list-link">
              <div className="footer__list-item--svg">
                <BsFillTelephoneFill></BsFillTelephoneFill>
              </div>
              <span>+ 38599 307 3706</span>
            </a>
          </li>
          <li className="footer__list-item">
            <a
              href="mailto:filip.rubes2@gmail.com"
              className="footer__list-link"
            >
              <div className="footer__list-item--svg">
                <IoMdMail></IoMdMail>
              </div>
              <span>filip.rubes2@gmail.com</span>
            </a>
          </li>
        </ul>
        <article className="footer__article">
          <h3 className="footer__article-title">O mech.io</h3>
          <p className="footer__article-text">
            {" "}
            mech.io nastao je kao odgovor na stvarnu potrebu tržišta za
            jedinstvenom aplikacijom pogodnom za korištenje svim zaposlenima u
            području strojarstva. Bilo da tražite posao ili ste poslodavac,
            mech.io pokriva vaše potrebe.
          </p>
          <ul className="footer__article-list">
            <li className="footer__article-item">
              <a href="https://www.facebook.com">
                <FaFacebookF></FaFacebookF>
              </a>
            </li>
            <li className="footer__article-item">
              <a href="https://www.twitter.com">
                <BsTwitter></BsTwitter>
              </a>
            </li>
            <li className="footer__article-item">
              <a href="https://www.linkedin.com">
                <ImLinkedin2></ImLinkedin2>
              </a>
            </li>{" "}
            <li className="footer__article-item">
              <a href="https://www.github.com">
                <BsGithub></BsGithub>
              </a>
            </li>
          </ul>
        </article>
      </Container>
    </footer>
  );
};

export default Footer;
