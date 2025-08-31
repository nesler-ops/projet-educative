import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/dashboard.css";

interface Contenu {
  id: number;
  titre: string;
  description: string;
  type: string;
  difficulte: string;
  lien: string;
  niveau: string;
  slug: string;
}

export default function ContenusParMatiere() {
  const { matiere } = useParams();
  const [contenus, setContenus] = useState<Contenu[]>([]);

  useEffect(() => {
    const fetchContenus = async () => {
      try {
        const res = await api.get(`/contenus?matiere=${matiere}`);
        setContenus(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des contenus", error);
      }
    };

    fetchContenus();
  }, [matiere]);

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Contenus de {matiere} 📘
      </h2>

      <div className="grid-cours">
        {contenus.map((contenu) => (
          <div className="card-cours" key={contenu.id}>
            <div className="header">
              <span className="icone">📚</span>
              <h3>{contenu.titre}</h3>
            </div>

            <p
              style={{
                fontSize: "0.9rem",
                color: "#444",
                marginBottom: "0.5rem",
              }}
            >
              {contenu.description}
            </p>

            <p style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
              🔸 Difficulté : <strong>{contenu.difficulte}</strong>
            </p>

            <a
              className="btn-green"
              href={`http://localhost:8000/contenus/${matiere}/${contenu.niveau}/${contenu.slug}`}
            >
              Commencer
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
