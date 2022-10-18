import React, { useState, useEffect } from 'react';
import HomeImage from './HomeImage';
import HomeJobs from './HomeJobs';
import LoadingSpinner from '../../components/LoadingSpinner';
import HomeBenefits from './HomeBenefits';
import HomeTypewritter from './HomeTypewritter';
import BackToTop from '../../components/BackToTop';

import useFetch from '../../hooks/useFetch';

import { IJobs } from "../jobs/Jobs.types";

interface IHome {
  jobs: IJobs[],
  status: string;
}

const Home: React.FC<IHome> = ({ jobs, status }) => {
  const [lastAdded, setLastAdded] = useState<IJobs[] | null>(null);

  return (
    <main className='home'>
        <HomeImage position='top'>
          <HomeTypewritter></HomeTypewritter>
        </HomeImage>
        <HomeJobs></HomeJobs>
        <HomeImage position='middle'></HomeImage>
        <HomeBenefits></HomeBenefits>
        {status === 'Pending' && <LoadingSpinner></LoadingSpinner>}
    </main>
  )
}

export default Home