import React from 'react';
import Header from './Header';
import ImageSection from '../components/ImageSection';
import RegistrationForm from '../components/RegistrationForm';
const HomeLayout = () => {
  return (
    <React.Fragment>
        <Header/>
            <div className='main-container'>
            <ImageSection heading="GENERAL LOK SABHA ELECTION - 2025"/>
            <RegistrationForm />
        </div>
    </React.Fragment>
  );
};

export default HomeLayout;
