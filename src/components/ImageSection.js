import React from 'react';
import './Section.css'; // Import CSS file for styling
import sectionImage from '../assets/EC.png'; // Import the section image file

const ImageSection = () => {
  return (
    <section className="section">
      <div className="section-content">
      <div className="section-text">
          <h2>LOK SABHA ELCECTION - 2024</h2>        
        </div>
        {/* Image on the left */}
        <img src={sectionImage} alt="Section" className="section-image" />

        {/* Text on the right */}
       
      </div>
    </section>
  );
};

export default ImageSection;
