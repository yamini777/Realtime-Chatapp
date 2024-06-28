import React, { useState, useEffect, useRef  } from 'react';
import { auth, firestore, timestamp } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import './chat.css';
import FirebaseAuth from './Auth/firebaseAuth'; 

const Chat = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      };
    const q = query(collection(firestore, 'messages'), orderBy('createdAt'));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messages);
      scrollToBottom();
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim() !== '') {
      await addDoc(collection(firestore, 'messages'), {
        text: message,
        createdAt: timestamp(),
        uid: user.uid,
        displayName: user.displayName
      });
      setMessage('');
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };
 
  return (
    <div className="chat-container">
          <div className="chat-header">
            {/* <img src={companyLogo} alt="Company Logo" style={{width:"250px"}} /> */}
          </div>
          <FirebaseAuth /> 
          {user && (
          <React.Fragment>
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.uid === user.uid ? 'sent' : 'received'}`}>
                <div className={`message-content ${msg.uid === user.uid ? 'sent' : 'received'}`}>
                  <span>{msg.displayName}</span>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown ={handleKeyPress}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Chat;
