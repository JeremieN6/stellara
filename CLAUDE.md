# CLAUDE.md -- Memoire Projet

> Ce fichier est lu automatiquement par l'IA au debut de chaque conversation.
> Mets-le a jour a la fin de chaque session de travail.

---

## Objectif Final
Stellara genere des themes natals personnalises par IA (rapport payant) et
convertit du trafic gratuit (horoscope du jour, lexique astro, blog) en
utilisateurs, abonnes, et affilies.

---

## Stack Technique
- Nuxt 3 / Nitro (backend et frontend unifies, full JS)
- Drizzle ORM + Neon Postgres (`server/utils/db.ts`, schema dans `db/schema.ts`, migrations dans `drizzle/`)
- Stripe (paiement + webhook `server/api/stripe/webhook`)
- Brevo (emailing/CRM, `server/utils/brevo.ts`)
- Auth par magic link (`server/utils/auth-session.ts`, table `auth_magic_links`)
- Astrology API externe pour l'horoscope du jour (`server/utils/astro.ts`)
- Deploiement : PM2 + systemd sur serveur distant, via GitHub Actions (`.github/workflows/deploy.yml`)
- Pinia (state front), Tailwind CSS

---

## Etat Actuel du Projet
**Phase** : Produit en croissance -- migration backend full JS terminee sur le socle, extension des features acquisition/conversion (horoscope, lexique, affiliation, blog) et fiabilisation du deploiement
**Derniere session** : 2026-08-27
**Progression globale** : 55%

### Ce qui est fait :
- [x] Backend Nuxt/Nitro + DB Drizzle/Neon comme source de verite (tables JS : `users_js`, `plans_js`, `subscriptions_js`, `invoices_js`)
- [x] Migrations Drizzle generees et appliquees (`drizzle/0000` a `0007`)
- [x] Persistance des rapports + statut backend (`POST /api/generate-report`, `GET /api/backend-status`)
- [x] Compte/abonnement : `GET /api/user/profile`, `GET /api/user/subscription-status`
- [x] Webhook Stripe JS avec verification de signature
- [x] Auth par magic link (session, table `auth_magic_links`)
- [x] Capture email + integration Brevo (sync contact, decouplee du statut DB, cf notes 2026-06-23)
- [x] Systeme d'affiliation complet : tables (`affiliates`, `affiliate_clicks`, `affiliate_sales`, `affiliate_admin_actions`), dashboard admin, pages publiques `/affilie`
- [x] Lead sequence management + dashboard admin
- [x] Tracking de la source d'acquisition sur les leads/rapports (migration 0007)
- [x] Horoscope du jour via Astrology API, cache journalier (`horoscope_cache`), acces discret header/footer
- [x] Rapports enrichis : lecture des maisons astrologiques, resumes de secours, sections thematiques
- [x] Blog Nuxt (source JSON statique `data/blog.json`, routes `pages/blog/*`), articles ponctuels (ex: eclipse solaire aout 2026)
- [x] Page Lexique astro (`pages/lexique.vue`) + fiches detaillees des 12 signes
- [x] SEO : sitemap.xml / robots.txt dynamiques, garde-fous anti-URL localhost en prod
- [x] Deploiement durci : PM2 + fallback systemd, attente sante PM2, preservation de `start-stellara.sh` pendant `git clean`, tracking de version de deploiement

### Prochaines etapes :
- [ ] Seed des plans Stripe dans `plans_js`
- [ ] Connecter completement l'UI premium a `GET /api/user/subscription-status`
- [ ] Migrer les endpoints legacy `/api/estimation*` (si encore presents) vers Nitro
- [ ] Horoscope premium/detaille reserve aux abonnes (brainstorme, pas demarre)
- [ ] Verifier la robustesse du pipeline de deploiement apres les multiples revert/fix de juillet (`deploy.yml` a stabilise le 2026-07-13, a re-tester en conditions reelles)

### Ecarte pour l'instant :
- Coexistence Symfony -- la migration progressive vers full JS reste la ligne directrice, pas de retour arriere prevu.

---

