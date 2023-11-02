import { useState, useEffect, useContext, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import "./App.scss";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

import { ICompany } from "./pages/companies/Company.types";
import { IJobs } from "./pages/jobs/Jobs.types";

import useFetch from "./hooks/useFetch";
import Profile from "./components/Profile";
import { IUserToken } from "./pages/users/User.types";
import { ICompanyToken } from "./pages/companies/Company.types";
import { AuthContext } from "./context/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";

const Home = lazy(() => import('./pages/home/Home'));
const User = lazy(() => import('./pages/users/User'));
const Company = lazy(() => import('./pages/companies/Company'));
const Jobs = lazy(() => import('./pages/jobs/Jobs'));
const NewJob = lazy(() => import('./pages/jobs/NewJob'));
const SpecificJob = lazy(() => import('./pages/jobs/SpecificJob'));
const ChangeJob = lazy(() => import('./pages/jobs/ChangeJob'));
const Feedbacks = lazy(() => import('./pages/feedbacks/Feedbacks'));
const SpecificFeedback = lazy(() => import('./pages/feedbacks/SpecificFeedback'));
const Payments = lazy(() => import('./pages/payments/Payments'));

declare global {
  interface Window {
    dataLayer: any;
  }
}

function App() {
  const [companies, setCompanies] = useState<ICompany[] | []>([]);
  const [jobs, setJobs] = useState<[] | IJobs[]>([]);
  const [refetch, setRefetch] = useState<boolean>(false);
  const { state } = useContext(AuthContext);
  const [token, setToken] = useState<(ICompanyToken & IUserToken) | null>(null);

  useEffect(() => {
    if (localStorage.getItem("decodedToken")) {
      const tokenObj = localStorage.getItem("decodedToken");
      const tokenReal = JSON.parse(tokenObj!);
      setToken(tokenReal);
    }
  }, []);

  const getCompanies = useFetch({
    url: "https://mechio-api-test.onrender.com/poslodavci",
    method: "get",
    onSuccess: (data) => {
      setCompanies(data);
    },
    onError: (error) => {},
    onInit: true
  });

  const getJobs = useFetch({
    url: "https://mechio-api-test.onrender.com/poslovi",
    method: "get",
    onSuccess: (data) => {
      setJobs(data);
    },
    onError: (error) => {},
    onInit: true
  });

  useEffect(() => {
    if (refetch) {
      getJobs.handleFetch("https://mechio-api-test.onrender.com/poslovi");
      getCompanies.handleFetch(
        "https://mechio-api-test.onrender.com/poslodavci"
      );
    }
    setRefetch(false);
  }, [refetch]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <header className="header">
        <Navigation />
      </header>
      <BackToTop></BackToTop>
      <Routes>
        <Route path="/" element={<Home jobs={jobs} status={getJobs.status} />}></Route>
        <Route
          path="/posloprimci"
          element={<User status={getJobs.status}></User>}
        ></Route>
        <Route
          path="/poslodavci"
          element={<Company status={getJobs.status}></Company>}
        ></Route>

        <Route
          path="/poslovi"
          element={<Jobs status={getJobs.status}></Jobs>}
        ></Route>
        <Route
          path="/poslovi/novi-oglas"
          element={<NewJob setRefetch={setRefetch}></NewJob>}
        ></Route>
        <Route
          path="/poslovi/:id"
          element={
            <SpecificJob
              setRefetch={setRefetch}
              companies={companies}
            ></SpecificJob>
          }
        ></Route>
        <Route
          path="/poslovi/izmijeni-oglas/:id"
          element={<ChangeJob setRefetch={setRefetch}></ChangeJob>}
        ></Route>
        <Route
          path="/recenzije"
          element={<Feedbacks status={getCompanies.status}></Feedbacks>}
        ></Route>
        <Route
          path="/recenzije/:id"
          element={<SpecificFeedback></SpecificFeedback>}
        ></Route>
        <Route path="/profil/:id" element={<Profile></Profile>} />
        {(state.company || token?.company) ? <Route path='/placanje' element={<Payments></Payments>} /> : <Route path="*" element={<Navigate to={'/'} />}/>}
      </Routes>
      <Footer></Footer>
    </Suspense>
  );
}

export default App;
