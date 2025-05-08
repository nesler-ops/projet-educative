// src/pages/ContenuDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/dashboard.css";

interface Contenu {
  titre: string;
  description: string;
  type: string;
  difficulte: string;
  matiere: string;
  slug: string;
  lien?: string;
  contenu_html?: string;
}

export default function ContenuDetail() {
  const { slug, matiere } = useParams();
  const [contenu, setContenu] = useState<Contenu | null>(null);

  useEffect(() => {
    const fetchContenu = async () => {
      try {
        const res = await api.get(`/contenus/${slug}`);
        setContenu(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement du contenu", error);
      }
    };

    fetchContenu();
  }, [slug]);

  if (!contenu) {
    return <p className="container">Chargement du contenu...</p>;
  }

  return (
    <div style={{ maxWidth: "100%", margin: "2rem auto", padding: "2rem" }}>
      <Link
        to={`/cours/${matiere}`}
        className="btn btn-sm btn-outline-secondary mb-3"
      >
        ← Retour aux contenus
      </Link>

      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>{contenu.titre}</h2>
        <p>
          <strong>Difficulté :</strong> {contenu.difficulte}
        </p>
        <p>
          <strong>Type :</strong> {contenu.type}
        </p>

        {/* 🔍 HTML pédagogique si disponible */}
        {contenu.contenu_html && (
          <div
            style={{
              marginTop: "2rem",
              lineHeight: "1.8",
              fontSize: "1.1rem",
            }}
            dangerouslySetInnerHTML={{ __html: contenu.contenu_html }}
          />
        )}

        {/* 🎥 Vidéo embarquée */}
        {contenu.type === "vidéo" && contenu.lien && (
          <div style={{ marginTop: "2rem" }}>
            <p>
              <strong>Vidéo explicative :</strong>
            </p>
            <iframe
              width="100%"
              height="350"
              src={contenu.lien}
              title="Vidéo pédagogique"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* 📎 Lien complémentaire */}
        {contenu.type === "texte" && contenu.lien && (
          <p style={{ marginTop: "1.5rem" }}>
            Pour en savoir plus :{" "}
            <a href={contenu.lien} target="_blank" rel="noreferrer">
              Ressource complémentaire
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
