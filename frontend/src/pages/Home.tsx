import { Link } from "react-router-dom";
import ZorinWidget from "../components/ZorinWidget"; // ✅ ajusta el path si cambia

export default function Home() {
  return (
    <div className="container">
      <h1>🎓 Bienvenue sur EduPlatform</h1>
      <p>
        Votre assistant intelligent pour progresser en langues, mathématiques,
        sciences et plus encore.
      </p>
      <Link className="button" to="/login">
        Commencer
      </Link>

      {/* 👇 Aquí aparece Zorín en pantalla */}
      <ZorinWidget />
    </div>
  );
}
