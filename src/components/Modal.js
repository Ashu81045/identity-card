import React from"react";

const Modal = ({data, isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Success!</h2>
          <p>Your data has been saved successfully.Your Reference Number is: {data}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  export default Modal;