import React, { useState } from "react";
import CustomDropdown from "./CustomDropDown";
import "./RegistrationForm.css";
import signatureImage from "../assets/signature.png";
import { generateRandomID } from "../utitlities/utility";
import { saveFormDataBS } from "../utitlities/services";
import Modal from "./Modal";
import { compressImage, readFileAsDataURL } from "../utitlities/utility";
import { KusangOptions } from "../utitlities/const";
import logo from "../assets/EC.png";

const BidhanSabhaRegistration = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [designation, setDesignation] = useState("");
  const [designationError, setDesignationError] = useState("");

  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoError, setProfilePhotoError] = useState("");
  const [district, setSetDistrict] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uniqueID, setUniqueID] = useState("");

  // 🔹 Kusang States
  const [kusangError, setKusangError] = useState("");
  const [kusang, setKushang] = useState("");
  const [otherKusangError, setOtherKusangError] = useState("");
  const [otherKusang, setOtherKusang] = useState("");

  // ✅ Final Kusang (computed field)
  const finalKusang = kusang === "OTHER" ? `OTHER:${otherKusang}` : kusang;

  const cityOptions = [
    { label: "Araria", value: "AR" },
    { label: "Purnia", value: "PR" },
    { label: "Kishanganj", value: "KN" },
    { label: "Madhepura", value: "MP" },
  ];

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    if (value.length >= 2) setNameError("");
  };

  const handleDesignationChange = (event) => {
    const value = event.target.value;
    setDesignation(value);
    if (value) setDesignationError("");
  };

  const handleMobileChange = (event) => {
    const value = event.target.value;
    setMobile(value);
    if (/^[6-9]\d{9}$/.test(value)) setMobileError("");
  };

  const handleProfilePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const imageDataUrl = await readFileAsDataURL(file);
        const compressedImageDataUrl = await compressImage(imageDataUrl);
        setProfilePhoto(compressedImageDataUrl);
        setProfilePhotoError("");
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleOtherKusangChange = (event) => {
    const value = event.target.value;
    setOtherKusang(value);
    if (value.length >= 3) setOtherKusangError("");
  };

  const handleKushangSelect = (option) => {
    setKushang(option.value);
    setKusangError("");
    setOtherKusang(""); // Reset when user changes from OTHER → normal
  };

  const handleDistrictSelect = (option) => {
    setSetDistrict(option.value);
    setDistrictError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = true;

    if (!district) {
      setDistrictError("Please select a district.");
      isValid = false;
    } else setDistrictError("");

    if (!name || name.length < 2) {
      setNameError("Name must be at least 2 characters long.");
      isValid = false;
    } else setNameError("");

    if (!designation) {
      setDesignationError("Please enter your designation.");
      isValid = false;
    } else setDesignationError("");

    // ✅ Kusang validation
    if (!kusang) {
      setKusangError("Please select a Kusang option.");
      isValid = false;
    } else if (kusang === "OTHER" && !otherKusang) {
      setOtherKusangError("Please enter other Kusang name.");
      isValid = false;
    } else {
      setKusangError("");
      setOtherKusangError("");
    }

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError("Please enter a valid 10-digit phone number.");
      isValid = false;
    } else setMobileError("");

    if (!profilePhoto) {
      setProfilePhotoError("Please upload a profile photo.");
      isValid = false;
    } else setProfilePhotoError("");

    if (isValid) {
      setIsLoading(true);
      const formData = {
        name,
        phone: mobile,
        designation,
        profilePhoto,
        district,
        uniqueID: generateRandomID(district),
        approved: false,
        // 🔸 Replaced department → kushang
        department: finalKusang,
      };

      saveFormDataBS(formData)
        .then((data) => {
          setIsLoading(false);
          setUniqueID(data);
          setIsModalOpen(true);
          resetForm();
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
          alert("Error saving data. Please try again.");
        });
    }
  };

  const resetForm = () => {
    setName("");
    setDesignation("");
    setMobile("");
    setProfilePhoto(null);
    setSetDistrict("");
    setKushang("");
    setOtherKusang("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-8 no-print">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Bihar Election Identity Card Form
        </h2>

        {isLoading && <Spinner />}

        <form onSubmit={handleSubmit}>
          {/* Profile Photo */}
          <div className="text-center mb-8">
            <div className="w-40 h-48 mx-auto mb-4 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Photo</span>
              )}
            </div>
            <label className="block mb-2 font-medium text-gray-700">
              Profile Photo *:
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleProfilePhotoUpload}
              className="block mx-auto text-sm"
            />
            {profilePhotoError && (
              <span className="text-red-600 text-sm block mt-2">
                {profilePhotoError}
              </span>
            )}
          </div>

          {/* District */}
          <div className="drop-down-container mb-5">
            <label>Select District *:</label>
            <CustomDropdown
              options={cityOptions}
              onSelect={handleDistrictSelect}
            />
            {districtError && <span className="error">{districtError}</span>}
          </div>

          {/* ✅ Kusang Dropdown */}
          <div className="drop-down-container mb-5">
            <label className="block mb-2 font-medium text-gray-700">
              Dep. for Ele. Duty *:
            </label>
            <CustomDropdown
              options={KusangOptions}
              onSelect={handleKushangSelect}
            />
            {kusangError && <span className="error">{kusangError}</span>}
          </div>

          {/* ✅ Show input when OTHER selected */}
          {kusang === "OTHER" && (
            <div className="form-group mb-5">
              <label>Please specify other Kusang *:</label>
              <input
                type="text"
                value={otherKusang}
                onChange={handleOtherKusangChange}
                className="w-full px-4 py-2 border border-gray-300 rounded text-base box-border"
                placeholder="Enter other Kusang name"
              />
              {otherKusangError && (
                <span className="error">{otherKusangError}</span>
              )}
            </div>
          )}

          {/* Name */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">
              Name *:
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-base box-border"
            />
            {nameError && (
              <span className="text-red-600 text-sm block mt-1">
                {nameError}
              </span>
            )}
          </div>

          {/* Designation */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">
              Designation *:
            </label>
            <input
              type="text"
              value={designation}
              onChange={handleDesignationChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-base box-border"
            />
            {designationError && (
              <span className="text-red-600 text-sm block mt-1">
                {designationError}
              </span>
            )}
          </div>

          {/* Mobile */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">
              Mobile *:
            </label>
            <input
              type="text"
              value={mobile}
              onChange={handleMobileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-base box-border"
            />
            {mobileError && (
              <span className="text-red-600 text-sm block mt-1">
                {mobileError}
              </span>
            )}
          </div>

          {/* Buttons */}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded text-base font-semibold hover:bg-blue-700 mt-3"
          >
            Generate & Print ID Card
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded text-base font-semibold hover:bg-gray-700 mt-3"
          >
            Reset Form
          </button>
        </form>
      </div>

      {/* ID Card Preview */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border-[2px] border-red-600 p-6 min-h-[650px]">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-red-600 font-bold text-2xl tracking-wide leading-tight mb-2">
              BIHAR ASSEMBLY GENERAL ELECTION · 2025
            </h1>
          </div>

          {/* District */}
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center bg-white overflow-hidden">
              <img src={logo} alt="ECI Logo" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-center px-3">
              <div className="text-lg font-semibold italic mb-2">
                District:{" "}
                {district
                  ? cityOptions.find((opt) => opt.value === district)?.label ||
                    "Kishanganj"
                  : "Kishanganj"}
              </div>
              <div className="inline-block bg-blue-700 text-white px-8 py-2 rounded-full font-bold text-base">
                Identity Card
              </div>
            </div>

            <div className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center bg-white">
              <img src={logo} alt="ECI Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          </div>

          {/* Photo */}
          <div className="flex justify-center mb-6">
            <div className="w-44 h-56 border-2 border-gray-800 bg-gray-50 flex items-center justify-center overflow-hidden">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="profilpic"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">Photo</span>
              )}
            </div>
          </div>

          {/* ID Card Details */}
          <div className="space-y-3">
            <InfoRow label="Name" value={name} />
            <InfoRow label="Designation" value={designation} />
            <InfoRow label="Dep. for Ele. Duty" value={finalKusang} />
            <InfoRow label="Mob.:" value={mobile} />
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end mt-10">
            <div className="text-left">
              <div className="h-16 w-40 border-b-2 border-gray-400 mb-2"></div>
              <div className="font-semibold text-sm">
                Signature of Card Holder
              </div>
            </div>
            <div className="text-right">
              <div className="h-16 w-48 flex items-center justify-center mb-2">
                <img
                  src={signatureImage}
                  alt="Signature"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="text-xs font-semibold">
                Signature of Issuing Authority
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>

      <Modal data={uniqueID} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

// ✅ Helper Component
const InfoRow = ({ label, value }) => (
  <div className="flex items-center">
    <div className="text-red-600 font-bold w-40 text-base">{label}</div>
    <div className="flex-1 border-b-2 border-dotted border-blue-800 pb-1 min-h-[28px]">
      <span className="text-gray-900 text-base font-medium">{value}</span>
    </div>
  </div>
);

const Spinner = () => (
  <div className="spinner-overlay">
    <div className="spinner"></div>
  </div>
);

export default BidhanSabhaRegistration;
