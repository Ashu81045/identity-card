import React, { useState, useEffect } from "react";
import Header from "../Layout/Header";
import "./AdminPage.css";
import { retrieveAllData, updateDocument } from "../utitlities/services";
import LoginForm from "../components/LoginForm";
import PreviewModal from "../components/PreviewModal";
import IDCardTemplate from "../components/IDTemplate";
import BulkPDFDownloadButton from "../components/BulkPDFDownload";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { extractDate } from "../utitlities/utility";
import CustomDropdown from "../components/CustomDropDown";
import UpdateSignature from "../components/UpdateSignature";
//import { addInitialDistrictOptions, addInitialKushangOptions } from "../utitlities/services";

const AdminPage = () => {
  
  const [dataList, setDataList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState(dataList); // Initialize filteredData with all data
  const [kushang, setKushang] = useState('');
  const [district, setDistrict] = useState('');

  const cityOptions = [
    { label: "Araria", value: "AR" },
    { label: "Purnia", value: "PR" },
    { label: "Kishanganj", value: "KN" },
  ];

  const KusangOptions = [
    { label: 'ACTIVE MEDIA GROUP', value: 'ACTIVE MEDIA GROUP' },
    { label: 'ADARSH ACHAR SANHITA', value: 'ADARSH ACHAR SANHITA' },
    { label: 'CONTROL ROOM', value: 'CONTROL ROOM' },
    { label: 'CPMF', value: 'CPMF' },
    { label: 'Computerization Cell', value: 'Computerization Cell' },
    { label: 'DEMP CELL', value: 'DEMP CELL' },
    { label: 'DISTRICT COMMUNICATION', value: 'DISTRICT COMMUNICATION' },
    { label: 'DISTRICT CONTROL', value: 'DISTRICT CONTROL' },
    { label: 'EVM/VVPAT', value: 'EVM/VVPAT' },
    { label: 'Expenditure Monitoring', value: 'Expenditure Monitoring' },
    { label: 'IT CELL', value: 'IT CELL' },
    { label: 'KARMIK CELL', value: 'KARMIK CELL' },
    { label: 'KARMIK KALYAN', value: 'KARMIK KALYAN' },
    { label: 'LAW AND ORDER', value: 'LAW AND ORDER' },
    { label: 'MEDIA /MCMC', value: 'MEDIA /MCMC' },
    { label: 'MATERIAL CELL', value: 'MATERIAL CELL' },
    { label: 'NOMINATION CELL', value: 'NOMINATION CELL' },
    { label: 'Postal Ballot', value: 'Postal Ballot' },
    { label: 'PWDs CELL', value: 'PWDs CELL' },
    { label: 'SECTOR MAGISTRATE', value: 'SECTOR MAGISTRATE' },
    { label: 'SINGLE WINDOW', value: 'SINGLE WINDOW' },
    { label: 'STRONG ROOM', value: 'STRONG ROOM' },
    { label: 'SWEEP', value: 'SWEEP' },
    { label: 'TRANING CELL', value: 'TRANING CELL' },
    { label: 'OTHER', value: 'OTHER' }
];

useEffect(() => {
  if (startDate && endDate) {
      // Filter data based on date range, district, and Kushang value
      const filtered = dataList.filter((item) => {
          const date = new Date(extractDate(item.uniqueID));
          const isWithinDateRange = date >= startDate && date <= endDate;
          const isKushangMatched = kushang ?
              (item.kusang === kushang || (kushang.startsWith("OTHER") && item.kusang.startsWith("OTHER:"))) :
              true;
          const isDistrictMatched = district ? item.district === district : true;
          return isWithinDateRange && isKushangMatched && isDistrictMatched;
      });
      setFilteredData(filtered);
  } else if (kushang) {
      // Filter data based on Kushang value and district if no date range selected
      const filtered = dataList.filter((item) => {
          const isKushangMatched = item.kusang === kushang || (kushang.startsWith("OTHER") && item.kusang.startsWith("OTHER:"));
          const isDistrictMatched = district ? item.district === district : true;
          return isKushangMatched && isDistrictMatched;
      });
      setFilteredData(filtered);
  } else if (district) {
      // Filter data based on district if no date range or Kushang selected
      const filtered = dataList.filter((item) => item.district === district);
      setFilteredData(filtered);
  } else {
      // If no date range, Kushang, or district selected, show all data
      setFilteredData(dataList);
  }
}, [startDate, endDate, dataList, kushang, district]);


  useEffect(() => {
    setIsLoading(true);
    retrieveAllData()
    .then(data => {
      setIsLoading(false);
      setDataList(data);
    }).catch( e => {
      setIsLoading(false);
      console.log(e)
    });
  }, [isLoggedIn]);

  // Handle login logic
  const handleLogin = (mobileNumber, password) => {
    if ((mobileNumber === "9667833075" || "9470062768") && password === "Admin@123") {
      setIsLoggedIn(true);
    } else {
      alert("You don't have access to this page");
    }
  };

  // Handle approve button click
  const handleApprove = (id) => {
    setIsLoading(true);
    updateDocument(id, true)
    .then(() => { 
      setIsLoading(false);
      alert("You have successfully approved!");
    })
    .catch(() => setIsLoading(false));
  };

  // Handle decline button click
  const handleDecline = (id) => {
    setIsLoading(true);
    updateDocument(id, false)
    .then(() => setIsLoading(false))
    .catch(() => setIsLoading(false));
  };

  // Handle dropdown select for kushang
  const handleKushangSelect = (option) => {
    setKushang(option.value); 
  };
  const handleDistrictSelect = (option) =>{
    setDistrict(option.value);
  }
  // const setInitialValue = () =>{
  //   addInitialDistrictOptions(cityOptions);
  // addInitialKushangOptions(KusangOptions);
  // }

  // Handle reset button click
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setKushang('');
    setDistrict('');
  };

  // Toggle modal
  const toggleModal = (item) => {
    setSelectedItem(item);
    setShowModal(!showModal);
  };

  return (
    <React.Fragment>
      <Header />
      <div style={{ margin: "1rem" }}>
        {!isLoggedIn && <LoginForm onLogin={handleLogin} />}
        {isLoggedIn && (
          <React.Fragment>
            <div className="filter-card">
              <div className="filter-class">
              <p className="para-text">Please select date range</p>
              <div className="para-text">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="From"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="To"
                  minDate={startDate}
                />
              </div>
              <div className="kusang-cont">
                <label>Select District</label>
                <CustomDropdown options={cityOptions} onSelect={handleDistrictSelect} />
              </div>
              <div className="kusang-cont">
                <label>Select Kusang</label>
                <CustomDropdown options={KusangOptions} onSelect={handleKushangSelect} />
              </div>
              <p className="para-text">Number of ID: {filteredData.length}</p>
              <button className="reset-button" onClick={handleReset}>Reset All filters</button>
              <BulkPDFDownloadButton userList={filteredData} />
              </div>
              <div className="seperator"/>
              <div className="signature-class">
                <UpdateSignature/>
              </div>
             
            </div>
            {isLoading && <Spinner />}
            {filteredData.map((item) => (
              <div className="card" key={item.id}>
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
                    <button onClick={() => handleDecline(item.id)}>Decline</button>
                    <button onClick={() => toggleModal(item)}>Approve</button>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        )}
      </div>
      {showModal && (
        <PreviewModal onClose={() => setShowModal(false)}>
          <IDCardTemplate item={selectedItem} onApprove={handleApprove} />
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
