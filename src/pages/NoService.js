import React from "react";
import Header from "../Layout/Header";
import "./TrackingPage.css";


const NoService = () => {
 


  return (
    <React.Fragment>
      <Header />
      <div style={{ margin: "1rem" }}>
        <div className="tracking-container">
          <h2 className="tracking-heading">Free services have been terminated, please contact admin for help.</h2>
          <p>Thank you, have a good day!!</p>
          </div>
          </div>
    </React.Fragment>
  );
};

export default NoService;
