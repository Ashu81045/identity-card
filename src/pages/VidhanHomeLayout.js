import React from 'react';
import Header from '../Layout/Header';
import ImageSection from '../components/ImageSection';
import BidhanSabhaRegistration from '../components/BidhanSabhaRegistration';
const VidhanHomeLayout = () => {
  return (
    <React.Fragment>
        <Header/>
            <div className='main-container'>
            <ImageSection heading="VIDHAN SABHA ELECTION - 2025"/>
            <BidhanSabhaRegistration />
        </div>
    </React.Fragment>
  );
};

export default VidhanHomeLayout;
