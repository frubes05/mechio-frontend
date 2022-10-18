import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BsGearWideConnected } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import { ICompanyToken } from "../pages/companies/Company.types";
import { IUserToken } from "../pages/users/User.types";
import { useNavigate } from "react-router-dom";
import SearchBackdrop from "./SearchBackdrop";
import LoadingSpinner from "./LoadingSpinner";
import Profile from "./Profile";

const Navigation = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [token, setToken] = useState<(ICompanyToken & IUserToken) | null>(null);
  const [showBigSearch, setShowBigSearch] = useState<boolean>(false);
  const navigate = useNavigate();  

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const logout = async () => {
    const href = window.location.href.split('/');
    const location = href[href.length - 1];
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
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      header.style.top = "-100px";
    } else {
      header.style.top = "0px";
    }
  };
  
  return (
    <>
      <nav className="navbar">
        <ul className="navbar__list">
          <li className="navbar__list-item">
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive ? "navbar__list-link--active" : "navbar__list-link"
              }
            >
              <BsGearWideConnected></BsGearWideConnected>
              mech.io
            </NavLink>
          </li>
          {((!token && !state.loggedIn) || (token && state.loggedIn)) && (
            <li className="navbar__list-item">
              <NavLink
                to={"/poslodavci"}
                className={({ isActive }) =>
                  isActive ? "navbar__list-link--active" : "navbar__list-link"
                }
              >
                Za poslodavce
              </NavLink>
            </li>
          )}
          {((!token && !state.loggedIn) || (token && state.loggedIn)) && (
            <li className="navbar__list-item">
              <NavLink
                to={"/posloprimci"}
                className={({ isActive }) =>
                  isActive ? "navbar__list-link--active" : "navbar__list-link"
                }
              >
                Za posloprimce
              </NavLink>
            </li>
          )}
          {(state.user || state.company || token) && (
            <li className="navbar__list-item">
              <NavLink
                to={"/recenzije"}
                className={({ isActive }) =>
                  isActive ? "navbar__list-link--active" : "navbar__list-link"
                }
              >
                Recenzije
              </NavLink>
            </li>
          )}
          {(state.user || state.company || token) && (
            <li className="navbar__list-item">
              <NavLink
                to={"/poslovi"}
                className={({ isActive }) =>
                  isActive ? "navbar__list-link--active" : "navbar__list-link"
                }
              >
                Poslovi
              </NavLink>
            </li>
          )}
          {(state.user || state.company || token) && (
          <li className="navbar__list-item">
            <NavLink to={`/profil/${state._id ? state._id : token?._id}`} className="navbar__list-link">
              Profil
            </NavLink>
          </li>)}
          {(state.user || state.company || token) && (
            <li>
              <Button variant="primary" onClick={logout}>
                Odjavi se
              </Button>
            </li>
          )}
        </ul>
        <SearchBackdrop
          show={showBigSearch}
          setShowBigSearch={setShowBigSearch}
          showBigSearch={showBigSearch}
        ></SearchBackdrop>
      </nav>
    </>
  );
};

export default Navigation;
