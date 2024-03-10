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
  
  // Example usage:
  console.log(generateRandomID('PR')); // Example output: PR23080568
  