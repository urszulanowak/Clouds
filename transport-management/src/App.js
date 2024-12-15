import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Contact from './pages/Contact';
import RoadTransport from './pages/RoadTransport';
import ShortestRoutes from './pages/ShortestRoutes';


<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
/>


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="logo">
            <img src="logo.png" alt="Logo" />
          </div>
          <nav className="nav-left">
            <Link to="/" className="nav-text">Strona główna</Link>
            <div className="nav-item">
            <Link to="/baza-miast" className="nav-text">Baza połączeń</Link>
            </div>
            <div className="nav-item">
            <Link to="/obliczanie-tras" className="nav-text">Obliczanie tras</Link>
            </div>
          </nav>
          <nav className="nav-right">
            <Link to="/kontakt" className="nav-text">Kontakt</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/baza-miast" element={<RoadTransport />} />
            <Route path="/obliczanie-tras" element={<ShortestRoutes/>} />
            <Route path="/kontakt" element={<Contact/>} />
          </Routes>
        </main>

        <footer>
          <p>© 2024 Transport Management</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
