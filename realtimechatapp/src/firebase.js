import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCHHaYgKQCVjWy-lGgP1-lmsv2FjYNwwmE",
  authDomain: "chatapp-79733.firebaseapp.com",
  databaseURL: "https://chatapp-79733-default-rtdb.firebaseio.com",
  projectId: "chatapp-79733",
  storageBucket: "chatapp-79733.appspot.com",
  messagingSenderId: "186726327076",
  appId: "1:186726327076:web:cf2bcb2f0a0a8e83ec09b1"
};


  const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const timestamp = serverTimestamp;
export default app;