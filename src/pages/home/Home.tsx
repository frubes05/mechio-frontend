import React, { useEffect } from 'react';
import HomeJobs from './HomeJobs';
import HomeBenefits from './HomeBenefits';
import HomeMain from './HomeMain';
import HomeAbout from './HomeAbout';

import { IJobs } from "../jobs/Jobs.types";
import HomeAnalytics from './HomeAnalytics';

interface IHome {
  jobs?: IJobs[],
  status?: string;
}

const Home: React.FC<IHome> = ({ jobs, status }) => {

  useEffect(() => {
    localStorage.setItem('initial', 'true');
  }, []);

  return (
    <main className='home'>
        <HomeMain></HomeMain>
        <HomeAnalytics data={jobs}></HomeAnalytics>
        <HomeJobs></HomeJobs>
        <HomeBenefits></HomeBenefits>
        <HomeAbout></HomeAbout>
    </main>
  )
}

export default Home