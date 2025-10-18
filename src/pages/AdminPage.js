import React, { useState, useEffect } from "react";
import Header from "../Layout/Header";
import "./AdminPage.css";
import { retrieveAllData, updateDocument, retrieveAllDataBs } from "../utitlities/services";
import LoginForm from "../components/LoginForm";
import PreviewModal from "../components/PreviewModal";
import IDCardTemplate from "../components/IDTemplate";
import BulkPDFDownloadButton from "../components/BulkPDFDownload";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { extractDate } from "../utitlities/utility";
import CustomDropdown from "../components/CustomDropDown";
import UpdateSignature from "../components/UpdateSignature";
import { KusangOptions } from "../utitlities/const";
import BulkIdPreviewBs from "../components/BulkIdPreviewBs";

// ✅ Helper function to unify kushang / kusang / department access
const getKushangValue = (item) => item?.kushang || item?.kusang || item?.department || "";

const AdminPage = () => {
  const [dataList, setDataList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState(dataList);
  const [kushang, setKushang] = useState('');
  const [district, setDistrict] = useState('');
  const [type, setType] = useState('');

  const cityOptions = [
    { label: "Araria", value: "AR" },
    { label: "Purnia", value: "PR" },
    { label: "Kishanganj", value: "KN" },
    { label: "Madhepura", value: "MP" },
  ];

  // ✅ Updated filtering logic (unified kushang/department support)
  useEffect(() => {
    const filtered = dataList.filter((item) => {
      const date = new Date(extractDate(item.uniqueID));
      const kushangValue = getKushangValue(item);

      const isWithinDateRange = startDate && endDate ? (date >= startDate && date <= endDate) : true;
      const isKushangMatched = kushang
        ? (
            kushangValue === kushang ||
            (kushang.startsWith("OTHER") && kushangValue.startsWith("OTHER:"))
          )
        : true;
      const isDistrictMatched = district ? item.district === district : true;

      return isWithinDateRange && isKushangMatched && isDistrictMatched;
    });

    setFilteredData(filtered);
  }, [startDate, endDate, dataList, kushang, district]);

  useEffect(() => {
    setIsLoading(true);
    if (isLoggedIn && type === 'ls') {
      retrieveAllData()
        .then(data => {
          setIsLoading(false);
          setDataList(data);
        }).catch(e => {
          setIsLoading(false);
          console.log(e);
        });
    }
    if (isLoggedIn && type === 'bs') {
      retrieveAllDataBs()
        .then(data => {
          setIsLoading(false);
          setDataList(data);
        }).catch(e => {
          setIsLoading(false);
          console.log(e);
        });
    }
  }, [isLoggedIn, type]);

  const handleLogin = (mobileNumber, password) => {
    if ((mobileNumber === "9667833075" || "9470062768") && password === "Admin@12345!") {
      setIsLoggedIn(true);
    } else {
      alert("You don't have access to this page");
    }
  };

  const handleApprove = (id) => {
    setIsLoading(true);
    updateDocument(id, true, type)
      .then(() => {
        setIsLoading(false);
        alert("You have successfully approved!");
      })
      .catch(() => setIsLoading(false));
  };

  const handleDecline = (id) => {
    setIsLoading(true);
    updateDocument(id, false, type)
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  };

  const handleKushangSelect = (option) => {
    setKushang(option.value);
  };

  const handleDistrictSelect = (option) => {
    setDistrict(option.value);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setKushang('');
    setDistrict('');
  };

  const toggleModal = (item) => {
    setSelectedItem(item);
    setShowModal(!showModal);
  };

  return (
    <React.Fragment>
      <Header />
      <div style={{ margin: "1rem" }}>
        {!isLoggedIn && <LoginForm onLogin={handleLogin} />}
        {isLoggedIn && type === '' && (
          <>
            <button onClick={() => { setType('bs'); }}>Vidhan Sabha</button>
            <button onClick={() => { setType('ls'); }}>Lok Sabha</button>
          </>
        )}
        {isLoggedIn && type === 'ls' && (
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
              <div className="seperator" />
              <div className="signature-class">
                <UpdateSignature />
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
        {isLoggedIn && type === 'bs' && (
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
                {type === 'ls' ? (
                  <BulkPDFDownloadButton userList={filteredData} />
                ) : (
                  <BulkIdPreviewBs userList={filteredData} />
                )}
              </div>
              <div className="seperator" />
              <div className="signature-class">
                <UpdateSignature />
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
