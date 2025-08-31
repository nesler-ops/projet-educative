import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { setUserSession } from "../services/auth";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function TwoFAVerification() {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendLeft, setResendLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { user_id, user_type } = (location.state || {}) as {
    user_id?: string;
    user_type?: "etudiant" | "admin";
  };

  if (!user_id || !user_type) {
    return (
      <div className="twofa-page">
        <div className="twofa-card" style={{ textAlign: "center" }}>
          <h2 className="twofa-title" style={{ color: "#dc2626" }}>
            Données manquantes
          </h2>
          <p className="twofa-subtitle">Veuillez vous reconnecter.</p>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary"
            style={{ width: "auto", marginTop: 12 }}
          >
            Revenir à la connexion
          </button>
        </div>
      </div>
    );
  }

  const code = useMemo(() => digits.join(""), [digits]);
  const canSubmit = code.length === OTP_LENGTH && /^\d+$/.test(code);

  useEffect(() => {
    setResendLeft(RESEND_SECONDS);
  }, [user_id]);

  useEffect(() => {
    if (resendLeft <= 0) return;
    const t = setInterval(() => setResendLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendLeft]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (idx: number, val: string) => {
    setErrorMsg("");
    const v = val.replace(/\D/g, "");
    if (!v) {
      const next = [...digits];
      next[idx] = "";
      setDigits(next);
      return;
    }
    if (v.length > 1) {
      const next = [...digits];
      let j = idx;
      for (let k = 0; k < v.length && j < OTP_LENGTH; k += 1, j += 1)
        next[j] = v[k];
      setDigits(next);
      const firstEmpty = next.findIndex((d) => d === "");
      const target = firstEmpty === -1 ? OTP_LENGTH - 1 : firstEmpty;
      inputsRef.current[target]?.focus();
      return;
    }
    const next = [...digits];
    next[idx] = v;
    setDigits(next);
    if (idx < OTP_LENGTH - 1 && v) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      const prev = idx - 1;
      inputsRef.current[prev]?.focus();
      const next = [...digits];
      next[prev] = "";
      setDigits(next);
    }
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1)
      inputsRef.current[idx + 1]?.focus();
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    const clip = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!clip) return;
    e.preventDefault();
    const next = [...digits];
    let j = idx;
    for (let k = 0; k < clip.length && j < OTP_LENGTH; k += 1, j += 1)
      next[j] = clip[k];
    setDigits(next);
    const firstEmpty = next.findIndex((d) => d === "");
    const target = firstEmpty === -1 ? OTP_LENGTH - 1 : firstEmpty;
    inputsRef.current[target]?.focus();
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/auth/verify-code", { user_id, code });
      const data = res.data; // { token, username, user_type, user_id, message }
      setUserSession(data);

      if (data.user_type === "etudiant") navigate("/dashboard/etudiant");
      else navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ Erreur de vérification :", err);
      setErrorMsg(
        err?.response?.data?.detail ||
          "Code invalide ou expiré. Veuillez réessayer."
      );
      setDigits(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (resendLeft > 0) return;
    try {
      setErrorMsg("");
      await api.post("/auth/resend-code", { user_id }); // si aún no existe, deshabilita el botón
      setResendLeft(RESEND_SECONDS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Impossible d'envoyer un nouveau code pour le moment.");
    }
  };

  return (
    <div className="twofa-page">
      <div className="twofa-card">
        <h1 className="twofa-title">Vérification en 2 étapes</h1>
        <p className="twofa-subtitle">
          Un code à 6 chiffres a été envoyé à votre adresse email.
        </p>

        <form onSubmit={submit}>
          <div
            className="otp-grid"
            aria-label="Saisissez le code reçu par email"
          >
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digits[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={(e) => handlePaste(e, i)}
                ref={(el) => (inputsRef.current[i] = el)}
                aria-label={`Code chiffre ${i + 1}`}
                className="otp-input"
              />
            ))}
          </div>

          {errorMsg && (
            <div className="alert-error" role="alert">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!canSubmit || loading}
            style={{ marginTop: 12 }}
          >
            {loading ? "Vérification..." : "Vérifier le code"}
          </button>

          <div className="twofa-actions">
            <button
              type="button"
              onClick={resend}
              disabled={resendLeft > 0}
              className="btn-ghost"
              title={
                resendLeft > 0
                  ? `Réessayer dans ${resendLeft}s`
                  : "Renvoyer le code"
              }
            >
              {resendLeft > 0
                ? `Renvoyer le code (${resendLeft}s)`
                : "Renvoyer le code"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="btn-ghost"
            >
              Changer de compte
            </button>
          </div>

          <div className="twofa-footer">
            Saisissez le code tel qu’il apparaît dans l’email. Ne partagez ce
            code avec personne.
          </div>
        </form>
      </div>
    </div>
  );
}
