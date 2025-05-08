// src/pages/DashboardEtudiant.tsx
import "../styles/dashboard.css";
import { Link } from "react-router-dom";

export default function DashboardEtudiant() {
  const cours = [
    { nom: "Français", icone: "📘", progression: 50 },
    { nom: "Mathématiques", icone: "🔢", progression: 60 },
    { nom: "Sciences", icone: "🔬", progression: 25 },
  ];

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Vos cours 🎓
      </h2>

      <div className="grid-cours">
        {cours.map((c, i) => (
          <div className="card-cours" key={i}>
            <div className="header">
              <span className="icone">{c.icone}</span>
              <h3>{c.nom}</h3>
            </div>

            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${c.progression}%` }}
              >
                {c.progression}%
              </div>
            </div>

            <Link to={`/cours/${c.nom.toLowerCase()}`} className="btn-green">
              Continuer
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
