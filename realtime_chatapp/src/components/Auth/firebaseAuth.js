import React, { useState, useEffect } from 'react';
import {  signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase';
import './firebaseAuth.css'


const ChatInterface = ({ user, signOut }) => (
  <div >
    <h3 >Welcome, {user.displayName || 'User'}</h3>
    <button onClick={signOut} className="sign-out-button">Sign Out</button>
  </div>
);

const FirebaseAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);


  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      {user ? (
        <ChatInterface user={user} signOut={signOut}  /> 
      ) : (
        <React.Fragment>
          <h1 style={{fontSize:'x-large', padding: '10px',margin: "10px 5px"}}>WELCOME TO THE REALTIME CHAT</h1>
          <button onClick={handleSignInWithGoogle} className="google-button">
            Sign in with Google
          </button>
        </React.Fragment>
      )}
    </div>
  );
};

export default FirebaseAuth;
