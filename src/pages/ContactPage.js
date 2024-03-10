import React, { useState } from "react";
import Header from "../Layout/Header";
import "./TrackingPage.css";
import { searchDocumentByPhoneNumber } from "../utitlities/services";
import { isNotEmpty } from "../utitlities/utility";
import PreviewModal from "../components/PreviewModal";
import IDCardTemplate from "../components/IDTemplate";

const ContactPage = () => {
 


  return (
    <React.Fragment>
      <Header />
      <div style={{ margin: "1rem" }}>
        <div className="tracking-container">
          <h2 className="tracking-heading">This Page is under development</h2>
          <p>Please visit us later</p>
          </div>
          </div>
    </React.Fragment>
  );
};

export default ContactPage;
