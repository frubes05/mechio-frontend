import { useState, useEffect, useContext, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import "./App.scss";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

import Profile from "./components/Profile";
import { IUserToken } from "./pages/users/User.types";
import { ICompanyToken } from "./pages/companies/Company.types";
import { AuthContext } from "./context/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";

const Home = lazy(() => import("./pages/home/Home"));
const User = lazy(() => import("./pages/users/User"));
const Company = lazy(() => import("./pages/companies/Company"));
const Jobs = lazy(() => import("./pages/jobs/Jobs"));
const NewJob = lazy(() => import("./pages/jobs/NewJob"));
const SpecificJob = lazy(() => import("./pages/jobs/SpecificJob"));
const ChangeJob = lazy(() => import("./pages/jobs/ChangeJob"));
const Feedbacks = lazy(() => import("./pages/feedbacks/Feedbacks"));
const SpecificFeedback = lazy(
  () => import("./pages/feedbacks/SpecificFeedback")
);
const Payments = lazy(() => import("./pages/payments/Payments"));

declare global {
  interface Window {
    dataLayer: any;
  }
}

function App() {
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<(ICompanyToken & IUserToken) | null>(null);

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <header className="header">
        <Navigation />
      </header>
      <BackToTop></BackToTop>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/posloprimci" element={<User />}></Route>
        <Route path="/poslodavci" element={<Company />}></Route>

        <Route path="/poslovi" element={<Jobs />}></Route>
        <Route
          path="/poslovi/novi-oglas"
          element={<NewJob />}
        ></Route>
        <Route
          path="/poslovi/:id"
          element={<SpecificJob />}
        ></Route>
        <Route
          path="/poslovi/izmijeni-oglas/:id"
          element={<ChangeJob />}
        ></Route>
        <Route path="/recenzije" element={<Feedbacks />}></Route>
        <Route
          path="/recenzije/:id"
          element={<SpecificFeedback />}
        ></Route>
        <Route path="/profil/:id" element={<Profile />} />
        {state.company || token?.company ? (
          <Route path="/placanje" element={<Payments />} />
        ) : (
          <Route path="*" element={<Navigate to={"/"} />} />
        )}
      </Routes>
      <Footer></Footer>
    </Suspense>
  );
}

export default App;
