import React, { useState } from "react";
import { saveSignatureData } from "../utitlities/services";
import { compressImage, readFileAsDataURL } from "../utitlities/utility";
import CustomDropdown from "./CustomDropDown";

const AdminPage = () => {
  const [district, setDistrict] = useState("");
  const [kushang, setKushang] = useState("");
  const [signature, setSignature] = useState(null);

  const cityOptions = [
    { label: "Araria", value: "araria" },
    { label: "Purnia", value: "purnia" },
    { label: "Kishanganj", value: "kishanganj" },
  ];
  const KusangOptions = [
    { label: "ACTIVE MEDIA GROUP", value: "ACTIVE MEDIA GROUP" },
    { label: "ADARSH ACHAR SANHITA", value: "ADARSH ACHAR SANHITA" },
    { label: "CONTROL ROOM", value: "CONTROL ROOM" },
    { label: "CPMF", value: "CPMF" },
    { label: "Computerization Cell", value: "Computerization Cell" },
    { label: "DEMP CELL", value: "DEMP CELL" },
    { label: "DISTRICT COMMUNICATION", value: "DISTRICT COMMUNICATION" },
    { label: "DISTRICT CONTROL", value: "DISTRICT CONTROL" },
    { label: "EVM/VVPAT", value: "EVM/VVPAT" },
    { label: "Expenditure Monitoring", value: "Expenditure Monitoring" },
    { label: "IT CELL", value: "IT CELL" },
    { label: "KARMIK CELL", value: "KARMIK CELL" },
    { label: "KARMIK KALYAN", value: "KARMIK KALYAN" },
    { label: "LAW AND ORDER", value: "LAW AND ORDER" },
    { label: "MEDIA /MCMC", value: "MEDIA /MCMC" },
    { label: "MATERIAL CELL", value: "MATERIAL CELL" },
    { label: "NOMINATION CELL", value: "NOMINATION CELL" },
    { label: "Postal Ballot", value: "Postal Ballot" },
    { label: "PWDs CELL", value: "PWDs CELL" },
    { label: "SECTOR MAGISTRATE", value: "SECTOR MAGISTRATE" },
    { label: "SINGLE WINDOW", value: "SINGLE WINDOW" },
    { label: "STRONG ROOM", value: "STRONG ROOM" },
    { label: "SWEEP", value: "SWEEP" },
    { label: "TRANING CELL", value: "TRANING CELL" },
    { label: "OTHER", value: "OTHER" },
  ];

  const handleDistrictChange = (event) => {
    console.log(event, "event");
    setDistrict(event.value);
    setKushang(""); // Reset Kushang when district changes
  };

  const handleKushangChange = (event) => {
    setKushang(event.value);
  };

  const handleSignatureUpload = async (event) => {
    const file = event.target.files[0];
    // Convert file to base64 and setSignature
    if (file) {
      try {
        // Load the image as a data URL
        const imageDataUrl = await readFileAsDataURL(file);
        // Compress the image
        const compressedImageDataUrl = await compressImage(imageDataUrl);
        // Set the compressed image as the profile photo
        setSignature(compressedImageDataUrl);
      } catch (error) {
        console.error("Error compressing image:", error);
        // Handle error
      }
    }
  };

  const handleSaveSignature = () => {
    if (district && kushang) {
      saveSignatureData(district, kushang, signature)
        .then((data) => {
          console.log("saved successfully", data);
        })
        .catch((e) => console.log("error updating signature", e));
    } else {
      alert("please select kushang and district");
    }
    // Save signature to Firestore
  };
  return (
    <div>
      <div className="drop-down-container">
        <label>Select District</label>
        <CustomDropdown
          options={cityOptions}
          onSelect={handleDistrictChange}
          isNew
        />
      </div>
      <div className="drop-down-container">
        <label>Select Kusang</label>
        <CustomDropdown
          options={KusangOptions}
          onSelect={handleKushangChange}
        />
      </div>
      <input type="file" accept="image/*" onChange={handleSignatureUpload} />
      <button onClick={handleSaveSignature}>Save Signature</button>
    </div>
  );
};

export default AdminPage;
