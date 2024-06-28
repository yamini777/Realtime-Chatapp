import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Chat } from './components/chat';  
const App = () => {
  return (
      <div>
        <Routes>
          <Route path="/" element={<Chat />} />
        </Routes>
      </div>
    );
};

export default App;
