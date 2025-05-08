// src/pages/DashboardAdmin.tsx
export default function DashboardAdmin() {
  const actions = [
    {
      title: "📚 Gérer les contenus",
      description:
        "Ajouter, modifier et organiser les ressources pédagogiques.",
    },
    {
      title: "👨‍🎓 Gérer les étudiants",
      description:
        "Voir les profils, progression et performances des apprenants.",
    },
    {
      title: "🧪 Gérer les tests de niveau",
      description: "Créer ou revoir des évaluations pour chaque niveau.",
    },
    {
      title: "📊 Statistiques",
      description: "Consulter les données globales de la plateforme (bientôt).",
    },
  ];

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Tableau de bord administrateur 🛠️
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        {actions.map((action, i) => (
          <div
            key={i}
            style={{
              width: "250px",
              background: "#fff",
              borderRadius: "16px",
              padding: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>{action.title}</h4>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              {action.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
