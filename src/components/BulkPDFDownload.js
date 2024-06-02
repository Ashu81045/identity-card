import React from "react";
import { jsPDF } from "jspdf";

// Import the watermark image
import watermarkImage from "../assets/EC.png";
import { capitalizeFirstLetter } from "../utitlities/utility";

const generatePDF = (userList) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.addFileToVFS("Tinos-Regular.ttf", "Roboto-Regular");
  doc.addFont("Tinos-Bold.ttf", "Roboto-Regular", "normal");
  // Load the Roboto Bold font
  doc.addFileToVFS("Roboto-Bold.ttf", "Roboto-Bold");
  doc.addFont("Roboto-Bold.ttf", "Roboto-Bold", "bold");

  const allDistrict = {
    AR: "09-Araria",
    PR: "12-Purnia",
    KN: "10-Kishanganj",
  };

  // Import the watermark image
  const watermark = new Image();
  watermark.src = watermarkImage;
  console.log(watermark, watermarkImage, "LTS");

  // Define constants for layout
  const cardWidth = 85.6; // CR80 standard width in mm
  const cardHeight = 62.98; // CR80 standard height in mm
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
    const x = marginLeft + columnIndex * (cardWidth + gutterX);
    const y = marginTop + rowIndex * (cardHeight + gutterY);

    // Draw card border

    //doc.setFillColor(173, 216, 230); // Light blue background color
    doc.setDrawColor(0); // black
    doc.setLineWidth(0.5);
    doc.rect(x, y, cardWidth, cardHeight); // Draw card border with background color
    // Draw background rectangle for "Identity Card" text
    const identityCardWidth = 85.6; // Adjust the width as needed
    const identityCardHeight = 15; // Adjust the height as needed
    const rectangleX = x + (cardWidth - identityCardWidth) / 2;
    const rectangleY = y;

    // Draw rectangle with orange background color
    doc.setFillColor(36, 85, 60); // Orange background color
    doc.rect(
      rectangleX,
      rectangleY,
      identityCardWidth,
      identityCardHeight,
      "F"
    ); // Draw rectangle with background color

    // Draw "Identity Card" text in white color
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.setTextColor(255); // White font color
    if (user.district !== "KN") {
      //doc.addImage(watermarkEC, 'PNG', x + 20, y + 15, 40, 40, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    }
    if (user.district !== "KN") {
      doc.setFontSize(9);
      doc.setTextColor(255);
      doc.text(
        `IDENTITY CARD - ${user.uniqueID.toUpperCase()}`,
        rectangleX + identityCardWidth / 2,
        rectangleY + 6,
        null,
        null,
        "center"
      );
    } else {
      doc.text(
        "Identity Card",
        rectangleX + identityCardWidth / 2,
        rectangleY + 6,
        null,
        null,
        "center"
      );
    }
    doc.addImage(
      watermarkImage,
      "PNG",
      x,
      y + 2,
      10,
      10,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.setTextColor(255);
    doc.textWithLink(`LOK SABHA GENERAL ELECTION - 2024`, x + 13, y + 11, {
      url: "",
    });
    // Left column

    doc.setTextColor(0, 0, 128);
    doc.setFontSize(10);
    if (user.district === "KN") {
      doc.setTextColor(255, 0, 0);
      doc.text(
        `ID No.: ${user.uniqueID.toUpperCase()}`,
        x + cardWidth / 2,
        y + 19,
        null,
        null,
        "center"
      );
      doc.setFontSize(7);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text(`Name: ${user.name.toUpperCase()}`, x + 2, y + 24);
      doc.text(
        `Designation: ${capitalizeFirstLetter(user.designation)}`,
        x + 2,
        y + 29
      );
      doc.text(
        `Deployed for election duty: ${capitalizeFirstLetter(user.kusang)}`,
        x + 2,
        y + 34
      );
      doc.text(`Mobile Number: ${user.phone}`, x + 2, y + 44);
      doc.text(`Blood Group: ${user.bloodGroup}`, x + 2, y + 39);
      doc.text(`Valid Up to: 04.06.2024`, x + 2, y + 49);
    } else {
      doc.text(
        `${user.name.toUpperCase()}`,
        x + cardWidth / 2,
        y + 19,
        null,
        null,
        "center"
      );
      doc.setFontSize(6);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "normal");
      doc.setTextColor(0, 0, 0); // Set text color to black
      doc.text("Deployed for election duty:", x + 2, y + 24);
      doc.text("Name of AC/PC:", x + 2, y + 28);
      doc.text("Age:", x + 2, y + 32);
      doc.text("Name of Sponsoring Deptt:", x + 2, y + 36);
      doc.text("Design. of Sponsg. Authority:", x + 2, y + 40);
      doc.text("Designation:", x + 2, y + 44);
      doc.text("Mobile Number:", x + 2, y + 48);
      doc.text("Blood Group:", x + 2, y + 52);
      doc.text("Valid upto:", x + 2, y + 56);
      doc.setFont(undefined, "bold");
      doc.setTextColor(0, 0, 128); // Set text color to red (for example)
      doc.text(user.kusang, x + 35, y + 24);
      doc.text(allDistrict[user.district], x + 35, y + 28);
      doc.text(user.age, x + 35, y + 32);
      doc.text("ECI", x + 35, y + 36);
      if (user.district === "PR") {
        doc.text("DEO-CUM-DM, Purnia", x + 35, y + 40);
        doc.text("04.06.2024", x + 35, y + 56);
      }else {
        doc.text("DEO-CUM-DM, Araria", x + 35, y + 40);
        doc.text("04.06.2024", x + 35, y + 56);
      }
      doc.text(user.designation, x + 35, y + 44);
      doc.text(user.phone, x + 35, y + 48);
      doc.text(user.bloodGroup, x + 35, y + 52);
      
    }

    // Right column
    const imageX = x + cardWidth - 18; // Adjusted X coordinate for image
    const imageY = y + 26; // Adjusted Y coordinate for image
    const imageWidth = 16; // Adjusted width of image
    const imageHeight = 16; // Adjusted height of image

    doc.setDrawColor(0); // black
    doc.setLineWidth(1);
    doc.rect(imageX, imageY, imageWidth, imageHeight); // Add border exactly around the image
    doc.addImage(
      user.profilePhoto,
      "JPEG",
      imageX,
      imageY,
      imageWidth,
      imageHeight
    );

    // Signature field
    doc.setFontSize(6);
    const signatureX = x + cardWidth - 2;
    const signatureY = y + cardHeight - 2; // Bottom right corner
    if (user.district === "KN") {
      doc.text(
        "..........................................",
        signatureX - 2,
        signatureY - 2,
        null,
        null,
        "right"
      );
      doc.text(
        "(Auth. Signature & seal)",
        signatureX - 2,
        signatureY,
        null,
        null,
        "right"
      );
      const signatureXLeft = x + 2; // Adjusted X coordinate for left signature
      doc.text(
        "..........................................",
        signatureXLeft,
        signatureY - 2,
        null,
        null,
        "left"
      );
      doc.text(
        "(Card Holder Signature)",
        signatureXLeft,
        signatureY,
        null,
        null,
        "left"
      );
    } else {
      doc.text(
        "..........................................",
        signatureX - 2,
        signatureY - 2,
        null,
        null,
        "right"
      );
      doc.setFontSize(6);
      doc.text(
        "Authorised to issue",
        signatureX - 6,
        signatureY,
        null,
        null,
        "right"
      );
    }

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
    if (
      (rowsAdded === maxRowsPerPage && cardsAdded === 0) ||
      index === userList.length - 1
    ) {
      // Add a new page if maximum rows per page is reached or it's the last user
      if (index !== userList.length - 1) {
        doc.addPage({ orientation: "landscape", unit: "mm", format: "a4" });
      }
      // Reset rowsAdded counter for the new page
      rowsAdded = 0;
    }
  });

  // Save PDF
  doc.save("bulk_id_cards.pdf");
};

const BulkPDFDownloadButton = ({ userList }) => {
  const handleDownload = () => {
    generatePDF(userList);
  };

  return (
    <button
      disabled={userList.length === 0}
      style={{ backgroundColor: "#24553c" }}
      onClick={handleDownload}
    >
      Download {userList.length} PDFs
    </button>
  );
};

export default BulkPDFDownloadButton;
