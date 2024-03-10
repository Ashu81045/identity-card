// firebaseServices.js

import { getFirestore, collection, addDoc, getDocs, updateDoc, doc,query, where, } from 'firebase/firestore';
import app from '../firebase'; // Import the initialized Firebase app from firebase.js

// Function to initialize Firestore
function initializeFirestore() {
  // Return the Firestore instance
  return getFirestore(app);
}

// Function to save form data to Firestores
export async function saveFormData(formData) {
  const firestore = initializeFirestore();
  try {
    const docRef = await addDoc(collection(firestore, 'identity'), formData);
    console.log('Document written with ID: ', docRef);
    return formData.uniqueID;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
}

// Function to retrieve all data from Firestore
export async function retrieveAllData() {
  const firestore = initializeFirestore();
  const querySnapshot = await getDocs(collection(firestore, 'identity'));
  const dataArray = [];
  querySnapshot.forEach((doc) => {
    dataArray.push({ id: doc.id, ...doc.data() });
  });
  return dataArray;
}

// Function to update specific document in Firestore
export async function updateDocument(docId, newData) {
  const firestore = initializeFirestore();
  const docRef = doc(firestore, 'identity', docId);
  try {
    const dataToUpdate = { approved: newData}
    await updateDoc(docRef, dataToUpdate);
    console.log('Document updated successfully');
  } catch (error) {
    console.error('Error updating document: ', error);
    throw error;
  }
}
export async function searchDocumentByPhoneNumber(phoneNumber) {
  const firestore = initializeFirestore();
  const identityCollection = collection(firestore, 'identity');
  const q = query(identityCollection, where('phone', '==', phoneNumber));

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
    console.error('Error searching document by phone number: ', error);
    throw error;
  }
}
