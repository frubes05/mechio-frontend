import React, { useState, useEffect } from 'react';
import HomeJobs from './HomeJobs';
import LoadingSpinner from '../../components/LoadingSpinner';
import HomeBenefits from './HomeBenefits';
import HomeMain from './HomeMain';
import HomeAbout from './HomeAbout';

import { IJobs } from "../jobs/Jobs.types";

interface IHome {
  jobs: IJobs[],
  status: string;
}

const Home: React.FC<IHome> = ({ jobs, status }) => {
  const [lastAdded, setLastAdded] = useState<IJobs[] | null>(null);

  return (
    <main className='home'>
        <HomeMain></HomeMain>
        <HomeJobs></HomeJobs>
        <HomeBenefits></HomeBenefits>
        <HomeAbout></HomeAbout>
        {status === 'Pending' && <LoadingSpinner></LoadingSpinner>}
    </main>
  )
}

export default Home