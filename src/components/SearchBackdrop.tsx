import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import { Link } from "react-router-dom";
import { ISearch } from "./SearchBackrop.types";
import { ICompany } from "../pages/companies/Company.types";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { Spinner } from "react-bootstrap";

const Search = ({ show, setShowBigSearch, showBigSearch }: ISearch) => {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [companies, setCompanies] = useState<ICompany[] | null>(null);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    axios
      .get("https://mechio-test-api.onrender.com/poslodavci")
      .then((res) => setCompanies(res.data));
  }, []);

  useEffect(() => {
    if(showBigSearch === false) setInput('');
  }, [showBigSearch])

  show
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");

 const imitateLoading = (e:any) => {
     setShowLoading(true);
     setTimeout(() => {
        setShowLoading(false);
        setInput(e.target.value);
     }, 500)
 }

  return (
    <>
      {show && (
        <>
          <div
            className="search__backdrop"
            onClick={() => setShowBigSearch(false)}
          ></div>
          <div className="search__backdrop-input">
           {showLoading && <Spinner animation="border" role="status" className="search__backdrop-spinner">
              <span className="visually-hidden">Loading...</span>
            </Spinner>}
           {!showLoading && <AiOutlineSearch></AiOutlineSearch>}
            <input
              placeholder="Pretražite tvrtke..."
              onChange={imitateLoading}
            />
            <ul className="search__backdrop-list">
              {companies &&
                input &&
                companies
                  .filter(
                    (company) =>
                      company.companyName
                        ?.toString()
                        .toUpperCase()
                        .startsWith(input.toUpperCase()) ||
                      company.companyName
                        ?.toString()
                        .toUpperCase()
                        .includes(input.toUpperCase())
                  )
                  .map((company, id) => (
                    <li key={id} className="search__backdrop-item">
                      <Link to={"#"} className="search__backdrop-link">
                        <img
                          className="search__backdrop-input--image"
                          src={"https://mechio-test-api.onrender.com/" + company.companyImage}
                        />
                        <div className="search__backdrop-input--content">
                          <h3>{company.companyName}</h3>
                        </div>
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

const SearchBackdrop = ({ show, setShowBigSearch, showBigSearch }: ISearch) => {
  const backdrop = document.querySelector("#search-backdrop") as HTMLElement;

  return (
    <>
      {ReactDom.createPortal(
        <Search show={show} setShowBigSearch={setShowBigSearch} showBigSearch={showBigSearch}></Search>,
        backdrop
      )}
    </>
  );
};

export default SearchBackdrop;
