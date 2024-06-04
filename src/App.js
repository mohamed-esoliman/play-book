import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Footer from "./components/Footer";
import { getGames, getGameDetails } from './services/apiService';



function App() {
  
  const [games, setGames] = useState([]);
  
  
  useEffect(() => {
    let mounted = true;
    if (mounted){
      getGames(40).then((res) => {
        setGames(res);
      });
    }

    return () => mounted = false;
  }, []);

  const resp = getGameDetails(1942);
  console.log("game details: ", resp);

  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home gameList = {games}/>} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
