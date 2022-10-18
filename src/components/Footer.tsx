import React from "react";
import { Container } from "react-bootstrap";
import { SiGooglemaps } from "react-icons/si";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { ImLinkedin2 } from "react-icons/im";
import { BsGithub } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="footer">
      <Container className="footer__wrapper">
        <ul className="footer__list">
          <li className="footer__list-item">
            <div className="footer__list-item--svg">
              <SiGooglemaps></SiGooglemaps>
            </div>
            <address>
              <p>Zagrebačka 13</p>
              <p>10450, Jastrebarsko</p>
            </address>
          </li>
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
            jedinstvenom aplikacijom pogodnom za korištenje svim zaposlenima u području
            strojarstva. Bilo da tražite posao ili ste poslodavac, mech.io
            pokriva vaše potrebe.
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
