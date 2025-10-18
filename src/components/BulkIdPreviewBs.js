import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import logo from '../assets/EC.png';

const BulkIDCardPreview = ({ userList }) => {
  const cityOptions = {
    AR: 'Araria',
    PR: 'Purnia',
    KN: 'Kishanganj',
    MP: 'Madhepura'
  };

  const cardsContainerRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!cardsContainerRef.current) return;

    try {
      const button = document.getElementById('download-pdf-btn');
      if (button) {
        button.disabled = true;
        button.textContent = 'Generating PDF...';
      }

      const canvas = await html2canvas(cardsContainerRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: cardsContainerRef.current.offsetWidth,
        height: cardsContainerRef.current.offsetHeight
      });

      const pdfWidth = 210;
      const pdfHeight = 304;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const imgData = canvas.toDataURL('image/png');
      
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

      pdf.save(`bihar_election_id_cards_${userList.length}_cards.pdf`);

      if (button) {
        button.disabled = false;
        button.textContent = 'Download as PDF';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      
      const button = document.getElementById('download-pdf-btn');
      if (button) {
        button.disabled = false;
        button.textContent = 'Download as PDF';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
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
    <div 
      className="relative bg-gradient-to-br from-white to-gray-50 rounded-lg overflow-hidden break-inside-avoid shadow-lg"
      style={{ 
        width: '62mm', 
        height: '92mm',
        border: '2px solid #1e40af'
      }}
    >
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-700 rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-700 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-700 rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-700 rounded-br-lg"></div>

      {/* Main Content */}
      <div className="relative h-full flex flex-col p-2.5">
        {/* Header Section */}
        <div className="text-center mb-0.5">
          <div className="flex justify-center items-center gap-2 mb-0.5">
            <div className="w-9 h-9 rounded-full bg-white shadow-md p-1 border-2 border-blue-700 flex-shrink-0">
              <img
                src={logo}
                alt="ECI Logo"
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-[9px] font-black text-blue-800 tracking-wide uppercase leading-tight">
                Bihar Assembly
              </h1>
              <h2 className="text-[8px] font-bold text-gray-800 tracking-wide leading-tight">
                General Election 2025
              </h2>
            </div>

            <div className="w-9 h-9 rounded-full bg-white shadow-md p-1 border-2 border-blue-700 flex-shrink-0">
              <img
                src={logo}
                alt="ECI Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="dummy-decorator inline-block bg-gradient-to-r from-blue-700 to-blue-900 text-white px-3 rounded-full shadow-md">
            <span className="text-[6px] font-bold tracking-wide">IDENTITY CARD</span>
          </div>
          
          <div className="mt-0.5 text-[6px] font-semibold text-gray-700 italic">
            District: {cityOptions[user.district] || 'Kishanganj'}
          </div>
        </div>

        {/* Photo Section */}
        <div className="flex justify-center mb-1">
          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-300"
            style={{ width: '28mm', height: '32mm' }}
          >
            {user.profilePhoto ? (
              <img 
                src={user.profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-[8px] text-gray-400 font-semibold">PHOTO</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-1 mb-1">
          <DetailRow label="Name" value={user.name} />
          <DetailRow label="Designation" value={user.designation} />
          <DetailRow label="Dept. Ele. Duty" value={user.kusang || user.department} />
          <DetailRow label="Mobile" value={user.phone || user.mobile} />
        </div>

        {/* Footer Section */}
        <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-300">
          <div className="text-left flex flex-col">
            <div className="h-3 mb-1"></div>
            <div className="w-20 border-b border-gray-800"></div>
            <div className="text-[5px] font-semibold text-gray-700 leading-tight mt-0.5">Card Holder<br/>Signature</div>
          </div>
          
          <div className="text-center flex flex-col">
            <div className="h-3 mb-1"></div>
            <div className="w-20 border-b border-gray-800"></div>
            <div className="text-[5px] font-semibold text-gray-700 leading-tight mt-0.5">Issuing<br/>Authority</div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="text-lg font-black text-gray-800 rotate-[-30deg]">
          BIHAR 2025
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => {
  return (
    <div className="flex items-start gap-1">
      <div className="text-[7px] font-bold text-blue-800 uppercase tracking-wide whitespace-nowrap flex-shrink-0" style={{ minWidth: '35%' }}>
        {label}:
      </div>
      <div className="text-[8px] font-semibold text-gray-900 break-words leading-tight flex-1 bg-gray-50 px-1.5 py-0.5 rounded border-l-2 border-blue-600">
        {value || 'N/A'}
      </div>
    </div>
  );
};

export default BulkIDCardPreview;