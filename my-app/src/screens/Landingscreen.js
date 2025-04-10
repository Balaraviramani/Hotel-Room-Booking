import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Landingscreen() {
  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

  return (
    <div className='row landing justify-content-center'>
      <div
        className='col-md-9 my-auto text-center'
        style={{ borderRight: '8px solid white' }}
        data-aos='fade-up'
      >
        <h2 style={{ color: 'white', fontSize: '130px' }} data-aos='zoom-in'>
          YoYRooms
        </h2>
        <h1 style={{ color: 'white' }} data-aos='fade-right'>
          "There is only one boss. The Guest"
        </h1>
        <Link to='/home'>
          <button
            className='btn landingbtn mt-3'
            style={{ color: 'black' }}
            data-aos='fade-up'
          >
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Landingscreen;
