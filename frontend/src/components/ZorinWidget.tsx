import { useEffect, useState } from "react";

const phrases = [
  "Aujourd’hui, tu vas apprendre quelque chose de génial !",
  "N’abandonne pas, même pas le lundi !",
  "Les erreurs font partie du chemin 🧠",
  "Une petite révision vaut mieux que mille regrets 📚",
  "Étudier, c’est comme se gratter l’oreille avec la queue… difficile mais possible !",
];

export default function ZorinWidget() {
  const [phrase, setPhrase] = useState("");

  useEffect(() => {
    const random = Math.floor(Math.random() * phrases.length);
    setPhrase(phrases[random]);
  }, []);

  return (
    <div style={styles.widget}>
      <img src="/zorin.png" alt="Zorín la mascotte" style={styles.image} />
      <p style={styles.text}>
        <strong>Zorín dit :</strong>
        <br />
        {phrase}
      </p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  widget: {
    position: "fixed",
    bottom: 30,
    right: 30,
    width: 360,
    background: "#fff4f0",
    border: "4px solid #e74c3c",
    borderRadius: 30,
    padding: 24,
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
    textAlign: "center",
    zIndex: 9999,
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
  },
  image: {
    width: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 28,
    color: "#c0392b",
    margin: 0,
    lineHeight: "1.3em",
  },
};
