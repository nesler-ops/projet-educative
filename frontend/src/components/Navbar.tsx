// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [weather, setWeather] = useState<{
    temp: number;
    description: string;
    city: string;
  } | null>(null);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth(); // primera vez
    window.addEventListener("storage", checkAuth); // cambios entre pestañas
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");

    setIsLoggedIn(false);
    navigate("/login");
  };

  // 🌤 Fetch clima y hora (igual que antes)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchWeatherAndTime = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${
            import.meta.env.VITE_WEATHER_API_KEY
          }&lang=fr`
        );
        const data = await response.json();

        const temp = data.main.temp;
        const description = data.weather[0].description;
        const city = data.name;
        const timezoneOffset = data.timezone;

        setWeather({ temp, description, city });

        const updateTime = () => {
          const nowUTC = new Date();
          const utcTime = nowUTC.getTime() + nowUTC.getTimezoneOffset() * 60000;
          const localTime = new Date(utcTime + timezoneOffset * 1000);

          setTime(
            localTime.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        };

        updateTime();
        interval = setInterval(updateTime, 60000);
      } catch (error) {
        console.error("Erreur météo:", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherAndTime(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeatherAndTime(45.5017, -73.5673) // fallback Montréal
      );
    } else {
      fetchWeatherAndTime(45.5017, -73.5673);
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          EduPlatform
        </Link>
      </div>

      {/* 🌤 Muestra clima y hora */}
      {weather && (
        <div
          style={{
            fontSize: "0.9rem",
            color: "white",
            marginLeft: "1rem",
          }}
        >
          🌡 {weather.temp.toFixed(1)}°C – {weather.description} à {weather.city}{" "}
          | 🕒 {time}
        </div>
      )}

      <nav>
        {/* ✅ Solo mostrar si hay sesión */}
        {isLoggedIn && <Link to="/dashboard/etudiant">Panneau Étudiant</Link>}

        <Link to="/chatbox">Chatbox</Link>
        <Link to="/dashboard">Panneau principal</Link>

        {isLoggedIn ? (
          <button className="btn-logout" onClick={handleLogout}>
            Se déconnecter
          </button>
        ) : (
          <Link to="/login" className="btn-login">
            Se connecter
          </Link>
        )}
      </nav>
    </div>
  );
}
