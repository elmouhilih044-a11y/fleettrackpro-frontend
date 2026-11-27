# FleetTrackPRO — Frontend

Interface React (Vite) de gestion de flotte de transport routier. Elle consomme l'API REST FleetTrackPRO (Node.js, Express, MongoDB) pour deux rôles : **Admin** et **Chauffeur**.

## Fonctionnalités

- Connexion réelle à l'API (JWT), rôle fourni par le serveur
- Layouts Admin et Chauffeur, navigation par URL (React Router v6)
- Protection des pages par session et par rôle, pages 403 et 404
- Admin : utilisateurs (liste, filtre, détail, création d'un chauffeur, suspension/réactivation), camions et remorques (liste, détail, création, modification, archivage avec confirmation), trajets (liste, détail, création et assignation)
- Chauffeur : liste et détail de ses trajets, avancement du statut
- Gestion des erreurs 400, 401, 403, 404, 409 et des pannes réseau

## Prérequis

- Node.js et npm
- L'API FleetTrackPRO démarrée (par défaut sur `http://localhost:3000`) avec Redis et MongoDB
- L'origine du front (`http://localhost:5173`) autorisée par CORS dans l'API

## Installation et lancement

```bash
npm install
cp .env.example .env
npm run dev      # http://localhost:5173
npm run build    # build de production
npm run lint     # vérification ESLint
```

## Variables d'environnement

| Variable | Rôle | Exemple |
|---|---|---|
| `VITE_API_URL` | Adresse de base de l'API (non secrète) | `http://localhost:3000/api/v1` |

Aucun secret n'est placé dans le code ni dans le bundle. Le fichier `.env` est ignoré par Git, seul `.env.example` est publié.

## Comptes de test (anonymisés)

Trois comptes locaux sont nécessaires : un Admin, un Chauffeur actif et un Chauffeur suspendu. Les mots de passe ne sont pas publiés.

## Contrat de l'API (routes réellement utilisées)

| Point | Information |
|---|---|
| Base URL et CORS | `http://localhost:3000/api/v1` ; origine autorisée `http://localhost:5173` |
| Connexion | `POST /auth/login` avec `{ email, password }` → `200 { token, user: { id, firstName, lastName, email, role } }` ; identifiants faux → `401` ; compte suspendu → `403 "Compte suspendu"` |
| Session | JWT en en-tête `Authorization: Bearer <token>`, durée 1 h, pas de refresh token, token gardé **en mémoire** uniquement |
| Identité et rôle | `user.role` (`admin` ou `driver`) dans la réponse du login ; pas de route « qui suis-je » |
| Déconnexion | Pas de route serveur : la session est effacée côté front |
| Utilisateurs (Admin) | `GET /users/drivers`, `POST /users/drivers` (`firstName`, `lastName`, `email`, `password` ≥ 6), `PUT /users/drivers/:id/suspend`, `PUT /users/drivers/:id/activate` |
| Camions (Admin) | `GET /trucks`, `GET /trucks/:id`, `POST /trucks` (`registrationNumber`, `brand`, `model`, `currentMileage`), `PUT /trucks/:id` (+ `status` : `available`, `maintenance`, `inactive`), `DELETE /trucks/:id` (archivage : statut `inactive`) |
| Remorques (Admin) | `GET /trailers`, `GET /trailers/:id`, `POST /trailers` (`registrationNumber`, `type`, `currentMileage`), `PUT /trailers/:id` (+ `status`), `DELETE /trailers/:id` (archivage) |
| Trajets (Admin) | `GET /trips`, `GET /trips/:id`, `POST /trips` : **création et assignation en une seule requête** (`departureSite`, `arrivalSite`, `goods`, `plannedStartDate`, `plannedEndDate` postérieure au début, `driver`, `truck`, `trailer`). Les réponses contiennent le chauffeur (prénom, nom), le camion et la remorque (immatriculation). |
| Mes trajets (Chauffeur) | `GET /my-trips`, `GET /my-trips/:id`, `PUT /my-trips/:id/status` ; transitions `todo` → `in_progress` → `completed`, sinon `409` |
| Erreurs | `400` validation, `401` token absent/invalide/expiré, `403` rôle ou compte suspendu, `404` introuvable, `409` conflit (assignation, statut), `429` trop de requêtes. Le message est dans le champ `message`. Une panne réseau est affichée « Serveur injoignable ». |

## Écarts documentés (limites de l'API livrée)

| Écart | Conséquence sur l'interface |
|---|---|
| Pas de route pour **modifier** un chauffeur | L'écran Utilisateurs permet de créer, suspendre et réactiver |
| La liste des utilisateurs ne renvoie que les **chauffeurs** | Les comptes Admin ne sont pas affichés |
| Pas de route de **disponibilité par période** | Le formulaire de trajet propose les chauffeurs actifs et les véhicules au statut `available` ; la période et les règles sont revérifiées par l'API, qui renvoie `409` en cas de conflit (saisie conservée, message affiché) |
| Pas de refresh token, pas de route de déconnexion ni « qui suis-je » | Un `401` ramène à la connexion ; après rechargement de la page, une nouvelle connexion est nécessaire et l'URL demandée est reprise |
| Saisie des kilomètres, du carburant, des remarques, PDF, pneus, maintenance, analytics | Hors périmètre de cette livraison |

## Mécanisme de session

La session (`token` et `user`) est gardée en mémoire dans le composant `App`. Un `401` sur une requête avec token appelle un gestionnaire (`setUnauthorizedHandler`) qui efface la session et affiche « Session expirée ». Un `403` affiche « Accès refusé » sans fermer la session. Les gardes React (`RequireAuth`, `RequireRole`) améliorent l'expérience, mais **l'autorisation réelle est appliquée par l'API**.

## Routes du frontend

| URL | Accès |
|---|---|
| `/login` | public |
| `/` | redirige vers l'accueil du rôle ou vers `/login` |
| `/admin`, `/admin/utilisateurs`, `/admin/camions` | Admin |
| `/admin/remorques`, `/admin/remorques/nouveau`, `/admin/remorques/:id` | Admin |
| `/admin/trajets`, `/admin/trajets/nouveau`, `/admin/trajets/:id` | Admin |
| `/chauffeur`, `/chauffeur/trajets`, `/chauffeur/trajets/:id` | Chauffeur |
| `/403` | utilisateur connecté sans droit |
| toute autre URL | page 404 |

Après une connexion, l'utilisateur est renvoyé vers la page demandée si son rôle l'autorise, sinon vers l'accueil de son rôle. En production, le serveur statique doit renvoyer `index.html` pour toutes les URL de l'application (par exemple `try_files $uri /index.html;` avec Nginx). `npm run preview` le fait déjà.

## Arbre des composants

```
main.jsx
└── AppProviders (Redux, TanStack Query) → BrowserRouter → App
    └── AppRoutes
        ├── LoginPage → LoginForm
        ├── RootRedirect
        └── RequireAuth
            ├── ForbiddenPage
            ├── RequireRole (admin) → AdminLayout (AppShell, NavLink, Outlet)
            │   ├── HomePage
            │   ├── UsersPage → UserList → UserCard ; UserForm
            │   ├── TrucksPage → TruckList → TruckCard ; TruckForm
            │   ├── TrailersListPage / TrailerFormPage / TrailerDetailPage → TrailerForm
            │   └── TripsListPage / TripFormPage → TripForm / TripDetailPage
            └── RequireRole (driver) → DriverLayout (AppShell, NavLink, Outlet)
                ├── HomePage
                ├── MyTripsPage
                └── MyTripDetailPage
```

## Props principales

| Composant | Props |
|---|---|
| `App` → `AppRoutes` | `session`, `onLogin`, `onLogout`, `loginLoading`, `loginError` |
| `LoginForm` | `onLogin`, `loading`, `error` |
| `AppShell` | `user`, `onLogout`, `headerExtra`, `children` |
| `AdminLayout`, `DriverLayout` | `user`, `onLogout` |
| `RequireAuth`, `RequireRole` | `session` (et `role`) |
| Pages de ressources | `token` |
| `UserList`, `TruckList` | liste, `selectedId`, `onSelect` |
| `UserForm`, `TruckForm`, `TrailerForm` | `initialValues`, `onSubmit` ou `onCreate`, `onCancel`, `error` |
| `TripForm` | `drivers`, `trucks`, `trailers`, `onSubmit`, `error` |
| `ResourceState` | `status`, `error`, `onRetry` |

## Choix React

- `useState` pour la session, les formulaires contrôlés, les filtres et les états d'affichage ; les listes filtrées sont calculées pendant le rendu.
- `useApiGet` (`useEffect` avec `AbortController` et dépendances `[path, token, version]`) charge les listes et les détails ; une ancienne réponse n'écrase pas la page courante.
- Les mutations (création, modification, archivage, statut) sont déclenchées par des gestionnaires d'événements, jamais par un effet, puis la ressource est relue.
- Une mutation refusée (400, 403, 409) affiche l'erreur et **conserve la saisie** ; aucun faux succès.
- Le module `src/api.js` centralise l'adresse de l'API, le token et la gestion des erreurs.

## Tests et preuves

Le plan de recette est dans `PLAN_DE_TESTS.md`. Les captures et la preuve d'un `403` renvoyé par le backend sont dans `docs/` (sans token ni mot de passe).