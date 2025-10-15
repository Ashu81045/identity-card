// firebaseServices.js

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  setDoc,
  getDoc
} from "firebase/firestore";
import app from "../firebase";
import { convertWithDelimiter } from "./utility";
// Function to initialize Firestore
function initializeFirestore() {
  // Return the Firestore instance
  return getFirestore(app);
}

// Function to save form data to Firestores
export async function saveFormData(formData) {
  const firestore = initializeFirestore();
  try {
    const docRef = await addDoc(collection(firestore, "identity"), formData);
    console.log("Document written with ID: ", docRef);
    return formData.uniqueID;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}
export async function saveFormDataBS(formData) {
  const firestore = initializeFirestore();
  try {
    const docRef = await addDoc(collection(firestore, "identity-bs"), formData);
    console.log("Document written with ID: ", docRef);
    return formData.uniqueID;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

export async function addUpdateDistrict(district) {
  const firestore = initializeFirestore();
  try {
    // Convert the district name to lowercase
    const lowercaseDistrictName = district.district.toLowerCase();

    // Check if the district already exists
    const districtQuery = query(
      collection(firestore, "district"), 
      where("lowercaseDistrict", "==", lowercaseDistrictName)
    );
    const querySnapshot = await getDocs(districtQuery);
    if (!querySnapshot.empty) {
      // District already exists, return without adding
      console.log("District already exists.");
      return null;
    }

    // District does not exist, add it to Firestore
    const docRef = await addDoc(collection(firestore, "district"), {
      district: district.district,
      lowercaseDistrict: lowercaseDistrictName // Store lowercase version for case-insensitive queries
    });
    console.log("Document written with ID: ", docRef.id);
    return district;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}



// Function to save signature data to the "signature" collection
export async function saveSignatureData(district, kushang, signatureBase64) {
  const firestore = initializeFirestore();
  const signatureRef = doc(firestore, "signature", `${district}_${convertWithDelimiter(kushang,"_")}`);

  try {
    // Check if the signature already exists for the given district and kushang
    const snapshot = await getDoc(signatureRef);
    if (snapshot.exists()) {
      console.log(snapshot,"snapshot")
      // Update existing signature
      await updateDoc(signatureRef, { signature: signatureBase64 });
      console.log("Signature data updated successfully.");
    } else {
      // Add new signature
      await setDoc(signatureRef, {
        district,
        kushang,
        signature: signatureBase64,
      });
      console.log("New signature data added successfully.");
    }
  } catch (error) {
    console.error("Error saving signature data: ", error);
    throw error;
  }
}

// Function to retrieve all data from Firestore
export async function retrieveAllData() {
  const firestore = initializeFirestore();
  const querySnapshot = await getDocs(collection(firestore, "identity"));
  const dataArray = [];
  querySnapshot.forEach((doc) => {
    dataArray.push({ id: doc.id, ...doc.data() });
  });
  return dataArray;
}
export async function retrieveAllDataBs() {
  const firestore = initializeFirestore();
  const querySnapshot = await getDocs(collection(firestore, "identity-bs"));
  const dataArray = [];
  querySnapshot.forEach((doc) => {
    dataArray.push({ id: doc.id, ...doc.data() });
  });
  return dataArray;
}

// Function to update specific document in Firestore
export async function updateDocument(docId, newData, type) {
  const firestore = initializeFirestore();
  let docRef;
  if(type==='bs'){
     docRef = doc(firestore, "identity-bs", docId);
  }else{
    docRef = doc(firestore, "identity", docId);
  }
   
  try {
    const dataToUpdate = { approved: newData };
    await updateDoc(docRef, dataToUpdate);
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
}
export async function searchDocumentByPhoneNumber(phoneNumber) {
  const firestore = initializeFirestore();
  const identityCollection = collection(firestore, "identity");
  const q = query(identityCollection, where("phone", "==", phoneNumber));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Return the first matching document
      return querySnapshot.docs[0].data();
    } else {
      // If no matching documents found
      return null;
    }
  } catch (error) {
    console.error("Error searching document by phone number: ", error);
    throw error;
  }
}
// Method to add initial kushang options to Firestore
// export const addInitialKushangOptions = async (kushangOptions) => {
//   const firestore = initializeFirestore();
//   try {
//     const kushangOptionsRef = collection(firestore, 'kushangOptions');
//     await Promise.all(
//       kushangOptions.map(async (option) => {
//         await addDoc(kushangOptionsRef, option);
//       })
//     );
//     console.log('Initial kushang options added to Firestore');
//   } catch (error) {
//     console.error('Error adding initial kushang options: ', error);
//   }
// };
export const addInitialKushangOptions = async (kushangOptions) => {
  const firestore = initializeFirestore();
  try {
    const kushangOptionsRef = collection(firestore, 'kushangOptions');

    await Promise.all(
      kushangOptions.map(async (option) => {
        // Check if option already exists
        const optionQuery = query(kushangOptionsRef, where('value', '==', option.value));
        const querySnapshot = await getDocs(optionQuery);

        if (querySnapshot.empty) {
          // Option does not exist, add it to Firestore
          await addDoc(kushangOptionsRef, option);
        } else {
          // Option already exists, do not add it
          console.log(`Option "${option.value}" already exists in Firestore, skipping...`);
        }
      })
    );
    console.log('Initial kushang options added to Firestore');
  } catch (error) {
    console.error('Error adding initial kushang options: ', error);
  }
};

// Method to update kushang options in Firestore
export const updateKushangOptions = async (newKushangOptions) => {
  const firestore = initializeFirestore();
  try {
    const kushangOptionsRef = doc(firestore, 'kushangOptions', 'kushangOptionsId');
    await updateDoc(kushangOptionsRef, { options: newKushangOptions });
    console.log('Kushang options updated in Firestore');
  } catch (error) {
    console.error('Error updating kushang options: ', error);
  }
};

// Method to add initial district options to Firestore
export const addInitialDistrictOptions = async (districtOptions) => {
  const firestore = initializeFirestore();
  try {
    const districtOptionsRef = collection(firestore, 'districtOptions');
    await Promise.all(
      districtOptions.map(async (option) => {
        await addDoc(districtOptionsRef, option);
      })
    );
    console.log('Initial district options added to Firestore');
  } catch (error) {
    console.error('Error adding initial district options: ', error);
  }
};

// Method to update district options in Firestore
export const updateDistrictOptions = async (newDistrictOptions) => {
  const firestore = initializeFirestore();
  try {
    const districtOptionsRef = doc(firestore, 'districtOptions', 'districtOptionsId');
    await updateDoc(districtOptionsRef, { options: newDistrictOptions });
    console.log('District options updated in Firestore');
  } catch (error) {
    console.error('Error updating district options: ', error);
  }
};
