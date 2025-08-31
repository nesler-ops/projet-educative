import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<"etudiant" | "admin">("etudiant");

  const [useWebcam, setUseWebcam] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const [opening, setOpening] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const navigate = useNavigate();

  const openCamera = async () => {
    setErr("");
    setOpening(true);
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
    } catch {
      setErr(
        "Impossible d'accéder à la caméra. Téléversez une image JPEG/PNG."
      );
      setUseWebcam(false);
    } finally {
      setOpening(false);
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (useWebcam) openCamera();
    else closeCamera();
    return () => closeCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useWebcam]);

  const snapshot = async (): Promise<Blob | null> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    const w = video.videoWidth,
      h = video.videoHeight;
    if (!w || !h) return null;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, w, h);
    return await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSending(true);

    try {
      let blob: Blob | null = null;

      if (useWebcam) {
        blob = await snapshot();
        if (!blob) throw new Error("Capture invalide depuis la caméra.");
      } else {
        if (!file)
          throw new Error("Veuillez sélectionner une image (jpeg/png).");
        blob = file;
      }

      const form = new FormData();
      form.append("email", email);
      form.append("password", password);
      form.append("nom", nom);
      form.append("prenom", prenom);
      form.append("type", type);
      form.append(
        "file",
        blob,
        useWebcam ? "face.jpg" : file?.name || "face.jpg"
      );

      await api.post("/auth/register-with-face", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Compte créé et encodage facial enregistré !");
      navigate("/login");
    } catch (e: any) {
      setErr(
        e?.response?.data?.detail ||
          e?.message ||
          "Erreur lors de l'inscription"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="register-wrap">
      <div className="register-card">
        <h1 className="register-title">Créer un compte</h1>
        <p className="register-sub">
          Nous n'enregistrons pas de photo — uniquement une signature numérique
          (encodage) pour l'authentification faciale.
        </p>

        {err && <div className="form-alert">{err}</div>}

        <form onSubmit={submit} className="register-form">
          {/* Informations */}
          <div className="form-section">
            <h3 className="form-section-title">Informations personnelles</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Nom</label>
                <input
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Prénom</label>
                <input
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Rôle</label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "etudiant" | "admin")
                }
              >
                <option value="etudiant">Étudiant</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Encodage facial */}
          <div className="form-section">
            <h3 className="form-section-title">Encodage facial</h3>

            <label className="switch">
              <input
                type="checkbox"
                checked={useWebcam}
                onChange={(e) => setUseWebcam(e.target.checked)}
              />
              <span className="slider" />
              <span className="switch-label">Utiliser la caméra</span>
            </label>

            {!useWebcam && (
              <div className="form-group">
                <label>Image (JPEG/PNG)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={onFileChange}
                />
              </div>
            )}

            {useWebcam && (
              <div className="camera-box">
                <video
                  ref={videoRef}
                  className="camera-video"
                  playsInline
                  muted
                />
                <div className="camera-hint">
                  Astuce : bonne lumière, visage centré, regardez la caméra.
                </div>
              </div>
            )}
          </div>

          <button
            className="btn-primary"
            type="submit"
            disabled={opening || sending}
          >
            {opening
              ? "Ouverture caméra..."
              : sending
              ? "Création..."
              : "Créer le compte"}
          </button>
        </form>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
