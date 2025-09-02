// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function PublicDashboard() {
  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 800 }}>
        <h2 style={{ textAlign: "center", marginBottom: 12 }}>
          Bienvenue sur votre tableau de bord 🧭
        </h2>
        <p style={{ color: "#555", marginBottom: 16, textAlign: "center" }}>
          Connectez-vous pour voir votre progression personnelle et vos cours.
        </p>

        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          }}
        >
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ marginBottom: 8 }}>Cours populaires</h3>
            <ul style={{ color: "#555", lineHeight: 1.7 }}>
              <li>Français: Grammaire essentielle</li>
              <li>Mathématiques: Algèbre I</li>
              <li>Sciences: Méthode scientifique</li>
            </ul>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ marginBottom: 8 }}>Pourquoi créer un compte ?</h3>
            <ul style={{ color: "#555", lineHeight: 1.7 }}>
              <li>Suivi de progression</li>
              <li>Défis et badges</li>
              <li>Recommandations personnalisées</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [status, setStatus] = useState<"checking" | "public">("checking");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token → dashboard público
    if (!token) {
      setStatus("public");
      return;
    }

    // Hay token: intentamos /auth/me y redirigimos por rol si sale bien.
    (async () => {
      try {
        const { data } = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch {
        // Token inválido/expirado → mostramos versión pública
        setStatus("public");
      }
    })();
  }, []);

  useEffect(() => {
    if (!user) return;

    // El backend devuelve normalmente user_type; por compatibilidad, caemos a type si existe
    const role = user.user_type || user.type;

    if (role === "etudiant") {
      navigate("/dashboard/etudiant", { replace: true });
    } else if (role === "admin") {
      navigate("/dashboard/admin", { replace: true });
    } else {
      // Si por alguna razón no hay rol válido, dejamos público
      setStatus("public");
    }
  }, [user, navigate]);

  // Mientras comprobamos el token por primera vez
  if (status === "checking" && !user) {
    return <p className="container">Chargement...</p>;
  }

  // Si no hay sesión o token inválido → público
  return <PublicDashboard />;
}
