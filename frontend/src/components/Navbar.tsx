import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css"; // Asegúrate de importar el CSS

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          EduPlatform
        </Link>
      </div>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <button className="btn-logout" onClick={handleLogout}>
          Se déconnecter
        </button>
      </nav>
    </div>
  );
}
