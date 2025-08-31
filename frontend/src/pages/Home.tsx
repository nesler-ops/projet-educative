import { useState, useEffect } from "react";
import ZorinWidget from "../components/ZorinWidget";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calculator,
  Microscope,
  Globe,
  Users,
  Trophy,
  Clock,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const carouselImages = [
    {
      src: "/collaborative.jpg",
      alt: "Étudiants collaborant",
      title: "Apprentissage collaboratif",
    },
    {
      src: "/math.jpg",
      alt: "Mathématiques interactives",
      title: "Mathématiques interactives",
    },
    {
      src: "/science.png",
      alt: "Sciences expérimentales",
      title: "Sciences expérimentales",
    },
    {
      src: "/langage.png",
      alt: "Langues du monde",
      title: "Langues du monde",
    },
  ];

  const subjects = [
    {
      icon: Globe,
      name: "Langues",
      description: "Français, Anglais, Espagnol et plus",
      color: "#10b981",
    },
    {
      icon: Calculator,
      name: "Mathématiques",
      description: "De l'arithmétique au calcul avancé",
      color: "#3b82f6",
    },
    {
      icon: Microscope,
      name: "Sciences",
      description: "Physique, Chimie, Biologie",
      color: "#8b5cf6",
    },
    {
      icon: BookOpen,
      name: "Littérature",
      description: "Lecture, écriture, analyse",
      color: "#f97316",
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Apprentissage personnalisé",
      description: "Adapté à votre rythme et niveau",
    },
    {
      icon: Trophy,
      title: "Système de récompenses",
      description: "Gagnez des points et débloquez des badges",
    },
    {
      icon: Clock,
      title: "Disponible 24/7",
      description: "Apprenez quand vous voulez",
    },
    {
      icon: Star,
      title: "Contenu de qualité",
      description: "Créé par des experts pédagogiques",
    },
  ];

  // Efecto para el auto-play
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <>
      <style>{`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f3e8ff 100%);
          padding: 0;
          margin: 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 16px;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 48px;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .hero-description {
          font-size: 1.25rem;
          color: #6b7280;
          max-width: 512px;
          margin: 0 auto 32px auto;
          line-height: 1.6;
        }

        .button {
          display: inline-block;
          background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
          color: white;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.125rem;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .button:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: scale(1.05);
        }

        /* Carrusel mejorado */
        .carousel-container {
          position: relative;
          max-width: 1000px;
          margin: 0 auto 64px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          aspect-ratio: 16/9;
        }
        
        .carousel-track {
          display: flex;
          height: 100%;
          transition: transform 0.5s ease-in-out;
        }
        
        .carousel-slide {
          min-width: 100%;
          position: relative;
        }
        
        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .carousel-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
          color: white;
          text-align: center;
        }
        
        .carousel-title {
          font-size: 1.75rem;
          font-weight: bold;
          margin: 0 0 0.5rem;
        }
        
        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }
        
        .carousel-btn:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
        }
        
        .carousel-btn.prev {
          left: 20px;
        }
        
        .carousel-btn.next {
          right: 20px;
        }
        
        .carousel-indicators {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 10px;
          z-index: 10;
        }
        
        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .indicator.active {
          background: white;
          transform: scale(1.2);
        }
        
        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          background: rgba(255,255,255,0.3);
          width: 100%;
          z-index: 10;
        }
        
        .progress {
          height: 100%;
          background: white;
          width: 0%;
          transition: width 0.1s linear;
        }
        
        @media (max-width: 768px) {
          .carousel-container {
            aspect-ratio: 4/3;
            border-radius: 0;
          }
          
          .carousel-title {
            font-size: 1.25rem;
          }
          
          .carousel-btn {
            width: 40px;
            height: 40px;
          }
        }

        /* Resto de estilos... */
        .section {
          margin-bottom: 64px;
        }

        .section-title {
          font-size: 1.875rem;
          font-weight: bold;
          text-align: center;
          color: #1f2937;
          margin-bottom: 48px;
        }

        .grid {
          display: grid;
          gap: 24px;
        }

        .grid-4 {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        @media (min-width: 1024px) {
          .grid-4 {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          transform: translateY(-8px);
        }

        .subject-icon {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .subject-icon svg {
          width: 32px;
          height: 32px;
          color: white;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .card-description {
          color: #6b7280;
          line-height: 1.5;
        }

        .feature-card {
          text-align: center;
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }

        .feature-icon svg {
          width: 32px;
          height: 32px;
          color: white;
        }

        .feature-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .feature-description {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .stats-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          padding: 32px;
          margin-bottom: 64px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
          text-align: center;
        }

        .stat-number {
          font-size: 2.25rem;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .stat-number.blue { color: #2563eb; }
        .stat-number.purple { color: #8b5cf6; }
        .stat-number.green { color: #10b981; }

        .stat-label {
          color: #6b7280;
        }

        .zorin-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 12px;
          padding: 16px;
          color: white;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          max-width: 300px;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .zorin-widget:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
        }

        .zorin-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .zorin-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .zorin-emoji {
          font-size: 1.5rem;
        }

        .zorin-text h3 {
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .zorin-text p {
          font-size: 0.875rem;
          opacity: 0.9;
          margin: 0;
        }

        .cta-container {
          text-align: center;
          background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%);
          border-radius: 12px;
          padding: 32px;
          color: white;
        }

        .cta-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .cta-description {
          margin-bottom: 24px;
          opacity: 0.9;
          line-height: 1.5;
        }

        .cta-button {
          background: white;
          color: #2563eb;
          padding: 12px 32px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .cta-button:hover {
          background: #f3f4f6;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .container {
            padding: 24px 16px;
          }
        }
      `}</style>

      <div className="home-container">
        <div className="container">
          {/* Hero Section */}
          <div className="hero-section">
            <h1 className="hero-title">🎓 Bienvenue sur EduPlatform</h1>
            <p className="hero-description">
              Votre assistant intelligent pour progresser en langues,
              mathématiques, sciences et plus encore.
            </p>
            <Link className="button" to="/login">
              Commencer
            </Link>
          </div>

          {/* Carrusel mejorado */}
          <div className="carousel-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselImages.map((image, index) => (
                <div key={index} className="carousel-slide">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="carousel-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect fill='%23d1d5db' width='800' height='450'/%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='40' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EImage non disponible%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="carousel-overlay">
                    <h3 className="carousel-title">{image.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={prevSlide} className="carousel-btn prev">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="carousel-btn next">
              <ChevronRight size={24} />
            </button>

            <div className="carousel-indicators">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`indicator ${
                    index === currentSlide ? "active" : ""
                  }`}
                  aria-label={`Aller à la diapositive ${index + 1}`}
                />
              ))}
            </div>

            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: isAutoPlaying ? "100%" : "0%",
                  transitionDuration: isAutoPlaying ? "5s" : "0s",
                }}
              />
            </div>
          </div>

          {/* Sección de materias */}
          <div className="section">
            <h2 className="section-title">Explorez nos matières</h2>
            <div className="grid grid-4">
              {subjects.map((subject, index) => {
                const IconComponent = subject.icon;
                return (
                  <div key={index} className="card">
                    <div
                      className="subject-icon"
                      style={{ backgroundColor: subject.color }}
                    >
                      <IconComponent />
                    </div>
                    <h3 className="card-title">{subject.name}</h3>
                    <p className="card-description">{subject.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Características */}
          <div className="section">
            <h2 className="section-title">Pourquoi choisir EduPlatform ?</h2>
            <div className="grid grid-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="feature-card">
                    <div className="feature-icon">
                      <IconComponent />
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="stats-container">
            <div className="stats-grid">
              <div>
                <div className="stat-number blue">10,000+</div>
                <div className="stat-label">Étudiants actifs</div>
              </div>
              <div>
                <div className="stat-number purple">500+</div>
                <div className="stat-label">Leçons disponibles</div>
              </div>
              <div>
                <div className="stat-number green">95%</div>
                <div className="stat-label">Taux de satisfaction</div>
              </div>
            </div>
          </div>

          {/* Widget Zorin */}
          <ZorinWidget />

          {/* Call to Action */}
          <div className="cta-container">
            <h2 className="cta-title">
              Prêt à commencer votre aventure d'apprentissage ?
            </h2>
            <p className="cta-description">
              Rejoignez des milliers d'étudiants qui progressent chaque jour
              avec EduPlatform
            </p>
            <Link className="cta-button" to="/register">
              Inscription gratuite
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
