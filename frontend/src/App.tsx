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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/etudiant" element={<DashboardEtudiant />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/cours/:matiere" element={<ContenusParMatiere />} />
        <Route path="/cours/:matiere/:slug" element={<ContenuDetail />} />

        {/* ✅ Ruta protegida */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
              <ZorinWidget />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