## Blocages et Points d Attention
- Le pipeline de deploiement a connu plusieurs allers-retours le 2026-07-13 (enhance -> revert -> re-enhance -> chore "forcer runtime PM2 uniquement"). Verifier l'etat reel de `deploy.yml` avant toute modification, ne pas supposer qu'une ancienne version documentee ici est toujours d'actualite.
- Brevo est appele independamment du statut DB/reportId (voir Decisions Prises 2026-06-23) : en cas de bug de synchronisation email, verifier d'abord le helper `server/utils/brevo.ts` isolement, pas la chaine DB.

---

## Decisions Prises
| Date | Decision | Raison |
|------|----------|--------|
| 2026-05-21 | Runtime backend cible = Nuxt/Nitro (full JS) | Aligner backend et frontend sur une stack unique et simplifier la maintenance |
| 2026-05-21 | Migration progressive (coexistence temporaire Symfony) | Eviter une rupture brutale en production et migrer domaine par domaine |
| 2026-05-21 | Source de verite DB future = Drizzle + Neon Postgres | Uniformiser schema/migrations cote JS |
| 2026-06-22 | Integration Brevo sur la capture d'email du rapport | Automatiser le suivi commercial des leads (prenom/signe/lune/ascendant) |
| 2026-06-23 | Decouplage Brevo de la DB (appel immediat, independant du statut/reportId) | Garantir la reception du contact meme en cas d'indisponibilite DB |
| 2026-06-21 | Ajout d'un systeme d'affiliation (tables + dashboard admin + pages publiques) | Ouvrir un canal d'acquisition via partenaires/affilies |
| 2026-06-22 | Auth par magic link plutot que mot de passe | Simplifier l'onboarding et reduire la friction de connexion |
| 2026-07-04 | Horoscope du jour branche sur une Astrology API externe avec cache journalier | Fiabiliser le contenu gratuit d'acquisition sans generation IA a chaque requete |
| 2026-07-13 | Deploiement fige sur PM2 uniquement (systemd en fallback documente mais pas pilote) | Stabiliser apres plusieurs incidents de deploiement le meme jour |
| 2026-07-23 | Ajout du tracking de source d'acquisition sur les leads/rapports | Mesurer l'efficacite des canaux (blog, affilies, horoscope) |

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
>
> 2026-06-21 a 2026-06-23: Mise en place du systeme d'affiliation (tables, dashboard admin avec logging des actions, pages publiques `/affilie`, gestion de remises acheteur et liens de partage), de l'auth par magic link, et de la gestion des sequences de leads (dashboard admin dedie).
>
> 2026-07-02 a 2026-07-05: Integration de l'Astrology API pour l'horoscope du jour (refactor de la gestion des cles API et variables d'environnement), ajout de fiches detaillees pour les 12 signes du zodiaque (navigation + FAQ), et de la page Lexique astro.
>
> 2026-07-13: Journee dediee a la fiabilisation du deploiement (PM2 + tentative systemd, plusieurs revert/fix successifs) et a l'enrichissement des rapports avec des sections thematiques. Voir "Blocages et Points d'Attention" -- verifier l'etat reel de `deploy.yml` avant toute nouvelle modification.
>
> 2026-07-23: Ajout du tracking de la source d'acquisition sur les leads et les rapports (migration 0007), pour mesurer quels canaux (blog, affilies, horoscope) convertissent.
>
> 2026-08-09: Article de blog detaille sur l'eclipse solaire du 12 aout 2026 (conseils d'observation + eclairage astrologique), dans la continuite de la strategie de contenu SEO/acquisition du blog.
>
> 2026-08-27: Remise a niveau de la memoire projet (CLAUDE.md). Ecart de 2 mois entre la derniere mise a jour (2026-06-23) et le dernier commit (2026-08-09) : 27 commits non refletes couvrant l'auth magic link, l'affiliation, l'horoscope via Astrology API, le lexique astro, le SEO/sitemap, la fiabilisation du deploiement, et le tracking d'acquisition. Contenu verifie contre `git log`, `db/schema.ts`, `drizzle/`, `package.json` et l'arborescence `server/`. Creation de STORY.md en parallele.

---

## Regle de memoire narrative
Apres toute session impliquant une decision business, un pivot, un
changement de statut, ou un apprentissage terrain significatif (pas les
changements purement techniques), mettre a jour /STORY.md en
consequence, en plus des notes de session habituelles.
