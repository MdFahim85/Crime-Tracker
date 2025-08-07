import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home.jsx";
import ReportCrime from "./pages/ReportCrime";
import CrimeReports from "./pages/CrimeReports";
import CrimeDetails from "./pages/CrimeDetails";
import CrimeEdit from "./pages/CrimeEdit";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportCrime />} />
          <Route path="/my-reports" element={<CrimeReports />} />
          <Route path="/crime/:id" element={<CrimeDetails />} />
          <Route path="/crime/:id/edit" element={<CrimeEdit />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
