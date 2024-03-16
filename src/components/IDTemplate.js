import React from 'react';
import './IDCardTemplate.css'; // Import CSS for styling if needed
import photoUrl from "../assets/EC.png"
import signature from "../assets/signature-2.png";

const IDCardTemplate = ({ item, onApprove }) => {
    const { bloodGroup, designation, name, phone, profilePhoto, id, approved } = item;

    return (
        <div className="id-card-container">
            {/* Header */}
            <div className="header">
                <img src={photoUrl} alt="Logo" className="logo" />
                <div className="election-text">
                    <div className="election-main">LOK SABHA ELECTION</div>
                    <div className="election-sub">Election Commission of India</div>
                </div>
            </div>

            {/* Photo */}
            <div className="photo-section">
                <img src={profilePhoto} alt="Photos" className="photo" />
            </div>

            {/* Name and Details */}
            <div className="details-section">
                <div className="detail-item">
                    <div className="label">Name:</div>
                    <div className="value">{name}</div>
                </div>
                <div className="detail-item">
                    <div className="label">Phone:</div>
                    <div className="value">{phone}</div>
                </div>
                <div className="detail-item">
                    <div className="label">Blood Group:</div>
                    <div className="value">{bloodGroup}</div>
                </div>
                <div className="detail-item">
                    <div className="label">Designation:</div>
                    <div className="value">{designation}</div>
                </div>
                {/* Add other details here */}
            </div>

            {/* Signature */}
            <div className="signature-section">
                <img src={signature} alt="Signature" className="signature" />
                <div>Authorized Signatory</div>
            </div>

            {/* Privacy and Legal Text */}
            <div className="privacy-text">
                {/* Add privacy and legal text here */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis ultricies enim, sed fermentum quam varius in. Nulla facilisi.
            </div>
            {!approved && (
                <button className="approve-button" onClick={() => onApprove(id)}>
                    Approve
                </button>
            )}
        </div>
    );
};

export default IDCardTemplate;
