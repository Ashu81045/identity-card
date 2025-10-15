import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
import HomeLayout from './Layout/HomeLayout';
import TrackPage from './pages/TrackPage';
import AdminPage from './pages/AdminPage';
import ContactPage from './pages/ContactPage';
import VidhanHomeLayout from './pages/VidhanHomeLayout';
import MultiLayout from './Layout/MultiLayout';
// import NoService from './pages/NoService';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        {/* <Route path="/" element={<NoService />} /> */}
          <Route path="/" element={<MultiLayout />} /> 
          <Route path="/track" element={<TrackPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/contact" element={<ContactPage />}/>
          <Route path="/vidhan-sabha" element={<VidhanHomeLayout />} />
          <Route path="/lok-sabha" element={<HomeLayout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
