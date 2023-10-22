import { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { NavDropdown } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import { AuthContext } from "../context/AuthContext";
import { ICompanyToken } from "../pages/companies/Company.types";
import { IUserToken } from "../pages/users/User.types";
import { useNavigate } from "react-router-dom";
import { BsGearWideConnected } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineLogout } from "react-icons/ai";
import { FaMoneyCheckAlt } from "react-icons/fa";

import ReactGA from "react-ga4";

const Navigation = () => {
  const { state, dispatch, setShowAll, showAll } = useContext(AuthContext);
  const [iconState, setIconState] = useState<boolean>(false);
  const [token, setToken] = useState<(ICompanyToken & IUserToken) | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const logout = async () => {
    ReactGA.event("logout", {
      category: "logout",
      action: "Odjava",
      label:
        state.user || token?.user || state.companyName || token?.companyName,
    });
    setShowAll(false);
    const href = window.location.href.split("/");
    localStorage.removeItem("decodedToken");
    dispatch!({ type: "LOGOUT" });
    setToken(null);
    navigate("/");
  };

  useEffect(() => {
    window.addEventListener("scroll", checkWindowSize);
  }, []);

  const checkWindowSize = () => {
    const header = document.querySelector("header") as HTMLElement;
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      header.classList.add("header--show");
    } else {
      header.classList.remove("header--show");
      if (document.body.scrollTop === 0 && iconState) {
        header.classList.add("header--show");
      } else if (document.body.scrollTop === 0 && !iconState) {
        header.classList.remove("header--show");
      }
    }
  };

  useEffect(() => {
    const header = document.querySelector("header") as HTMLElement;
    if (window.scrollY > 0) {
      header.classList.add("header--show");
    } else {
      iconState
        ? header.classList.add("header--show")
        : header.classList.remove("header--show");
    }
  }, [iconState]);

  useEffect(() => {
    if (state.user || state.company) {
      setShowAll(true);
    }
  }, [state]);  

  return (
    <Navbar collapseOnSelect expand="md" variant="dark">
      <Container>
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            isActive
              ? "navbar__list-link--active navbar__list-link navbar__list-link--title"
              : "navbar__list-link navbar__list-link--title"
          }
        >
          <BsGearWideConnected></BsGearWideConnected>
          mech.io
        </NavLink>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          className="navbar__hamburger"
          onClick={() => setIconState(!iconState)}
        >
          {!iconState && (
            <svg
              width="27"
              height="28"
              viewBox="0 0 27 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.375 9.43495C2.75625 9.43495 2.25 8.92137 2.25 8.29365C2.25 7.66593 2.75625 7.15234 3.375 7.15234H23.625C24.2437 7.15234 24.75 7.66593 24.75 8.29365C24.75 8.92137 24.2437 9.43495 23.625 9.43495H3.375ZM2.25 14.0002C2.25 14.6279 2.75625 15.1415 3.375 15.1415H23.625C24.2437 15.1415 24.75 14.6279 24.75 14.0002C24.75 13.3725 24.2437 12.8589 23.625 12.8589H3.375C2.75625 12.8589 2.25 13.3725 2.25 14.0002ZM2.25 19.7067C2.25 20.3344 2.75625 20.848 3.375 20.848H23.625C24.2437 20.848 24.75 20.3344 24.75 19.7067C24.75 19.079 24.2437 18.5654 23.625 18.5654H3.375C2.75625 18.5654 2.25 19.079 2.25 19.7067Z"
                fill="#282828"
              />
            </svg>
          )}
          {iconState && (
            <svg
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.5876 6.42379C20.3774 6.21313 20.092 6.09475 19.7944 6.09475C19.4969 6.09475 19.2115 6.21313 19.0013 6.42379L13.5001 11.9138L7.99881 6.41254C7.78862 6.20188 7.50327 6.0835 7.20568 6.0835C6.9081 6.0835 6.62274 6.20188 6.41256 6.41254C5.97381 6.85129 5.97381 7.56004 6.41256 7.99879L11.9138 13.5L6.41256 19.0013C5.97381 19.44 5.97381 20.1488 6.41256 20.5875C6.85131 21.0263 7.56006 21.0263 7.99881 20.5875L13.5001 15.0863L19.0013 20.5875C19.4401 21.0263 20.1488 21.0263 20.5876 20.5875C21.0263 20.1488 21.0263 19.44 20.5876 19.0013L15.0863 13.5L20.5876 7.99879C21.0151 7.57129 21.0151 6.85129 20.5876 6.42379Z"
                fill="#282828"
              />
            </svg>
          )}
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <li className="navbar__list-item">
              <NavLink
                to={"/recenzije"}
                className={({ isActive }) =>
                  isActive
                    ? "navbar__list-link--active navbar__list-link"
                    : "navbar__list-link"
                }
                onClick={() =>
                  ReactGA.event("/recenzije", {
                    category: "preusmjeravanje_na_recenzije",
                    action: "Preusmjeravanje na recenzije",
                  })
                }
              >
                Recenzije
              </NavLink>
            </li>
            <li className="navbar__list-item">
              <NavLink
                to={"/poslovi"}
                className={({ isActive }) =>
                  isActive
                    ? "navbar__list-link--active navbar__list-link"
                    : "navbar__list-link"
                }
                onClick={() =>
                  ReactGA.event("/poslovi", {
                    category: "preusmjeravanje_na_poslove",
                    action: "Preusmjeravanje na poslove",
                  })
                }
              >
                Poslovi
              </NavLink>
            </li>
            {showAll && (
              <li className="navbar__list-item">
                <NavDropdown title="Postavke" id="collasible-nav-dropdown">
                  <NavLink
                    to={`/profil/${state._id ? state._id : token?._id}`}
                    className="navbar__list-link"
                  >
                    <BiUserCircle />
                    <span>Profil</span>
                  </NavLink>
                  {(state.company || token?.company) && (
                    <NavLink to={`/placanje`} className="navbar__list-link">
                      <FaMoneyCheckAlt />
                      <span>Paketi</span>
                    </NavLink>
                  )}
                  <Button
                    variant="primary"
                    className="navbar__list-item--logout"
                    onClick={logout}
                  >
                    <AiOutlineLogout />
                    <span>Logout</span>
                  </Button>
                </NavDropdown>
              </li>
            )}
            {!showAll && token && (
              <li className="navbar__list-item">
                <NavDropdown title="Postavke" id="collasible-nav-dropdown">
                  <NavLink
                    to={`/profil/${state._id ? state._id : token?._id}`}
                    className="navbar__list-link"
                  >
                    <BiUserCircle />
                    <span>Profil</span>
                  </NavLink>
                  {(state.company || token?.company) && (
                    <NavLink to={`/placanje`} className="navbar__list-link">
                      <FaMoneyCheckAlt />
                      <span>Paketi</span>
                    </NavLink>
                  )}
                  <Button
                    variant="primary"
                    className="navbar__list-item--logout"
                    onClick={logout}
                  >
                    <AiOutlineLogout />
                    <span>Logout</span>
                  </Button>
                </NavDropdown>
              </li>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
