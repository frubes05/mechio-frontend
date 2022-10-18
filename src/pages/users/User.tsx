import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserRegister from "./UserRegister";
import UserLogin from "./UserLogin";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const User = () => {
  const navigate = useNavigate();
  const [showingForm, setShowingForm] = useState<boolean>(false);

  const changeShowingForm = () => {
    setShowingForm(!showingForm);
  };

  const handleToastError = (message: string) => toast.error(message, {autoClose: 2000});
  const handleToastSuccess = (message: string) => {
    toast.success(message, {autoClose: 2000});
    setTimeout(() => {
      navigate('/poslovi')
    }, 4000)
}
  return (
    <section className="user">
      <div className="user__container">
        <video className="user__video" autoPlay loop muted playsInline>
          <source src="./media/video.mp4"></source>
        </video>
      </div>
      <div className="user__wrapper">
        <div className="user__form">
          <ToastContainer position="top-center" autoClose={3000}/>
          {!showingForm && (
            <div className="user__form-wrapper">
              <h1>Prijava</h1>
              <UserLogin changeShowingForm={changeShowingForm} handleToastError={handleToastError} handleToastSuccess={handleToastSuccess} />
            </div>
          )}
          {showingForm && (
            <div className="user__form-wrapper">
              <h1>Registracija</h1>
              <UserRegister changeShowingForm={changeShowingForm} handleToastError={handleToastError} handleToastSuccess={handleToastSuccess}/>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default User;
