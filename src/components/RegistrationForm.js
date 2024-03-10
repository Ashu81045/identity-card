import React, { useState } from 'react';
import './RegistrationForm.css'; // Import CSS file for styling
import { saveFormData } from '../utitlities/services';
import { generateRandomID } from '../utitlities/utility';
import CustomDropdown from './CustomDropDown';
import  Modal from './Modal';
const cityOptions = [
    { label: 'Araria', value: 'AR' },
    { label: 'Purnia', value: 'PR' },
    { label: 'Saharsa', value: 'SA' },
    { label: 'Madhepura', value: 'MR' },
];
const KusangOptions = [
    { label: 'Kushang AS', value: 'AS' },
    { label: 'Kushang AB', value: 'AB' },
    { label: 'Kushang AC', value: 'AC' },
    { label: 'Kushang AD', value: 'AD' },
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
    }

    const closeModal = () => {
        setIsModalOpen(false);
      };

    const handleKushangSelect = (option) => {
        setKushang(option.value);
        setKusangError(''); // Clear error message when kusang is selected
    };

    const handleNameChange = (event) => {
        const value = event.target.value;
        setName(value);
        if (value.length >= 3) {
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

    const handleProfilePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePhoto(reader.result);
                setProfilePhotoError(''); // Clear error message when profile photo is uploaded
            };
            reader.readAsDataURL(file);
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

        // If form is valid, submit
        if (isValid) {
            setIsLoading(true);
            let formData = {
                name: name,
                phone: phone,
                bloodGroup: bloodGroup,
                designation: designation,
                profilePhoto: profilePhoto,
                district: district,
                kusang: kusang,
                uniqueID:generateRandomID(district),
                approved:false
            };
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
                        <label>Blood Group *:</label>
                        <input type="text" value={bloodGroup} onChange={handleBloodGroupChange} />
                        {bloodGroupError && <span className="error">{bloodGroupError}</span>}
                    </div>
                    <div className="form-group">
                        <label>Designation *:</label>
                        <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} />
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
