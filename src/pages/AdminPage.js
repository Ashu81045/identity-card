import React, { useState, useEffect } from "react";
import Header from "../Layout/Header";
import "./AdminPage.css";
import photoUrl from "../assets/EC.png";
import { retrieveAllData, updateDocument } from "../utitlities/services";
import LoginForm from "../components/LoginForm";
import PreviewModal from "../components/PreviewModal";
import IDCardTemplate from "../components/IDTemplate";

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dataList, setDataList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    retrieveAllData()
    .then(data => {
        setIsLoading(false);
        console.log(data, "data");
        setDataList(data);
        
    }).catch( e =>{
        setIsLoading(false);
        console.log(e)
    });
  }, [isLoggedIn]);

  // Filter the list based on the search term
  const filteredData = dataList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredData, "searchData");

  // Handle approve button click
  const handleApprove = (id) => {
    setIsLoading(true)
    console.log(id, "id");
    updateDocument(id, true)
    .then(()=>{ 
        setIsLoading(false);
        alert("You have successfully approved!");
    })
    .catch(()=>setIsLoading(false));
  };

  const handleLogin = (mobileNumber, password) => {
    // Handle form submission logic here
   if((mobileNumber === "9667833075" || "9470062768") && password === "Admin@123"){
    setIsLoggedIn(true);
   }else{
    alert("You don't have access to this page");
   }
  };

  // Handle decline button click
  const handleDecline = (id) => {
    // Implement decline functionality
    setIsLoading(true)
    console.log(id, "id");
    updateDocument(id, false)
    .then(()=> setIsLoading(false))
    .catch(()=>setIsLoading(false));
  };
  const toggleModal = (item) => {
    setSelectedItem(item);
    setShowModal(!showModal);
  };

  // Handle download button click
  const handleDownload = (id) => {
    // Implement download functionality
  };

  return (
    <React.Fragment>
      <Header />
      <div style={{ margin: "1rem" }}>
        {/* Search input */}
        {!isLoggedIn && <LoginForm onLogin={handleLogin} />}
        {isLoggedIn && <React.Fragment>
            <div style={{ marginLeft: "0.7rem", width: "101.5%" }}>
          <input
            type="text"
            placeholder="Search by number or unique ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {dataList.map((item) => (
          <div className="card">
            <div className="image-container">
              <img
                src={item.profilePhoto}
                alt={item.name}
                className="profile-photo-1"
              />
            </div>
            <div className="details">
              <h2>{item.name}</h2>
              <p>ID: {item.uniqueID}</p>
              <p>Status: {item.approved ? "Approved" : "In Progress"}</p>
              <div className="buttons">
                <button onClick={(id) => handleDecline(item.id)}>
                  Decline
                </button>
                <button onClick={(id) => toggleModal(item)}>
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
        </React.Fragment>}
      </div>
      {isLoading && <Spinner/>}
      {showModal && (
        <PreviewModal onClose={() => setShowModal(false)}>
          <IDCardTemplate item={selectedItem} onApprove={handleApprove}/>
        </PreviewModal>
      )}
    </React.Fragment>
  );
};

export default AdminPage;
const Spinner = () => {
    return (
      <div className="spinner-overlay">
        <div className="spinner"></div>
      </div>
    );
  };