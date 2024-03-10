import React, { useState } from "react";
import Header from "../Layout/Header";
import "./TrackingPage.css";
import { searchDocumentByPhoneNumber } from "../utitlities/services";
import { isNotEmpty } from "../utitlities/utility";
import PreviewModal from "../components/PreviewModal";
import IDCardTemplate from "../components/IDTemplate";

const TrackingComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState({});
  const [isFound, setFound] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {approved, name, profilePhoto, uniqueID} = userData;

  const handleSearch = () => {
    // Call the onSearch method with the search term
    searchDocumentByPhoneNumber(searchTerm)
    .then((data) => {
        if(data!=null){
            setUserData(data);
            setFound(false)
        }else{
            setFound(true);
        }
        console.log(data, "data");
    });
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <React.Fragment>
      <Header />
      <div style={{ margin: "1rem" }}>
        <div className="tracking-container">
          <h2 className="tracking-heading">Track Your Application</h2>
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              className="tracking-input"
              placeholder="Enter Unique ID or mobile number"
            />
            <button onClick={handleSearch} className="tracking-button">
              Search
            </button>
          </div>
        </div>
        {!isFound && isNotEmpty(userData)&& (
        <div className="card-track">
            <div className="image-container">
                <img src={profilePhoto} alt={name} className="profile-photo-1" />
            </div>
            <div className="details">
                <h2>{name}</h2>
                <p>ID: {uniqueID}</p>
                <p>Status: {approved?"Approved":"In Progress"}</p>
                <div className="buttons--status">
                {approved?<button onClick={()=>setShowModal(true)}>Download</button>: <span>In Progress</span>}
                    
                </div>
            </div>
            </div>)}
            {isFound &&(
            <div className="card-track">
                <p>Nothing found, please check the details again</p>
            </div>
            )}
      </div>
      {showModal && (
        <PreviewModal onClose={() => setShowModal(false)}>
          <IDCardTemplate item={userData}/>
        </PreviewModal>
      )}
    </React.Fragment>
  );
};

export default TrackingComponent;
