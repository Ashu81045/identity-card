import React, { useState } from 'react';
import './RegistrationForm.css'; // Import CSS file for styling
import { saveFormData } from '../utitlities/services';
import { generateRandomID } from '../utitlities/utility';
import CustomDropdown from './CustomDropDown';
import  Modal from './Modal';
import { compressImage,readFileAsDataURL } from '../utitlities/utility';
const cityOptions = [
    { label: '09-Araria', value: 'AR' },
    { label: '12-Purnia', value: 'PR' },
    { label: '10-Kishanganj', value: 'KN' },
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


const RegistrationForm = () => {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [bloodGroupError, setBloodGroupError] = useState('');
    const [designation, setDesignation] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoError, setProfilePhotoError] = useState('');
    const [district, setSetDistrict] = useState('');
    const [districtError, setDistrictError] = useState('');
    const [kusang, setKushang] = useState('');
    const [kusangError, setKusangError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uniqueID, setUniqueID] = useState('');
    const [age, setAge] = useState('');
    const [ageError, setAgeError] = useState('');
    const [designationError, setDesignationError] = useState('');
    const [otherKusang, setOtherKusang] = useState('');
    const [otherKusangError, setOtherKusangError] = useState('');


    const handleDistrictSelect = (option) => {
        setSetDistrict(option.value);
        console.log(option, "optin")
        setDistrictError(''); // Clear error message when district is selected
    };
    const resetFormData = () => {
        setName('');
        setPhone('');
        setBloodGroup('');
        setProfilePhoto('');
        setSetDistrict('');
        setKusangError('');
        setAge('');
        setAgeError('');
        setDesignation('');
        setDesignationError('');
    }

    const closeModal = () => {
        setIsModalOpen(false);
      };

    const handleKushangSelect = (option) => {
        setKushang(option.value);
        if(option.value){
            setKusangError(''); // Clear error message when kusang is selected
        }
        
    };
    
    const handleOtherKusangChange = (event) => {
        const value = event.target.value;
        setOtherKusang(value);
        if (value.length >= 3) {
            setOtherKusangError(''); // Clear error message when name is at least 3 characters long
        }
    };

    const handleNameChange = (event) => {
        const value = event.target.value;
        setName(value);
        if (value.length >= 2) {
            setNameError(''); // Clear error message when name is at least 3 characters long
        }
    };

    const handlePhoneChange = (event) => {
        const value = event.target.value;
        setPhone(value);
        if (/^[6-9]\d{9}$/.test(value)) {
            setPhoneError(''); // Clear error message when phone is a valid 10-digit number
        }
    };

    const handleBloodGroupChange = (event) => {
        const value = event.target.value;
        setBloodGroup(value);
        if (value) {
            setBloodGroupError(''); // Clear error message when blood group is entered
        }
    };
    const handleAgeChange = (event) => {
        const value = event.target.value;
        setAge(value);
        if(value) {
            setAgeError('');
        }
    }

    const handleProfilePhotoUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                // Load the image as a data URL
                const imageDataUrl = await readFileAsDataURL(file);
                // Compress the image
                const compressedImageDataUrl = await compressImage(imageDataUrl);
    
                // Set the compressed image as the profile photo
                setProfilePhoto(compressedImageDataUrl);
                setProfilePhotoError(''); // Clear error message when profile photo is uploaded
            } catch (error) {
                console.error('Error compressing image:', error);
                // Handle error
            }
        }
    };
    

    const handleSubmit = (event) => {
        event.preventDefault();

        // Form validation
        let isValid = true;

        if (!district) {
            setDistrictError('Please select a district.');
            isValid = false;
        } else {
            setDistrictError('');
        }

        if (!kusang) {
            setKusangError('Please select a kusang.');
            isValid = false;
        } else {
            setKusangError('');
        }
        if(kusang === 'OTHER'){
            if (!otherKusang) {
                setOtherKusangError('You must specify Kushang as you selected OTHER.');
                isValid = false;
            } else {
                setOtherKusangError('');
            }
        }

        if (!name || name.length < 3) {
            setNameError('Name must be at least 3 characters long.');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            setPhoneError('Please enter a valid 10-digit phone number.');
            isValid = false;
        } else {
            setPhoneError('');
        }

        if (!bloodGroup) {
            setBloodGroupError('Please enter your blood group.');
            isValid = false;
        } else {
            setBloodGroupError('');
        }

        if (!profilePhoto) {
            setProfilePhotoError('Please select a profile photo.');
            isValid = false;
        } else {
            setProfilePhotoError('');
        }
        if(!age){
            setAgeError('Please enter your age');
            isValid = false;
        }else if(age < 18 ){
            isValid = false;
            setAgeError('Age should be greater than 18');
        } else {
            setAgeError('');
        }
        if(!designation){
            setDesignationError('Please enter your designation');
            isValid = false;
        } else {
            setDesignationError('');
        }

        // If form is valid, submit
        if (isValid) {
            setIsLoading(true);
            let finalKusang = kusang ==='OTHER' ? `OTHER:${otherKusang}`: kusang;
            let formData = {
                name: name,
                phone: phone,
                bloodGroup: bloodGroup,
                designation: designation,
                profilePhoto: profilePhoto,
                district: district,
                kusang: finalKusang,
                uniqueID:generateRandomID(district),
                approved:false,
                age:age
            };
            console.log(formData,"formData")
            saveFormData(formData)
            .then((data)=>{
                setIsLoading(false);
                setUniqueID(data);
                console.log(data);
                setIsModalOpen(true);
                resetFormData();
            })
            .catch(e =>{
                console.log(e);
                setIsLoading(false);
                alert("error ", e)
            })
        }
    };

    return (
        <div className="registration-form-container">
            <h2>Registration Forms</h2>
            <div className='drop-down-container'>
                <label>Select District</label>
                <CustomDropdown options={cityOptions} onSelect={handleDistrictSelect} />
                {districtError && <span className="error">{districtError}</span>}
                
            </div>
            <div className='drop-down-container'>
                <label>Select Kusang</label>
                <CustomDropdown options={KusangOptions} onSelect={handleKushangSelect} />
                {kusangError && <span className="error">{kusangError}</span>}
            </div>
            {kusang === "OTHER" && (
                <div className="form-group">
                    <label>Please add kusang *:</label>
                    <input type="text" value={otherKusang} onChange={handleOtherKusangChange} />
                    {otherKusangError && <span className="error">{otherKusangError}</span>}
                </div>
            )}

            {isLoading && <Spinner/>}
            <form onSubmit={handleSubmit}>
                <div className="profile-photo-container">
                    {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="profile-photo" />
                    ) : (
                        <div className="default-profile-photo"></div>
                    )}
                    <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} />
                    {profilePhotoError && <span className="error">{profilePhotoError}</span>}
                </div>
                <div style={{ marginTop: "4rem" }}>
                    <div className="form-group">
                        <label>Name *:</label>
                        <input type="text" value={name} onChange={handleNameChange} />
                        {nameError && <span className="error">{nameError}</span>}
                    </div>
                    <div className="form-group">
                        <label>Phone *:</label>
                        <input type="text" value={phone} onChange={handlePhoneChange} />
                        {phoneError && <span className="error">{phoneError}</span>}
                    </div>
                    <div className="form-group">
                        <label>Age *:</label>
                        <input type="text" value={age} onChange={handleAgeChange} />
                        {ageError && <span className="error">{ageError}</span>}
                    </div>
                    <div className="form-group">
                        <label>Blood Group *:</label>
                        <input type="text" value={bloodGroup} onChange={handleBloodGroupChange} />
                        {bloodGroupError && <span className="error">{bloodGroupError}</span>}
                    </div>
                    <div className="form-group">
                        <label>Designation *:</label>
                        <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                        {designationError && <span className="error">{designationError}</span>}
                    </div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <Modal data={uniqueID} isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default RegistrationForm;
const Spinner = () => {
    return (
      <div className="spinner-overlay">
        <div className="spinner"></div>
      </div>
    );
  };
