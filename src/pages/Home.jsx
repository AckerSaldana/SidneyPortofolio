import { useEffect } from 'react';
import Hero from '../sections/Hero';
import Philosophy from '../sections/Philosophy';
import Gallery from '../sections/Gallery';
import Process from '../sections/Process';

const Home = ({ preloaderComplete, onProjectClick }) => {
  return (
    <div className="content-wrapper">
      <Hero startAnimation={preloaderComplete} />
      <Philosophy />
      <Gallery onProjectClick={onProjectClick} />
      <Process />
    </div>
  );
};

export default Home;
