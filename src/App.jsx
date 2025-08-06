import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home.jsx";
import ReportCrime from "./pages/ReportCrime";

function App() {
  const handleLogout = () => {
    console.log("Logged out");
  };

  return (
    <Router>
      <Navbar onLogout={handleLogout} />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportCrime />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
