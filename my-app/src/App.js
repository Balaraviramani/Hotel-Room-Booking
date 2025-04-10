import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homescreen from './screens/Homescreen';
import Bookingscreen from './screens/Bookingscreen';
import Registerscreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';
import Success from './screens/Success';
import Profilescreen from './screens/Profilescreen';
import Adminscreen from './screens/Adminscreen';
import Landingscreen from './screens/Landingscreen';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        
        <Route path="/home" element={<Homescreen />} />
        <Route path="/book/:roomid" element={<Bookingscreen />} />
        <Route path="/success" element={<Success/>} />
        <Route path="/register" element={<Registerscreen />} />
        <Route path="/login" element={<Loginscreen />} />
        <Route path="/profile" element={<Profilescreen />} />
        <Route path="/admin" element={<Adminscreen />} />
        <Route path="/" element={<Landingscreen />} />
      </Routes>
    </Router>
  );
}

export default App;

