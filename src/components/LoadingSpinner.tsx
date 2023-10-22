import ReactDom from "react-dom";
import Spinner from "react-bootstrap/Spinner";

export const Backdrop = () => {
  return (
    <div className={`backdrop`}>
      <Spinner className="spinner" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

const LoadingSpinner = () => {
  const backdrop = document.querySelector("#backdrop-wrapper") as HTMLElement;

  return <div>{ReactDom.createPortal(<Backdrop></Backdrop>, backdrop)}</div>;
};

export default LoadingSpinner;
