import React, { useState } from "react";
import { jsPDF } from "jspdf";
import watermarkImage from "../assets/EC.png";

const generatePDF = (userList) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const cityOptions = {
    AR: "Araria",
    PR: "Purnia",
    KN: "Kishanganj",
    MP: "Madhepura",
  };

  const cardWidth = 79;
  const cardHeight = 126;
  const marginLeft = 18;
  const marginTop = 15;
  const gutterX = 10;
  const gutterY = 10;
  const maxCardsPerRow = 2;
  const maxCardsPerPage = 4;

  userList.forEach((user, index) => {
    if (index > 0 && index % maxCardsPerPage === 0) doc.addPage();

    const cardIndexOnPage = index % maxCardsPerPage;
    const columnIndex = cardIndexOnPage % maxCardsPerRow;
    const rowIndex = Math.floor(cardIndexOnPage / maxCardsPerRow);
    const x = marginLeft + columnIndex * (cardWidth + gutterX);
    const y = marginTop + rowIndex * (cardHeight + gutterY);

    // Card border
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.5);
    doc.rect(x, y, cardWidth, cardHeight);

    // Corner decoration
    const cornerSize = 3;
    doc.setLineWidth(0.4);
    doc.setDrawColor(29, 78, 216);
    doc.line(x, y, x + cornerSize, y);
    doc.line(x, y, x, y + cornerSize);
    doc.line(x + cardWidth - cornerSize, y, x + cardWidth, y);
    doc.line(x + cardWidth, y, x + cardWidth, y + cornerSize);
    doc.line(x, y + cardHeight - cornerSize, x, y + cardHeight);
    doc.line(x, y + cardHeight, x + cornerSize, y + cardHeight);
    doc.line(x + cardWidth - cornerSize, y + cardHeight, x + cardWidth, y + cardHeight);
    doc.line(x + cardWidth, y + cardHeight - cornerSize, x + cardWidth, y + cardHeight);

    // Logos at top
    const logoSize = 12;
    const logoY = y + 4;
    doc.addImage(watermarkImage, "PNG", x + 4, logoY, logoSize, logoSize);
    doc.addImage(watermarkImage, "PNG", x + cardWidth - logoSize - 4, logoY, logoSize, logoSize);

    // Header text
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(30, 64, 175);
    doc.text("BIHAR ASSEMBLY", x + cardWidth / 2, logoY + 5, { align: "center" });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("General Election 2025", x + cardWidth / 2, logoY + 9, { align: "center" });

    // Identity Card badge
    const badgeWidth = 32;
    const badgeHeight = 5;
    const badgeX = x + (cardWidth - badgeWidth) / 2;
    const badgeY = logoY + 13;
    doc.setFillColor(29, 78, 216);
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, "F");

    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text("IDENTITY CARD", x + cardWidth / 2, badgeY + 3.5, { align: "center" });

    // District text
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(`District: ${cityOptions[user.district] || "Kishanganj"}`, x + cardWidth / 2, badgeY + 8, {
      align: "center",
      fontStyle: "italic",
    });

    // Photo - larger
    const photoWidth = 40;
    const photoHeight = 48;
    const photoX = x + (cardWidth - photoWidth) / 2;
    const photoY = badgeY + 14;
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.rect(photoX, photoY, photoWidth, photoHeight);

    if (user.profilePhoto) {
      doc.addImage(user.profilePhoto, "JPEG", photoX, photoY, photoWidth, photoHeight);
    } else {
      doc.setFillColor(240, 240, 240);
      doc.rect(photoX, photoY, photoWidth, photoHeight, "F");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("PHOTO", photoX + photoWidth / 2, photoY + photoHeight / 2, { align: "center" });
    }

    // Details section - more spacious
    const detailsY = photoY + photoHeight + 8;
    const labelWidth = 26;
    const valueX = x + labelWidth + 3;
    const lineHeight = 6;

    const details = [
      { label: "NAME:", value: user.name || "N/A" },
      { label: "DESIGNATION:", value: user.designation || "N/A" },
      { label: "DEPT. ELE. DUTY:", value: user.kusang || user.department || "N/A" },
      { label: "MOBILE:", value: user.phone || user.mobile || "N/A" },
    ];

    details.forEach((detail, idx) => {
      const currentY = detailsY + idx * lineHeight;

      doc.setFontSize(8);
      doc.setFont(undefined, "bold");
      doc.setTextColor(29, 78, 216);
      doc.text(detail.label, x + 2, currentY);

      doc.setFillColor(249, 250, 251);
      doc.roundedRect(valueX - 1, currentY - 3.5, cardWidth - labelWidth - 5, 5.5, 1, 1, "F");

      doc.setDrawColor(29, 78, 216);
      doc.setLineWidth(0.5);
      doc.line(valueX - 1, currentY - 3.5, valueX - 1, currentY + 2);

      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.setTextColor(0, 0, 0);

      const maxWidth = cardWidth - labelWidth - 8;
      doc.text(detail.value, valueX + 1, currentY, { maxWidth });
    });

    // Signature section - adjusted to stay inside card
    const bottomPadding = 8;
    const sigLineLength = 30;
    // const sigLineSpacing = 4;

