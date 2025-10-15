import signatureImage from '../assets/signature.png'
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
//import signatureImage from '../assets/signature.png'

const BulkIDCardPreview = ({ userList }) => {
  const cityOptions = {
    AR: '09-Araria',
    PR: '12-Purnia',
    KN: '10-Kishanganj',
  };

  const cardsContainerRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!cardsContainerRef.current) return;

    try {
      // Show loading state
      const button = document.getElementById('download-pdf-btn');
      if (button) {
        button.disabled = true;
        button.textContent = 'Generating PDF...';
      }

      // Capture the HTML content as canvas with A4 dimensions
      const canvas = await html2canvas(cardsContainerRef.current, {
        scale: 3, // Higher quality for better PDF
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: cardsContainerRef.current.offsetWidth,
        height: cardsContainerRef.current.offsetHeight
      });

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Create PDF in portrait orientation
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate image dimensions to fit A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const imgData = canvas.toDataURL('image/png');
      
      // Add images page by page
      let heightLeft = imgHeight;
      let position = 0;
      let page = 0;

      while (heightLeft > 0) {
        if (page > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;
        page++;
      }

      // Save PDF
      pdf.save(`bihar_election_id_cards_${userList.length}_cards.pdf`);

      // Reset button state
      if (button) {
        button.disabled = false;
        button.textContent = 'Download as PDF';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      
      // Reset button state
      const button = document.getElementById('download-pdf-btn');
      if (button) {
        button.disabled = false;
        button.textContent = 'Download as PDF';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* Print Button */}
      <div className="max-w-7xl mx-auto mb-6 no-print">
        <div className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Bulk ID Cards Preview ({userList.length} cards)
          </h2>
          <div className="flex gap-3">
            <button
              id="download-pdf-btn"
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
            >
              Download as PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
            >
              Print All Cards
            </button>
          </div>
        </div>
      </div>

      {/* ID Cards Grid - A4 Layout */}
      <div className="mx-auto bg-white p-8" ref={cardsContainerRef} style={{ width: '210mm', minHeight: '297mm' }}>
        <div className="grid grid-cols-3 gap-4">
          {userList.map((user, index) => (
            <IDCard key={index} user={user} cityOptions={cityOptions} />
          ))}
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
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

const IDCard = ({ user, cityOptions }) => {
  return (
    <div className="bg-white border-2 border-red-600 p-2 break-inside-avoid flex flex-col" style={{ height: '88mm', width: '62mm' }}>
      {/* Header */}
      <div className="text-center mb-1">
        <h1 className="text-red-600 font-bold text-[9px] tracking-wide leading-tight">
          BIHAR ASSEMBLY GENERAL<br/>ELECTION · 2025
        </h1>
      </div>

      {/* District and Identity Card Header */}
      <div className="flex items-center justify-between mb-1.5">
        {/* Left ECI Logo */}
        <div className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center bg-white flex-shrink-0">
          <div className="text-center">
            <div className="w-5 h-3 bg-gradient-to-b from-orange-500 via-white to-green-600 rounded"></div>
            <div className="text-[5px] font-bold mt-0.5">ECI</div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 text-center px-1">
          <div className="text-[7px] font-semibold italic mb-0.5">
            District : {cityOptions[user.district] || 'Kishanganj'}
          </div>
          <div className="inline-block bg-blue-700 text-white px-2 py-0.5 rounded-full font-bold text-[6px]">
            Identity Card
          </div>
        </div>

        {/* Right ECI Logo */}
        <div className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center bg-white flex-shrink-0">
          <div className="text-center">
            <div className="w-5 h-3 bg-gradient-to-b from-orange-500 via-white to-green-600 rounded"></div>
            <div className="text-[5px] font-bold mt-0.5">ECI</div>
          </div>
        </div>
      </div>

      {/* Photo Box */}
      <div className="flex justify-center mb-1.5">
        <div className="w-16 h-16 border border-gray-800 bg-gray-50 flex items-center justify-center overflow-hidden">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt="IDPhoto" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-[7px]">Photo</span>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-1 flex-grow">
        {/* Name */}
        <div className="flex items-center">
          <div className="text-red-600 font-bold w-14 text-[7px] flex-shrink-0">Name</div>
          <div className="flex-1 border-b border-dotted border-blue-800 pb-0.5 min-h-[9px]">
            <span className="text-gray-900 text-[7px] font-medium break-words leading-tight">{user.name}</span>
          </div>
        </div>

        {/* Designation */}
        <div className="flex items-center">
          <div className="text-red-600 font-bold w-14 text-[7px] flex-shrink-0">Designation</div>
          <div className="flex-1 border-b border-dotted border-blue-800 pb-0.5 min-h-[9px]">
            <span className="text-gray-900 text-[7px] font-medium break-words leading-tight">{user.designation}</span>
          </div>
        </div>

        {/* Department */}
        <div className="flex items-center">
          <div className="text-red-600 font-bold w-14 text-[7px] flex-shrink-0">Dep. Ele. Duty</div>
          <div className="flex-1 border-b border-dotted border-blue-800 pb-0.5 min-h-[9px]">
            <span className="text-gray-900 text-[7px] font-medium break-words leading-tight">{user.kusang || user.department}</span>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center">
          <div className="text-red-600 font-bold w-14 text-[7px] flex-shrink-0">Mob.:</div>
          <div className="flex-1 border-b border-dotted border-blue-800 pb-0.5 min-h-[9px]">
            <span className="text-gray-900 text-[7px] font-medium leading-tight">{user.phone || user.mobile}</span>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="flex justify-between items-end mt-2">
        <div className="text-left">
          <div className="h-5 w-14 border-b border-gray-400 mb-0.5"></div>
          <div className="font-semibold text-[5px] leading-tight">Card Holder<br/>Signature</div>
        </div>
        <div className="text-center">
          <div className="h-8 w-16 flex items-center justify-center mb-0.5">
           
              <img src={signatureImage} alt="Signature" className="max-h-full max-w-full object-contain" />
           
          </div>
          <div className="text-[5px] font-semibold leading-tight">Issuing<br/>Authority</div>
        </div>
      </div>
    </div>
  );
};

export default BulkIDCardPreview;