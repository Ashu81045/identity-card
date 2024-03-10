import React from 'react';
import Header from './Header';
import ImageSection from '../components/ImageSection';
import RegistrationForm from '../components/RegistrationForm';
const HomeLayout = () => {


  

 

  
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

  return (
    <React.Fragment>
        <Header/>
            <div className='main-container'>
            <ImageSection/>
            <RegistrationForm />
        </div>
    </React.Fragment>
  );
};

export default HomeLayout;
