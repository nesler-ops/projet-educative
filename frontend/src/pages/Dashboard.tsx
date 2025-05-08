// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.type === "etudiant") navigate("/dashboard/etudiant");
      else if (user.type === "admin") navigate("/dashboard/admin");
    }
  }, [user]);

  return <p className="container">Chargement du dashboard...</p>;
}
