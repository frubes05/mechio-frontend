import React from 'react';
import HomeJobs from './HomeJobs';
import HomeBenefits from './HomeBenefits';
import HomeMain from './HomeMain';
import HomeAbout from './HomeAbout';

import HomeAnalytics from './HomeAnalytics';
import useSWR from 'swr';
import { fetcher } from '../../services/fetcher';

const Home: React.FC = () => {
  const { data: jobs } = useSWR(`https://mechio-api-test.onrender.com/poslovi`, fetcher);
  const { data: feedbacks } = useSWR(`https://mechio-api-test.onrender.com/recenzije`, fetcher);
  const { data: latestFeedbacks } = useSWR('https://mechio-api-test.onrender.com/recenzije/zadnje', fetcher);

  return (
    <main className='home'>
        <HomeMain />
        <HomeAnalytics jobs={jobs} feedbacks={feedbacks} />
        <HomeJobs jobs={jobs} />
        <HomeBenefits />
        <HomeAbout latestFeedbacks={latestFeedbacks} />
    </main>
  )
}

export default Home