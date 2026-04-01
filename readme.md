# BricoLoc POC — Architecture Microservices

Proof of Concept réalisé dans le cadre du projet collaboratif du BLOC 1 de MAALSI,
illustrant une architecture microservices pour la refonte du SI de BricoLoc.

## Architecture
```
                        ┌─────────────────┐
                        │    Frontend      │
                        │   Next.js 14     │
                        │  localhost:3000  │
                        └────────┬────────┘
                                 │ HTTP
                        ┌────────▼────────┐
                        │   API Gateway    │
                        │      Nginx       │
                        │  localhost:8080  │
                        └────┬───────┬────┘
                             │       │
               /api/stock    │       │ /api/entrepots
                             │       │
                ┌────────────▼─┐   ┌─▼──────────────┐
                │ stock-service│   │entrepot-service │
                │ Spring Boot  │   │  Spring Boot    │
                │ port 8081    │   │  port 8082      │
                └──────┬───────┘   └──────┬──────────┘
                       │                  │
               ┌───────▼──────┐  ┌────────▼───────┐
               │   stock-db   │  │  entrepot-db   │
               │ PostgreSQL16 │  │ PostgreSQL 16  │
               │  port 5433   │  │  port 5434     │
               └──────────────┘  └────────────────┘
```

### Principes microservices illustrés
- **Isolation des services** : chaque service métier est un conteneur indépendant
- **Base de données par service** : stock-db et entrepot-db sont séparées
- **API Gateway** : point d'entrée unique, routage vers les services

---

## Prérequis

### Outils :
- Docker Desktop | version 4.x | https://www.docker.com/products/docker-desktop
- Git | version 2.x | https://git-scm.com

> Pas besoin d'installer Java, Node.js ou PostgreSQL — tout tourne dans Docker.

---

## Lancement rapide

### 1. Cloner le projet
```bash
git clone https://github.com/votre-utilisateur/bricoloc-poc.git
cd bricoloc-poc
```

### 2. Démarrer Docker Desktop

Lance Docker Desktop et attends que l'icône 🐳 soit stable dans la barre des tâches.

### 3. Lancer tous les conteneurs
```bash
docker compose up --build
```

> ⏳ Le premier build prend environ 5 à 10 minutes (téléchargement des dépendances Maven et Node).
> Les lancements suivants seront bien plus rapides.

### 4. Accéder aux services

| Service | URL | Description |
|---|---|---|
| 🖥️ Frontend | http://localhost:3000 | Interface utilisateur Next.js |
| 🔀 API Gateway | http://localhost:8080 | Point d'entrée unique |
| 📦 Stock API | http://localhost:8080/api/stock | CRUD stocks (via gateway) |
| 🏭 Entrepôts API | http://localhost:8080/api/entrepots | CRUD entrepôts (via gateway) |
| 🗄️ Adminer (BDD) | http://localhost:9090 | Interface base de données |

---

## 🗄️ Accès à la base de données (Adminer)

Ouvre http://localhost:9090 et connecte-toi avec ces identifiants :

**Base stock :**
| Champ | Valeur |
|---|---|
| Système | PostgreSQL |
| Serveur | `stock-db` |
| Utilisateur | `bricoloc` |
| Mot de passe | `bricoloc123` |
| Base de données | `stock_db` |

**Base entrepôts :**
| Champ | Valeur |
|---|---|
| Système | PostgreSQL |
| Serveur | `entrepot-db` |
| Utilisateur | `bricoloc` |
| Mot de passe | `bricoloc123` |
| Base de données | `entrepot_db` |

---

## 🛠️ Commandes utiles
```bash
# Premier lancement ou après modification du code
docker compose up --build

# Lancement rapide (sans rebuild)
docker compose up

# Lancement en arrière-plan
docker compose up -d

# Arrêter les conteneurs (données conservées)
docker compose down

# Arrêter et supprimer toutes les données
docker compose down -v

# Voir les logs en temps réel
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f stock-service
docker compose logs -f entrepot-service
docker compose logs -f api-gateway

# État des conteneurs
docker compose ps
```

---

## Tester l'API manuellement

Tu peux tester les endpoints directement dans le navigateur ou avec curl :
```bash
# Lister les entrepôts
curl http://localhost:8080/api/entrepots

# Lister les stocks
curl http://localhost:8080/api/stock

# Créer un outil en stock
curl -X POST http://localhost:8080/api/stock \
  -H "Content-Type: application/json" \
  -d '{"nomOutil":"Marteau piqueur","categorie":"Maçonnerie","quantiteDisponible":2,"quantiteTotale":4,"entrepotId":1}'

# Modifier un stock (remplacer {id} par l'id réel)
curl -X PUT http://localhost:8080/api/stock/{id} \
  -H "Content-Type: application/json" \
  -d '{"nomOutil":"Marteau piqueur","categorie":"Maçonnerie","quantiteDisponible":1,"quantiteTotale":4,"entrepotId":1}'

# Supprimer un stock
curl -X DELETE http://localhost:8080/api/stock/{id}
```