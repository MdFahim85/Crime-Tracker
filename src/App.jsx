import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home.jsx";
import ReportCrime from "./pages/ReportCrime";
import AllCrimeReports from "./pages/AllCrimeReports";
import MyCrimeReports from "./pages/MyCrimeReports.jsx";
import CrimeDetails from "./pages/CrimeDetails";
import CrimeEdit from "./pages/CrimeEdit";
import Login from "./components/Login.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<ReportCrime />} />
          <Route path="/allreports" element={<AllCrimeReports />} />
          <Route path="/my-reports" element={<MyCrimeReports />} />
          <Route path="/crime/:id" element={<CrimeDetails />} />
          <Route path="/crime/:id/edit" element={<CrimeEdit />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
