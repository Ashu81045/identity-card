import React from 'react';
import { jsPDF } from 'jspdf';

// const generatePDF = (userList) => {
//   const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
//   const allDistrict = {
//     AR: "07-Araria",
//     PR: "12-Purnia",
//     KN: "40-Kishanganj"
//   }

//   // Define constants for layout
//   const cardWidth = 85.6; // CR80 standard width in mm
//   const cardHeight = 53.98; // CR80 standard height in mm
//   const marginLeft = 10;
//   const marginTop = 10;
//   const gutter = 3; // Gap between cards
//   const maxCardsPerPage = 6; // Maximum number of cards per page
//   let cardsAdded = 0;

//   // Loop through each user and add their details to the PDF
//   userList.forEach((user, index) => {
//     // Calculate position for current card
//     const columnIndex = cardsAdded % 2;
//     const rowIndex = Math.floor(cardsAdded / 2);
//     const x = marginLeft + (columnIndex * (cardWidth + gutter));
//     const y = marginTop + (rowIndex * (cardHeight + gutter));

//     // Draw card border
//     doc.setDrawColor(0); // black
//     doc.setLineWidth(1);
//     doc.rect(x, y, cardWidth, cardHeight); // Draw card border

//     // Draw "Identity Card" text
//     doc.setFontSize(8);
//     doc.text('Identity Card', x + cardWidth / 2, y + 3, null, null, 'center');

//     // Left column
//     doc.setFontSize(6);
//     doc.text(`GENERAL LOK SABHA ELECTION- 2024`, x + 2, y + 7);
//     doc.text(`Deployed for election duty: ${user.kushang}`, x + 2, y + 12);
//     doc.text(`Name of AC/PC: ${allDistrict[user.district]}`, x + 2, y + 17);
//     doc.text(`Name: ${user.name}`, x + 2, y + 22);
//     doc.text(`Age: ${user.age}`, x + 2, y + 27);
//     doc.text(`Name of Sponsoring Deptt: District Election Office`, x + 2, y + 32);
//     doc.text(`Designation of Sponsoring Authority: DEO`, x + 2, y + 37);
//     doc.text(`Designation: ${user.designation}`, x + 2, y + 42);
//     doc.text(`Mobile Number: ${user.phone}`, x + 2, y + 47);
//     doc.text(`Blood Group: ${user.bloodGroup}`, x + 2, y + 52);

//     // Right column
//     const imageX = x + cardWidth - 40; // Adjusted X coordinate for image
//     const imageY = y + 7; // Adjusted Y coordinate for image
//     const imageWidth = 25; // Adjusted width of image
//     const imageHeight = 25; // Adjusted height of image

//     doc.setDrawColor(0); // black
//     doc.setLineWidth(1);
//     doc.rect(imageX, imageY, imageWidth, imageHeight); // Add border exactly around the image
//     doc.addImage(user.profilePhoto, 'JPEG', imageX, imageY, imageWidth, imageHeight);

//     // Signature field
//     doc.setFontSize(6);
//     const signatureX = x + cardWidth - 2;
//     const signatureY = y + cardHeight - 2; // Bottom right corner
//     doc.text('..........................................', signatureX - 25, signatureY - 6, null, null, 'right');
//     doc.text('(Signature & seal of DEO)', signatureX - 25, signatureY - 2, null, null, 'right');

//     // Increment cardsAdded counter
//     cardsAdded++;

//     // Check if maximum cards per page is reached or if it's the last user
//     if (cardsAdded === maxCardsPerPage || index === userList.length - 1) {
//       // Add a new page if maximum cards per page is reached or it's the last user
//       if (index !== userList.length - 1) {
//         doc.addPage({ orientation: 'landscape', unit: 'mm', format: 'a4' });
//       }
//       // Reset cardsAdded counter for the new page
//       cardsAdded = 0;
//     }
//   });

