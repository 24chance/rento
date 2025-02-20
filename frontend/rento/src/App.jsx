import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Authpage from './pages/Authpage';
import GoogleAuth from './comps/GoogleAuth';



function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Authpage />} />
        <Route path="/google-auth" element={<GoogleAuth />} />
      </Routes>
    </Router>
  );
}

export default App;