// Position line a little above the bottom of card
let sigLineY = Math.min(detailsY + details.length * lineHeight + 10, y + cardHeight - bottomPadding);

// X positions
const sigLeftX = x + 4;
const sigRightX = x + cardWidth - 32;

// Draw the line
doc.setDrawColor(100, 100, 100);
doc.setLineWidth(0.4);
doc.line(sigLeftX, sigLineY, sigLeftX + sigLineLength, sigLineY);
doc.line(sigRightX, sigLineY, sigRightX + sigLineLength, sigLineY);

// Draw labels **below the line**
doc.setFontSize(6);
doc.setFont(undefined, "bold");
doc.setTextColor(80, 80, 80);

// Left signature
doc.text("Card Holder", sigLeftX, sigLineY + 3);
doc.text("Signature", sigLeftX, sigLineY + 6);

// Right signature
doc.text("Issuing", sigRightX + sigLineLength / 2, sigLineY + 3, { align: "center" });
doc.text("Authority", sigRightX + sigLineLength / 2, sigLineY + 6, { align: "center" });

  });

  doc.save(`bihar_election_id_cards_${userList.length}_cards.pdf`);
};

// === PreviewModal ===
const PreviewModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        maxWidth: "90%",
        maxHeight: "90%",
        overflow: "auto"
      }}>
        <div style={{ marginBottom: "20px", textAlign: "right" }}>
          <button onClick={onClose} style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}>Close Preview</button>
        </div>

        <div style={{
          width: '79mm',
          height: '126mm',
          border: '2px solid #1e40af',
          borderRadius: '8px',
          padding: '10px',
          backgroundColor: '#fafafa',
          margin: '0 auto'
        }}>
          {/* Optional: replicate PDF layout for HTML preview */}
        </div>
      </div>
    </div>
  );
};

const BulkPDFDownloadButton = ({ userList }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = () => generatePDF(userList);
  const handlePreview = () => setShowPreview(true);
  const closePreview = () => setShowPreview(false);

  return (
    <>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button disabled={userList.length === 0} style={{
          backgroundColor: "#16a34a",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: userList.length === 0 ? "not-allowed" : "pointer",
          fontWeight: "bold"
        }} onClick={handlePreview}>
          Preview Single Card
        </button>

        <button disabled={userList.length === 0} style={{
          backgroundColor: "#1e40af",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: userList.length === 0 ? "not-allowed" : "pointer",
          fontWeight: "bold"
        }} onClick={handleDownload}>
          Download {userList.length} ID Cards as PDF
        </button>
      </div>

      {showPreview && <PreviewModal user={userList[0]} onClose={closePreview} />}
    </>
  );
};

export default BulkPDFDownloadButton;
