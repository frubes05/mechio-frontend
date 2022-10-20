import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import CollapsibleExample from './components/AlternateNavigation';
import Jobs from './pages/jobs/Jobs';
import NewJob from './pages/jobs/NewJob';
import SpecificJob from './pages/jobs/SpecificJob';
import ChangeJob from './pages/jobs/ChangeJob';
import Company from './pages/companies/Company';
import Feedbacks from './pages/feedbacks/Feedbacks';
import './App.scss';
import User from './pages/users/User';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

import { ICompany } from "./pages/companies/Company.types";
import { IJobs } from "./pages/jobs/Jobs.types";

import useFetch from './hooks/useFetch';
import SpecificFeedback from './pages/feedbacks/SpecificFeedback';
import Profile from './components/Profile';
import DefaultProfile from './components/DefaultProfile';

function App() {
  const [companies, setCompanies] = useState<ICompany[] | []>([]);
  const [jobs, setJobs] = useState<[] | IJobs[]>([]);
  const [refetch, setRefetch] = useState<boolean>(false);

  const getCompanies = useFetch({
    url: "https://mechio-api-test.onrender.com/poslodavci",
    method: 'get',
    onSuccess: (data) => {
      setCompanies(data);
    },
    onError: (error) => {
    }
  })

  const getJobs = useFetch({
    url: "https://mechio-api-test.onrender.com/poslovi",
    method: 'get',
    onSuccess: (data) => {
      setJobs(data);
    },
    onError: (error) => {
    }
  })

  useEffect(() => {
    if (refetch) {
      getJobs.handleFetch('https://mechio-api-test.onrender.com/poslovi')
      getCompanies.handleFetch('https://mechio-api-test.onrender.com/poslodavci');
    }
    setRefetch(false);
  }, [refetch])
  
  return (
    <>
      <header className='header'>
          <CollapsibleExample></CollapsibleExample>
      </header>
      <BackToTop></BackToTop>
      <Routes>
        <Route path='/' element={<Home jobs={jobs} status={getJobs.status}></Home>}></Route>
        <Route path='/posloprimci' element={<User></User>}></Route>
        <Route path='/poslodavci' element={<Company></Company>}></Route>

        <Route path='/poslovi' element={<Jobs status={getJobs.status}></Jobs>}></Route>
        <Route path='/poslovi/novi-oglas' element={<NewJob setRefetch={setRefetch} status={getJobs.status}></NewJob>}></Route>
        <Route path='/poslovi/:id' element={<SpecificJob setRefetch={setRefetch} companies={companies} status={getJobs.status}></SpecificJob>}></Route>
        <Route path='/poslovi/izmijeni-oglas/:id' element={<ChangeJob setRefetch={setRefetch} status={getJobs.status}></ChangeJob>}></Route>
        <Route path='/recenzije' element={<Feedbacks status={getCompanies.status}></Feedbacks>}></Route>
        <Route path='/recenzije/:id' element={<SpecificFeedback></SpecificFeedback>}></Route>
        <Route path='/profil/:id' element={<Profile></Profile>} />
        <Route path='/profil/default/:id' element={<DefaultProfile></DefaultProfile>} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;
