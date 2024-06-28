import React, { useState, useEffect, useRef } from 'react';
import { auth, firestore, timestamp } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import './chat.css';
import FirebaseAuth from './Auth/firebaseAuth';
const Chat = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);

        // Fetch messages only after user is authenticated
        const q = query(collection(firestore, 'messages'), orderBy('createdAt'));
        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
          const fetchedMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(fetchedMessages);
          scrollToBottom(); // Scroll to bottom on initial load
        });

        return () => {
          unsubscribeMessages();
        };
      } else {
        setUser(null);
        setMessages([]); // Clear messages when user logs out
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);
  useEffect(() => {
  console.log("useEffect - messages updated:", messages);
  scrollToBottom(); // Ensure this is called whenever messages update
}, [messages]);


  const sendMessage = async () => {
    if (message.trim() !== '' && user) {
      await addDoc(collection(firestore, 'messages'), {
        text: message,
        createdAt: timestamp(),
        uid: user.uid,
        displayName: user.displayName
      });
      setMessage('');
      scrollToBottom();
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
              onKeyDown={handleKeyPress}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Chat;
