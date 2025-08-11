import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home.jsx";
import ReportCrime from "./pages/Crime Reports/ReportCrime.jsx";
import AllCrimeReports from "./pages/Crime Reports/AllCrimeReports.jsx";
import CrimeDetails from "./pages/Crime Reports/CrimeDetails.jsx";
import CrimeEdit from "./pages/Crime Reports/CrimeEdit.jsx";
import Login from "./pages/SignUp-SignIn/Login.jsx";
import Register from "./pages/SignUp-SignIn/Register.jsx";
import Error from "./pages/Error.jsx";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ViewProfile from "./pages/UserProfile/ViewProfile.jsx";
import EditProfile from "./pages/UserProfile/EditProfile.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportCrime />
              </ProtectedRoute>
            }
          />
          <Route path="/allreports" element={<AllCrimeReports />} />

          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <ViewProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/crime/:id" element={<CrimeDetails />} />
          <Route
            path="/crime/:id/edit"
            element={
              <ProtectedRoute>
                <CrimeEdit />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
      <Toaster position="top-center" />
    </Router>
  );
}

export default App;
