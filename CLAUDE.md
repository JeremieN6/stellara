# CLAUDE.md -- Memoire Projet

> Ce fichier est lu automatiquement par l'IA au debut de chaque conversation.
> Mets-le a jour a la fin de chaque session de travail.

---

## Objectif Final
<!-- A completer -->

---

## Stack Technique
<!-- A completer -->

---

## Etat Actuel du Projet
**Phase** : Migration backend vers Full JS
**Derniere session** : 2026-05-21
**Progression globale** : 20%

### Ce qui est fait :
- [x] Configuration MCP memoire
- [x] Base backend Nuxt/Nitro confirmee comme runtime principal
- [x] Couche DB JS ajoutee (Drizzle + DATABASE_URL via `server/utils/db.ts`)
- [x] Persistance des rapports dans `POST /api/generate-report`
- [x] Endpoint de statut backend `GET /api/backend-status`
- [x] Tables JS pretes pour Neon Postgres (`users_js`, `plans_js`, `subscriptions_js`, `invoices_js`)
- [x] Endpoints compte/abonnement: `GET /api/user/profile`, `GET /api/user/subscription-status`
- [x] Webhook Stripe JS: `POST /api/stripe/webhook` avec verification signature
- [x] Section blog Nuxt ajoutee avec source JSON statique (`data/blog.json`) et routes `pages/blog/*`

### Prochaines etapes :
- [ ] Generer/appliquer les migrations Drizzle pour les nouvelles tables JS
- [ ] Seed des plans Stripe dans `plans_js`
- [ ] Connecter l UI premium a `GET /api/user/subscription-status`
- [ ] Migrer les endpoints legacy `/api/estimation*` vers Nitro
- [ ] Enrichir le blog avec une mise en avant croisee depuis les pages de conversion si besoin

---

## Blocages et Points d Attention
<!-- Lister ici -->

---

## Decisions Prises
| Date | Decision | Raison |
|------|----------|--------|
| 2026-05-21 | Runtime backend cible = Nuxt/Nitro (full JS) | Aligner backend et frontend sur une stack unique et simplifier la maintenance |
| 2026-05-21 | Migration progressive (coexistence temporaire Symfony) | Eviter une rupture brutale en production et migrer domaine par domaine |
| 2026-05-21 | Source de verite DB future = Drizzle + Neon Postgres | Uniformiser schema/migrations cote JS |

---

## Notes de Session
> 2026-05-21: Ajout d'un acces discret a l'horoscope du jour dans le header et le footer, avec endpoint Nuxt dedie, cache journalier et fallback IA. La suite a brainstormer est un bundle premium / abonnement pour un horoscope plus detaille reserve aux utilisateurs payants.
>
> 2026-05-21: Lancement concret de la migration full JS. Mise en place du socle DB JS dans Nitro, ajout des tables core (users/plans/subscriptions/invoices), nouveaux endpoints account/subscription, et webhook Stripe cote Nuxt avec verification de signature. Prochaine etape: migrations Drizzle + branchement UI premium sur statut abonnement serveur.
>
> 2026-06-22: Integration Brevo ajoutee sur la capture d'email du rapport. Le contact est synchronise avec PRENOM/SIGNE_ASTRO/LUNE/ASCENDANT et ajoute a la liste d'automation, via un helper serveur non bloquant avec timeout et fallback silencieux.
>
> 2026-06-23: Correctif persistance prenom. Lors de /api/report/capture-email, le prenom est maintenant normalise puis upsert dans users_js.first_name (en plus de reports et lead_magnet_contacts), pour alimenter correctement les attributs de campagne email.
>
> 2026-06-23 (suite): Patch decouplage Brevo. Brevo est maintenant appelé immédiatement et indépendamment du statut DB, reportId ou lead_magnet_contacts. Front retire la dépendance reportId avant d'appeler capture-email. Garantit que Brevo reçoit le contact même en cas d'indisponibilité DB.
