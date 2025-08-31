// src/pages/EnrollFace.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EnrollFace() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [opening, setOpening] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        setError("Impossible d'accéder à la caméra.");
      } finally {
        setOpening(false);
      }
    })();
    return () => {
      const v = videoRef.current as any;
      const s: MediaStream | undefined = v?.srcObject;
      s?.getTracks()?.forEach((t) => t.stop());
    };
  }, []);

  const snapshot = async (): Promise<Blob | null> => {
    const video = videoRef.current,
      canvas = canvasRef.current;
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

  const enroll = async () => {
    setSending(true);
    setError("");
    try {
      const blob = await snapshot();
      if (!blob) throw new Error("Capture invalide.");
      const form = new FormData();
      form.append("file", blob, "face.jpg");

      // necesitas token en Authorization si tu /facial/enroll lo requiere (lo normal):
      const token = localStorage.getItem("token");
      const res = await api.post("/facial/enroll", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      alert("Encodage facial enregistré ✔");
      navigate("/login"); // o dashboard si ya estás logueado
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ||
          "Erreur lors de l'enregistrement du visage."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520 }}>
        <h2>Enregistrer mon visage</h2>
        <p style={{ color: "#666", margin: "6px 0 12px" }}>
          Nous n'enregistrons pas de photo — uniquement une signature numérique
          (encodage).
        </p>

        {error && (
          <div style={{ color: "#dc2626", marginBottom: 8 }}>{error}</div>
        )}

        <div
          style={{
            border: "1px dashed #d1d5db",
            borderRadius: 12,
            padding: 8,
            marginBottom: 12,
          }}
        >
          <video
            ref={videoRef}
            style={{ width: "100%", borderRadius: 8 }}
            playsInline
            muted
          />
        </div>

        <button
          className="btn-green"
          onClick={enroll}
          disabled={opening || sending}
        >
          {opening
            ? "Ouverture caméra..."
            : sending
            ? "Enregistrement..."
            : "Capturer et enregistrer"}
        </button>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
