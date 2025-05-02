# 📚 Plateforme Éducative Intelligente

Ce projet est une application web et mobile qui recommande des parcours d'apprentissage personnalisés pour les étudiants à l'aide de l'IA.

---

## 🚀 Technologies utilisées

- **Frontend** : React.js + Vite + TypeScript
- **Backend** : FastAPI
- **Base de données** : PostgreSQL (utilisateurs), MongoDB (ressources pédagogiques)
- **IA** : système de recommandation (à intégrer dans `recommender.py`)
- **Conteneurs** : Docker + docker-compose
- **Déploiement local** : docker-compose (sans Kubernetes)

---

## 📁 Structure du projet

```
projet-plateforme-educative/
├── backend/          # API FastAPI + services IA
├── frontend/         # Interface React
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Prérequis

- Docker
- Docker Compose

---

## ▶️ Lancer le projet

1. **Cloner le dépôt** ou extraire les deux archives `.zip` (backend et frontend)
2. **Placer les dossiers `backend/` et `frontend/` dans le même dossier parent**
3. **Lancer Docker Compose** :

```bash
docker-compose up --build
```

Cela va :
- construire le backend et le frontend
- lancer les bases de données PostgreSQL et MongoDB
- exposer :
  - `http://localhost:8000` pour l’API FastAPI
  - `http://localhost:5173` pour le frontend React

---

## 🧪 Tester les routes backend

- GET `/auth/login`
- GET `/users`
- GET `/resources`
- GET `/recommendation`

Utilisez Postman ou curl pour tester les endpoints.

---

## 📦 Environnements

- PostgreSQL: port 5432 — user: `admin`, pass: `admin`, db: `educative`
- MongoDB: port 27017 — db: `educative`

---

## 📌 À faire ensuite

- Ajouter le système d’authentification complet (JWT)
- Intégrer le moteur de recommandation IA dans `recommender.py`
- Ajouter l’enregistrement des progrès des utilisateurs
- Améliorer l’interface utilisateur

---

Steve Ataky, PhD
