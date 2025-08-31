import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

type FaceAuthResponse = {
  message: string;
  token: string;
  user_type: "admin" | "etudiant";
  username: string;
  user_id: number | string;
};

export default function Login() {
  // ---- Login clásico (2FA) ----
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---- Login facial ----
  const [faceMode, setFaceMode] = useState<"idle" | "opening" | "preview">(
    "idle"
  );
  const [faceLoading, setFaceLoading] = useState(false);
  const [faceError, setFaceError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const navigate = useNavigate();

  // ============ LOGIN (2FA) ============
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { user_id, user_type } = res.data;
      navigate("/twofa", { state: { user_id, user_type } });
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.detail || "Email ou mot de passe invalide."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============ CÁMARA (abrir/cerrar) ============
  const openCamera = async () => {
    setFaceError("");
    setFaceMode("opening");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setFaceMode("preview");
    } catch (e: any) {
      setFaceError("Impossible d'accéder à la caméra.");
      setFaceMode("idle");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setFaceMode("idle");
  };

  useEffect(() => {
    return () => closeCamera(); // cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============ CAPTURAR FOTO ============
  const takeSnapshot = async (): Promise<Blob | null> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return null;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, w, h);
    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
    });
  };

  // ============ LOGIN FACIAL ============
  const handleFaceLogin = async () => {
    setFaceError("");
    setFaceLoading(true);
    try {
      // abrir cámara si no está abierta
      if (faceMode === "idle") {
        await openCamera();
        setFaceLoading(false);
        return;
      }

      // tomar foto
      const blob = await takeSnapshot();
      if (!blob) throw new Error("Capture invalide.");

      const formData = new FormData();
      formData.append("file", blob, "face.jpg");

      const { data } = await api.post<FaceAuthResponse>(
        "/auth/login-face",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Guardar sesión básica
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_type", data.user_type);
      localStorage.setItem("user_id", String(data.user_id));
      localStorage.setItem("username", data.username || "");

      // Navegar por rol
      if (data.user_type === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/etudiant");
      }
    } catch (e: any) {
      console.error(e);
      setFaceError(
        e?.response?.data?.detail || "Erreur lors de la reconnaissance faciale."
      );
    } finally {
      setFaceLoading(false);
      closeCamera();
    }
  };

  return (
    <div
      className="container"
      style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}
    >
      <div
        className="card"
        style={{
          width: 420,
          padding: 24,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>Connexion</h2>

        {/* ---- FORM LOGIN 2FA ---- */}
        <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />

          <button
            className="button"
            type="submit"
            disabled={loading}
            style={{ padding: "0.65rem 1rem", borderRadius: 8 }}
          >
            {loading ? "Envoi du code..." : "Se connecter (2FA)"}
          </button>

          {error && <p style={{ color: "red", marginTop: 4 }}>{error}</p>}
        </form>

        <div style={{ height: 1, background: "#eee", margin: "16px 0" }} />

        {/* ---- LOGIN FACIAL ---- */}
        <div style={{ display: "grid", gap: 8 }}>
          <button
            onClick={faceMode === "idle" ? openCamera : handleFaceLogin}
            disabled={faceLoading}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: 8,
              background: "#16a34a",
              color: "#fff",
              border: "none",
            }}
          >
            {faceMode === "idle"
              ? "Ouvrir la caméra"
              : faceLoading
              ? "Analyse en cours..."
              : "Se connecter avec la caméra"}
          </button>
          {faceError && <p style={{ color: "red" }}>{faceError}</p>}
        </div>

        {/* PREVIEW CÁMARA */}
        {faceMode !== "idle" && (
          <div
            style={{
              marginTop: 12,
              border: "1px dashed #ccc",
              borderRadius: 8,
              padding: 8,
            }}
          >
            <video
              ref={videoRef}
              style={{ width: "100%", borderRadius: 8 }}
              playsInline
              muted
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                onClick={handleFaceLogin}
                disabled={faceLoading}
                style={{ flex: 1, padding: "0.5rem 1rem", borderRadius: 8 }}
              >
                Prendre une photo et se connecter
              </button>
              <button
                onClick={closeCamera}
                type="button"
                style={{
                  flex: 1,
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  background: "#eee",
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Canvas oculto para snapshot */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
