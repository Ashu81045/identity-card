import React, { useRef } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Modal = ({ children, onClose }) => {
    const modalContentRef = useRef(null);
    const handleDownload = () => {
        // Reference to the modal content element
        // Use html2canvas to capture the modal content as an image
        html2canvas(modalContentRef.current).then((canvas) => {
          // Convert the canvas image to a data URL
          const imgData = canvas.toDataURL('image/png');
      
          // Initialize jspdf and set document size
          const pdf = new jsPDF({
            orientation: 'portrait', // 'portrait' or 'landscape'
            unit: 'mm',
            format: 'a4',
          });
      
          // Add the captured image to the PDF document
          pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // Adjust width and height as needed
      
          // Download the PDF file
          pdf.save('modal_content.pdf');
        });
      };
  return (
    <div className="modal-overlay">
      <div className="modal-content" >
        {/* Close button */}
        
        {/* Render children */}
        <div ref={modalContentRef}>
        {children}
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        <button className="download-btn" onClick={handleDownload}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Modal;
