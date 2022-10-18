import { RefObject, useEffect, useRef } from "react";
import ReactDom from "react-dom";
import { AiOutlineArrowUp } from "react-icons/ai";

const BackToTop = () => {
  const backToTop = useRef() as RefObject<HTMLButtonElement>;
  const backToTopWrapper = document.querySelector("#back-to-top") as HTMLDivElement;

  useEffect(() => {
      checkWindowSize();
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", checkWindowSize);
  }, []);

  const checkWindowSize = () => {
    const backToTopBtn = backToTop.current as HTMLButtonElement;
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      backToTopBtn.classList.add("back-to-top__button");
      backToTopBtn.classList.remove("back-to-top__remove");
    } else {
      backToTopBtn.classList.remove("back-to-top__button")
      backToTopBtn.classList.add("back-to-top__remove");
    }
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {ReactDom.createPortal(
        <div className="back-to-top">
          <button className="back-to-top__button" onClick={scrollTop} ref={backToTop}>
            <AiOutlineArrowUp></AiOutlineArrowUp>
          </button>
        </div>, 
        backToTopWrapper
      )}
    </>
  );
};

export default BackToTop;
