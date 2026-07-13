# Stellara

Stellara est une application astrologique orientée conversion qui combine expérience produit, contenu éditorial et logique backend métier.

Le projet a migré le backend vers un runtime full JavaScript:
- Runtime principal: Nuxt 3 / Nitro
- Base de donnees cible: Neon Postgres
- Couche acces donnees: Drizzle ORM
- Symfony legacy: encore present pendant la transition

## Vision

Stellara vise une astrologie utile, actionnable et lisible:
- parcours guide pour générer un rapport personnalisé
- contenu éditorial SEO (blog, lexique, pages thematiques)
- monétisation premium via Stripe

## Fonctionnalités actuelles

- Génération de rapport astrologique avec persistance backend
- Endpoint de statut backend: GET /api/backend-status
- Endpoints compte/abonnement:
  - GET /api/user/profile
  - GET /api/user/subscription-status
- Webhook Stripe securisé:
  - POST /api/stripe/webhook
- Section blog Nuxt avec source JSON statique (data/blog.json)
- Page horoscope du jour avec endpoint dédié et cache journalier

## Stack technique

- Frontend: Nuxt 3, Vue 3, Tailwind CSS, Pinia
- Backend (actuel): Nitro server routes et server utils
- Base de donnees: PostgreSQL (Neon), Drizzle ORM, drizzle-kit
- Paiement: Stripe
- Email: Nodemailer + integration Brevo
- Legacy en cohabitation: Symfony/PHP

## Prérequis

- Node.js 20+
- npm 10+
- PostgreSQL compatible Neon (ou instance locale)
- Optionnel pour la partie legacy: PHP 8.2+, Composer

## Installation rapide

1. Cloner le depot

```bash
git clone https://github.com/ton-compte/Stellara.git
cd Stellara
```

2. Installer les dépendances JavaScript

```bash
npm install
```

3. Créer un fichier .env.local (base sur .env)

```env
APP_ENV=dev
DATABASE_URL=postgres://user:password@host:5432/neondb
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
BREVO_API_KEY=xxx
```

4. Generer et/ou appliquer le schema Drizzle

```bash
npm run db:generate
npm run db:push
```

5. Lancer le projet

```bash
npm run dev
```

Application accessible en local sur le port affiche par Nuxt (souvent http://localhost:3000).

## Commandes utiles

- npm run dev: lance le serveur de developpement Nuxt
- npm run build: build production Nuxt
- npm run preview: previsualise le build production
- npm run db:generate: genere les migrations Drizzle
- npm run db:push: pousse le schema Drizzle vers la base

## Etat de migration

Avancement actuel: migration backend vers full JS/Nitro en cours.

Fait:
- socle DB JS en place (Drizzle + DATABASE_URL)
- nouvelles tables JS pretes pour Neon Postgres
- endpoints compte/abonnement cote Nitro
- webhook Stripe cote JS

A faire ensuite:
- appliquer les migrations Drizzle sur tous les environnements
- seed des plans Stripe dans plans_js
- brancher l UI premium sur le statut abonnement serveur
- migrer les endpoints legacy estimation vers Nitro

## Legacy Symfony (optionnel)

La base Symfony reste disponible pendant la migration.

Si tu dois travailler sur la partie legacy:

```bash
composer install
php bin/console doctrine:migrations:migrate
symfony serve
```

## Contribution

Les contributions sont bienvenues.

1. Creer une branche feature
2. Commiter des changements atomiques
3. Ouvrir une pull request avec contexte, impact et tests

## Licence

Projet sous licence MIT.

👨‍💻 Développé avec ❤️ par @jeremiecode. (contact: contact@sassify.fr)