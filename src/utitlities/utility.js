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
  if(!str){
    return null;
  }
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
// Function to read file as data URL
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
  });
};

// Function to compress image
export const compressImage = (imageDataUrl) => {
  return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate the new width and height to maintain aspect ratio
          const maxWidth = 800; // Maximum width
          const maxHeight = 600; // Maximum height
          let newWidth = image.width;
          let newHeight = image.height;
          if (newWidth > maxWidth) {
              newHeight *= maxWidth / newWidth;
              newWidth = maxWidth;
          }
          if (newHeight > maxHeight) {
              newWidth *= maxHeight / newHeight;
              newHeight = maxHeight;
          }

          // Resize the canvas
          canvas.width = newWidth;
          canvas.height = newHeight;

          // Draw the image on the canvas with the new dimensions
          ctx.drawImage(image, 0, 0, newWidth, newHeight);

          // Get the compressed image as a data URL
          const compressedImageDataUrl = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality as needed

          resolve(compressedImageDataUrl);
      };
      image.onerror = (error) => reject(error);
      image.src = imageDataUrl;
  });
};
export function convertWithDelimiter(inputString, delimiter) {
  // Split the input string into words
  const words = inputString.split(' ');

  // Convert each word to lowercase and join them with the delimiter
  const outputString = words.map(word => word.toLowerCase()).join(delimiter);

  return outputString;
}
export const capitalizeFirstLetter = (sentence) => {
 
  // Split the sentence into words
  let words = sentence.toLowerCase().split(" ");
  
  // Capitalize the first letter of each word
  for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  
  // Join the words back into a sentence
  let capitalizedSentence = words.join(" ");
  
  return capitalizedSentence;
}




  