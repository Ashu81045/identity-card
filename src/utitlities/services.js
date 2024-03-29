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

// Function to update specific document in Firestore
export async function updateDocument(docId, newData) {
  const firestore = initializeFirestore();
  const docRef = doc(firestore, "identity", docId);
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
