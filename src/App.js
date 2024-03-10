import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
import HomeLayout from './Layout/HomeLayout';
import TrackPage from './pages/TrackPage';
import AdminPage from './pages/AdminPage';
import ContactPage from './pages/ContactPage';


function App() {
  return (
    <div className="App">
      <Router>
        {/* Use Routes component to define routes */}
        <Routes>
          {/* Use Route component to define individual routes */}
          <Route path="/" element={<HomeLayout />} /> {/* Use element prop instead of component */}
          <Route path="/track" element={<TrackPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
