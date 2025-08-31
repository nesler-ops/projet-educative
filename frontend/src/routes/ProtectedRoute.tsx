import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // si no hay token, redirige al login y guarda desde dónde venía
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