//   // Save PDF
//   doc.save('bulk_id_cards.pdf');
// };
const generatePDF = (userList) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    doc.addFileToVFS('Tinos-Regular.ttf', 'Roboto-Regular');
    doc.addFont('Tinos-Bold.ttf', 'Roboto-Regular', 'normal');

    // Load the Roboto Bold font
    doc.addFileToVFS('Roboto-Bold.ttf', 'Roboto-Bold');
    doc.addFont('Roboto-Bold.ttf', 'Roboto-Bold', 'bold');


    const allDistrict = {
      AR: "07-Araria",
      PR: "12-Purnia",
      KN: "40-Kishanganj"
    }
  
    // Define constants for layout
    const cardWidth = 85.6; // CR80 standard width in mm
    const cardHeight = 58.98; // CR80 standard height in mm
    const marginLeft = 10;
    const marginTop = 10;
    const gutterX = 5; // Horizontal gap between cards
    const gutterY = 3; // Vertical gap between cards
    const maxCardsPerRow = 3; // Maximum number of cards per row
    const maxRowsPerPage = 3; // Maximum number of rows per page
    let cardsAdded = 0;
    let rowsAdded = 0;
  
    // Loop through each user and add their details to the PDF
    userList.forEach((user, index) => {
      // Calculate position for current card
      const columnIndex = cardsAdded % maxCardsPerRow;
      const rowIndex = rowsAdded % maxRowsPerPage;
      const x = marginLeft + (columnIndex * (cardWidth + gutterX));
      const y = marginTop + (rowIndex * (cardHeight + gutterY));
  
      // Draw card border
      doc.setDrawColor(0); // black
      doc.setLineWidth(1);
      doc.rect(x, y, cardWidth, cardHeight); // Draw card border
  
      // Draw "Identity Card" text
      doc.setFontSize(8);
      doc.setFont('Roboto-Bold');
      doc.text('Identity Card', x + cardWidth / 2, y + 5, null, null, 'center');
  
      // Left column
      doc.setFontSize(6);
      doc.setFont('Roboto-Bold');
      doc.text(`GENERAL LOK SABHA ELECTION- 2024`, x + 20, y + 9);
      doc.text(`Deployed for election duty: ${user.kusang}`, x + 2, y + 14);
      doc.text(`Name of AC/PC: ${allDistrict[user.district]}`, x + 2, y + 19);
      doc.text(`Name: ${user.name}`, x + 2, y + 24);
      doc.text(`Age: ${user.age}`, x + 2, y + 29);
      doc.text(`Name of Sponsoring Deptt: District Election Office`, x + 2, y + 34);
      doc.text(`Designation of Sponsoring Authority: DEO`, x + 2, y + 39);
      doc.text(`Designation: ${user.designation}`, x + 2, y + 44);
      doc.text(`Mobile Number: ${user.phone}`, x + 2, y + 49);
      doc.text(`Blood Group: ${user.bloodGroup}`, x + 2, y + 54);
  
      // Right column
      const imageX = x + cardWidth - 30; // Adjusted X coordinate for image
      const imageY = y + 12; // Adjusted Y coordinate for image
      const imageWidth = 22; // Adjusted width of image
      const imageHeight = 22; // Adjusted height of image
  
      doc.setDrawColor(0); // black
      doc.setLineWidth(1);
      doc.rect(imageX, imageY, imageWidth, imageHeight); // Add border exactly around the image
      doc.addImage(user.profilePhoto, 'JPEG', imageX, imageY, imageWidth, imageHeight);
  
      // Signature field
      doc.setFontSize(6);
      const signatureX = x + cardWidth - 2;
      const signatureY = y + cardHeight - 2; // Bottom right corner
      doc.text('..........................................', signatureX - 5, signatureY - 6, null, null, 'right');
      doc.text('(Signature & seal of DEO)', signatureX - 5, signatureY - 2, null, null, 'right');
  
      // Increment cardsAdded counter
      cardsAdded++;
  
      // Check if maximum cards per row is reached
      if (cardsAdded === maxCardsPerRow) {
        // Increment rowsAdded counter
        rowsAdded++;
        // Reset cardsAdded counter for the new row
        cardsAdded = 0;
      }
  
      // Check if maximum rows per page is reached or if it's the last user
      if ((rowsAdded === maxRowsPerPage && cardsAdded === 0) || index === userList.length - 1) {
        // Add a new page if maximum rows per page is reached or it's the last user
        if (index !== userList.length - 1) {
          doc.addPage({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        }
        // Reset rowsAdded counter for the new page
        rowsAdded = 0;
      }
    });
  
    // Save PDF
    doc.save('bulk_id_cards.pdf');
  };
  

const BulkPDFDownloadButton = ({ userList }) => {
  const handleDownload = () => {
    generatePDF(userList);
  };

  return (
    <button disabled={userList.length === 0} style={{backgroundColor:"#24553c"}} onClick={handleDownload}>Download {userList.length} PDFs</button>
  );
};

export default BulkPDFDownloadButton;
