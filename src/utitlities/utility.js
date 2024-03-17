export  function generateRandomID (districtCode){
    // Get today's date in the format YYMMDD
    const today = new Date();
    const year = String(today.getFullYear()).substring(2);
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}${month}${day}`;
  
    // Generate a random number between 1000 and 9999
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
  
    return `${districtCode}${currentDate}${randomNum}`;
  }
  export function isNotEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
}
  
export const extractDate = (str) => {
  // Use regular expression to match the date portion (YYMMDD)
  const match = str.match(/\d{6}/);
  if (match) {
      const dateStr = match[0];
      // Extract year, month, and day from the date string
      const year = parseInt(dateStr.substring(0, 2)) + 2000; // Assuming year 2000 onwards
      const month = parseInt(dateStr.substring(2, 4));
      const day = parseInt(dateStr.substring(4, 6));
      // Return the extracted date
      return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date object
  } else {
      return null; // Return null if date portion is not found
  }
};


  