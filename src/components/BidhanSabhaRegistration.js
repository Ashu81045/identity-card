import React, { useState } from "react";
import CustomDropdown from "./CustomDropDown";
import "./RegistrationForm.css";
import signatureImage from "../assets/signature.png";
import { generateRandomID } from "../utitlities/utility";
import { saveFormDataBS } from "../utitlities/services";
import Modal from "./Modal";
import { compressImage,readFileAsDataURL } from '../utitlities/utility';

const BidhanSabhaRegistration = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [designation, setDesignation] = useState("");
  const [designationError, setDesignationError] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoError, setProfilePhotoError] = useState("");
//   const [signatureImage, setSignatureImage] = useState(SignatureImg);
  //   const [signatureError, setSignatureError] = useState('');
  const [district, setSetDistrict] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uniqueID, setUniqueID] = useState("");

  const cityOptions = [
    { label: "09-Araria", value: "AR" },
    { label: "12-Purnia", value: "PR" },
    { label: "10-Kishanganj", value: "KN" },
  ];

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    if (value.length >= 2) {
      setNameError("");
    }
  };

  const handleDesignationChange = (event) => {
    const value = event.target.value;
    setDesignation(value);
    if (value) {
      setDesignationError("");
    }
  };

  const handleDepartmentChange = (event) => {
    const value = event.target.value;
    setDepartment(value);
    if (value) {
      setDepartmentError("");
    }
  };

  const handleMobileChange = (event) => {
    const value = event.target.value;
    setMobile(value);
    if (/^[6-9]\d{9}$/.test(value)) {
      setMobileError("");
    }
  };

  const handleProfilePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    // Read file as Data URL
    const imageDataUrl = await readFileAsDataURL(file);

    // Compress image
    const compressedImageDataUrl = await compressImage(imageDataUrl);

    // Convert compressed Base64 -> Blob
    const blob = await fetch(compressedImageDataUrl).then(res => res.blob());

    // Store Blob in state (for Firebase Storage upload)
    setProfilePhoto(blob);
    setProfilePhotoError('');

  } catch (error) {
    console.error('Error compressing image:', error);
    setProfilePhotoError('Error compressing image');
  }
};

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //   const handleSignatureUpload = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setSignatureImage(reader.result);
  //         setSignatureError('');
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = true;

    if (!district) {
      setDistrictError("Please select a district.");
      isValid = false;
    } else {
      setDistrictError("");
    }

    if (!name || name.length < 2) {
      setNameError("Name must be at least 2 characters long.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!designation) {
      setDesignationError("Please enter your designation.");
      isValid = false;
    } else {
      setDesignationError("");
    }

    if (!department) {
      setDepartmentError("Please enter your department.");
      isValid = false;
    } else {
      setDepartmentError("");
    }

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError("Please enter a valid 10-digit phone number.");
      isValid = false;
    } else {
      setMobileError("");
    }

    if (!profilePhoto) {
      setProfilePhotoError("Please upload a profile photo.");
      isValid = false;
    } else {
      setProfilePhotoError("");
    }

    if (isValid) {
      setIsLoading(true);
      let formData = {
        name: name,
        phone: mobile,
        designation: designation,
        profilePhoto: profilePhoto,
        district: district,
        uniqueID: generateRandomID(district),
        approved: false,
        department:department
      };
      saveFormDataBS(formData)
        .then((data) => {
          setIsLoading(false);
          setUniqueID(data);
          console.log(data);
          setIsModalOpen(true);
          resetForm();
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
          alert("error ", e);
        });

      //   alert('Form submitted successfully!');
      //   window.print();
    }
  };

  const handleDistrictSelect = (option) => {
    setSetDistrict(option.value);
    console.log(option, "option");
    setDistrictError("");
  };

  const resetForm = () => {
    setName("");
    setDesignation("");
    setDepartment("");
    setMobile("");
    setProfilePhoto(null);
    // setSignatureImage(null);
    setSetDistrict("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-8 no-print">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Bihar Election Identity Card Form
        </h2>
        {isLoading && <Spinner />}
        <form onSubmit={handleSubmit}>
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

          <div className="drop-down-container mb-5">
            <label>Select District *:</label>
            <CustomDropdown
              options={cityOptions}
              onSelect={handleDistrictSelect}
            />
            {districtError && <span className="error">{districtError}</span>}
          </div>

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

          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">
              Dep. for Ele. Duty *:
            </label>
            <input
              type="text"
              value={department}
              onChange={handleDepartmentChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-base box-border"
            />
            {departmentError && (
              <span className="text-red-600 text-sm block mt-1">
                {departmentError}
              </span>
            )}
          </div>

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

          {/* <div className="mb-5 pb-5 border-b-2 border-gray-200">
            <label className="block mb-2 font-medium text-gray-700">Signature Image *:</label>
            <div className="w-40 h-20 mx-auto mb-3 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              {signatureImage ? (
                <img src={signatureImage} alt="Signature" className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-gray-400 text-sm">No Signature</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              className="block mx-auto text-sm"
            />
            {signatureError && (
              <span className="text-red-600 text-sm block mt-2 text-center">{signatureError}</span>
            )}
          </div> */}

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

          {/* District and Identity Card Header */}
          <div className="flex items-center justify-between mb-5">
            {/* Left ECI Logo */}
            <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center bg-white flex-shrink-0">
              <div className="text-center">
                <div className="w-12 h-8 bg-gradient-to-b from-orange-500 via-white to-green-600 rounded"></div>
                <div className="text-xs mt-1 font-bold">ECI</div>
              </div>
            </div>

            {/* Center Content */}
            <div className="flex-1 text-center px-3">
              <div className="text-lg font-semibold italic mb-2">
                District :{" "}
                {district
                  ? cityOptions.find((opt) => opt.value === district)?.label ||
                    "Kishanganj"
                  : "Kishanganj"}
              </div>
              <div className="inline-block bg-blue-700 text-white px-8 py-2 rounded-full font-bold text-base">
                Identity Card
              </div>
            </div>

            {/* Right ECI Logo */}
            <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center bg-white flex-shrink-0">
              <div className="text-center">
                <div className="w-12 h-8 bg-gradient-to-b from-orange-500 via-white to-green-600 rounded"></div>
                <div className="text-xs mt-1 font-bold">ECI</div>
              </div>
            </div>
          </div>

          {/* Photo Box */}
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

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Name */}
            <div className="flex items-center">
              <div className="text-red-600 font-bold w-40 text-base">Name</div>
              <div className="flex-1 border-b-2 border-dotted border-blue-800 pb-1 min-h-[28px]">
                <span className="text-gray-900 text-base font-medium">
                  {name}
                </span>
              </div>
            </div>

            {/* Designation */}
            <div className="flex items-center">
              <div className="text-red-600 font-bold w-40 text-base">
                Designation
              </div>
              <div className="flex-1 border-b-2 border-dotted border-blue-800 pb-1 min-h-[28px]">
                <span className="text-gray-900 text-base font-medium">
                  {designation}
                </span>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-center">
              <div className="text-red-600 font-bold w-40 text-base">
                Dep. for Ele. Duty
              </div>
              <div className="flex-1 border-b-2 border-dotted border-blue-800 pb-1 min-h-[28px]">
                <span className="text-gray-900 text-base font-medium">
                  {department}
                </span>
              </div>
            </div>

            {/* Mobile */}
            <div className="flex items-center">
              <div className="text-red-600 font-bold w-40 text-base">Mob.:</div>
              <div className="flex-1 border-b-2 border-dotted border-blue-800 pb-1 min-h-[28px]">
                <span className="text-gray-900 text-base font-medium">
                  {mobile}
                </span>
              </div>
            </div>
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
                {signatureImage ? (
                  <img
                    src={signatureImage}
                    alt="Signature"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div
                    className="font-bold text-3xl italic"
                    style={{ fontFamily: "cursive" }}
                  >
                    J.Kumar
                  </div>
                )}
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

export default BidhanSabhaRegistration;
const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
};
