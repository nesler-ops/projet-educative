// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ZorinWidget from "./components/ZorinWidget";
import DashboardEtudiant from "./pages/DashboardEtudiant";
import DashboardAdmin from "./pages/DashboardAdmin";
import ContenusParMatiere from "./pages/ContenusParMatiere";
import ContenuDetail from "./pages/ContenuDetail";
import TwoFAVerification from "./pages/TwoFAVerification";
import EnrollFace from "./pages/EnrollFace";
import Chatbox from "./pages/Chatbox";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/twofa" element={<TwoFAVerification />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Dashboard />
              <ZorinWidget />
            </>
          }
        />
        <Route path="/cours/:matiere" element={<ContenusParMatiere />} />
        <Route path="/cours/:matiere/:slug" element={<ContenuDetail />} />

        {/* privadas */}
        <Route
          path="/dashboard/etudiant"
          element={
            <ProtectedRoute>
              <DashboardEtudiant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enroll-face"
          element={
            <ProtectedRoute>
              <EnrollFace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbox"
          element={
            <ProtectedRoute>
              <Chatbox />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<div style={{ padding: 20 }}>404 (App.tsx)</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
