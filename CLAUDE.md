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
**Derniere session** : 2026-09-19
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
- Le domaine de prod (`stellara.sassify.fr`) n'est pas joignable depuis l'environnement de session Claude Code (egress proxy bloque). Pour tout audit/verification live, reconstruire en local (`npm ci && npm run build && node .output/server/index.mjs`) plutot que de supposer un acces direct au domaine.
- Piege useSeoMeta/useHead (trouve le 2026-09-17) : `useSeoMeta` avec un objet dont les valeurs sont des `computed()`/refs fonctionne, mais `useSeoMeta(() => ({...}))` (toute la fonction en argument) echoue silencieusement en SSR sur Nuxt 3.21.6 -- aucune erreur, juste aucune balise rendue. `useHead(() => ({...}))` accepte lui cette syntaxe sans probleme. Ne pas reproduire ce pattern sur une future page avec du contenu dynamique.
- LCP/FCP mobile ~3,5s sur l'accueil (audit du 2026-09-17, build local) : CSS Tailwind critique entierement inline dans le `<head>` + bundle JS principal ~188 Ko (~88 Ko de JS inutilise signale par Lighthouse). Pas encore traite, hors perimetre des correctifs deja faits.
- Piege `public.siteUrl` (trouve le 2026-09-17, en prod) : le fallback par defaut de `public.siteUrl` dans `nuxt.config.ts` est deja `'http://localhost:3000'` (pas vide) quand `NUXT_PUBLIC_SITE_URL` n'est pas defini. `composables/useSiteUrl.ts` reproduit la meme chaine de secours que `server/routes/sitemap.xml.ts` : valeur configuree (rejetee si elle ressemble a localhost) -> origine reelle de la requete via `useRequestURL()` (rejetee pareil) -> domaine prod en dur. Un premier correctif (meme jour) avait encore un bug : une 3e branche renvoyait quand meme la valeur configuree si elle-meme ET l'origine de la requete etaient toutes les deux localhost -- exactement le cas d'un test en loopback direct sur le process (`curl http://127.0.0.1:<port>/`, qui envoie lui-meme un Host localhost). Confirme en prod via SSH (VPS : `pm2 describe stellara` -> process bien redemarre au bon commit, port trouve via `ss -tlnp`, curl loopback direct sur le port reel -> canonical toujours `localhost:3000`) : c'etait un vrai bug de code, pas un cache CDN. Corrige en supprimant cette 3e branche (va direct au fallback en dur si configure ET requete sont tous les deux localhost). Verifie en local en reproduisant exactement les deux cas (loopback pur, et requete avec `Host`/`X-Forwarded-Proto` simulant un reverse-proxy). `server/routes/sitemap.xml.ts` a la meme structure a 3 branches avec le meme defaut theorique (`normalizeBaseUrl`) -- pas encore corrige, a traiter si ca devient un probleme concret (moins risque : le sitemap n'est jamais tape en loopback direct par un crawler).
- Brevo est appele independamment du statut DB/reportId (voir Decisions Prises 2026-06-23) : en cas de bug de synchronisation email, verifier d'abord le helper `server/utils/brevo.ts` isolement, pas la chaine DB.
- FAQ publique inexacte (trouve et corrige le 2026-09-17) : `components/FaqSection.vue` affirmait que Stellara utilise GPT-4o pour l'analyse IA, alors que `server/api/generate-report.post.ts` utilise exclusivement `claude-3-5-sonnet-latest` (Anthropic). Corrige en decrivant le mecanisme sans nommer de marque/modele precis ("un modele de langage avance"), meme choix que sur `pages/theme-astral-ia.vue`. Si un jour Stellara veut communiquer publiquement le nom exact du modele utilise, le mettre a jour aux deux endroits.

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
>
> 2026-08-27 (suite): Ajout d'un hook `Stop` scope au projet (`.claude/settings.json` + `.claude/hooks/memory-reminder.sh`, commit dans le repo). A chaque fin de tour, il compare les commits de code (hors CLAUDE.md/STORY.md/tasks/lessons.md) et les modifications non commitees depuis le dernier commit ayant touche un de ces fichiers memoire ; s'il y a du travail non reflete, il bloque une fois avec un rappel injecte dans le contexte de l'agent (une empreinte hors-repo dans `~/.claude/memory-hook-state/` evite tout re-declenchement sur un etat identique). Contrairement au hook global evoque dans le prompt de mise a jour memoire, celui-ci est local a stellara et ne s'applique a aucun autre projet.
>
> 2026-09-17: Debut d'un chantier SEO de fond (plusieurs sessions a venir). Ajout de 2 articles pillar dans `data/blog.json` : "Comment analyser la compatibilite amoureuse a partir de deux themes natals" (synastrie/composite, mot-cle a forte intention pour la conversion vers la Carte Natale Integrale) et "Obtenir et interpreter votre theme astral gratuit : guide pas a pas" (mot-cle haut de funnel/notoriete, gros volume attendu). Point d'attention produit : Stellara n'a pas de generateur de synastrie a deux entrees ; l'article sur la compatibilite reste honnete en presentant la "compatibilite" comme le profil d'affinites (Venus/Lune) du rapport complet, a comparer manuellement entre deux rapports individuels — ne pas laisser un futur article sous-entendre l'existence d'un outil de comparaison automatique tant qu'il n'est pas construit. Sujets encore en attente (fournis par l'utilisateur, a traiter dans de prochaines sessions) : transits planetaires, signe ascendant (verifier chevauchement avec l'article existant `ascendant-personnalite-image`, angle different demande si on le fait), signe lunaire (calcul pas a pas, pas encore couvert).
>
> 2026-09-17 (suite) : Ajout de 2 articles supplementaires : "Comprendre les transits planetaires et les lire dans votre theme natal" et "Calculer votre signe lunaire pas a pas". Sur le premier, attention au mapping produit : les transits en cours (suivi/alertes) ne sont proposes que par l'abonnement Orbite Premium, PAS par la Carte Natale Integrale (paiement unique) qui ne les liste pas dans ses features — l'article a ete ecrit en consequence, a respecter si un futur article evoque les transits. Retour utilisateur sur l'article compatibilite : ajout d'un mot-cle secondaire "classement des signes les plus compatibles en amour" (nouvelle section + metaDescription mise a jour), sans renommer le titre principal ni casser la structure existante — a garder comme reflexe pour les futurs retours ("mot-cle secondaire" = section additionnelle plutot que reecriture). Sujet ascendant (#4 de la liste) toujours volontairement laisse de cote (article existant `ascendant-personnalite-image` sous un angle different) ; a confirmer avec l'utilisateur si un second article dedie est vraiment souhaite.
>
> 2026-09-17 (suite 2) : Utilisateur confirme vouloir l'article ascendant malgre l'existant, angle "mot-cle pur". Ajout de "Signe ascendant ou signe solaire : quelle difference en astrologie et pourquoi cela change votre portrait" (`signe-ascendant-astrologie-difference-signe-solaire`), avec mini-profils par ascendant (Belier/Cancer/Balance/Capricorne), calcul et difference avec le signe solaire — angle definitionnel/comparatif distinct de `ascendant-personnalite-image` (qui reste centre sur la perception sociale), donc pas de doublon de contenu malgre le meme sujet racine. Chantier SEO des 5 sujets fournis par l'utilisateur desormais complet (5/5 articles publies dans `data/blog.json`).
>
> 2026-09-17 (suite 3) : Audit SEO technique complet (rendu, sitemap/robots, title/description/canonical/H1, Core Web Vitals mobile, structure d'URL). Le domaine prod est bloque par la politique reseau de l'environnement de session (egress proxy) : l'audit et les correctifs ont ete verifies contre un build local identique au pipeline de deploiement (`npm ci && npm run build`, puis `node .output/server/index.mjs`), pas contre la prod reelle — a re-verifier avec curl/PageSpeed sur `https://stellara.sassify.fr` une fois deploye. Bug critique trouve et corrige : `pages/blog/[slug].vue` appelait `useSeoMeta(() => ({...}))` (syntaxe fonction), qui ne rendait NI `<title>` NI `<meta description>` dans le HTML SSR sur les 12 pages d'articles — corrige en passant des `computed()` individuels comme valeurs du meme objet `useSeoMeta({...})` (pattern qui, lui, fonctionne). Verifie par curl brut sur 3 articles apres coup. Ajout d'une balise canonical (via `useHead`) sur les 8 pages qui n'en avaient pas (`/`, `/account`, `/horoscope-du-jour`, `/lexique`, `/rapport`, `/blog`, `/signes-astrologiques`, `/checkout/success`), factorisee dans un nouveau composable `composables/useSiteUrl.ts` (meme logique que celle deja utilisee dans `blog/[slug].vue`) ; sur l'accueil le canonical est une valeur statique (le domaine nu), donc les variantes `/?ref=xxx` du tracking d'affiliation pointent toutes vers la meme URL propre. `/account` et `/checkout/success` sortis du sitemap (`server/routes/sitemap.xml.ts`, nouvelle liste `EXCLUDED_ROUTES`) et passes en `robots: 'noindex'`. Point encore ouvert, non traite dans cette session (hors perimetre demande) : LCP/FCP mobile a ~3,5s sur l'accueil (CSS Tailwind critique entierement inline + bundle JS principal ~188 Ko) — a traiter dans une session dediee perf si besoin.
>
> 2026-09-17 (suite 4) : Utilisateur signale en prod que le canonical (ajoute dans la session precedente) pointe vers `http://localhost:3000/...` au lieu du vrai domaine, sur l'accueil, `/blog` et un article. Cause reelle identifiee dans le code, sans acces au VPS (pas de credentials SSH dans cette session) : `public.siteUrl` a lui-meme un fallback par defaut `'http://localhost:3000'` dans `nuxt.config.ts`, donc meme sans `NUXT_PUBLIC_SITE_URL` defini, la valeur n'est jamais vide -- le `configuredUrl || fallback` naif de `useSiteUrl.ts` ne se declenchait donc jamais. Premier correctif verifie en local uniquement (simulation d'env vars absentes + requete avec `Host`/`X-Forwarded-Proto` factices) — pas d'acces SSH pour confirmer en conditions reelles.
>
> 2026-09-17 (suite 5) : Le premier correctif ne suffisait pas. Diagnostic mene en collaboration avec l'utilisateur qui avait un acces SSH reel au VPS (root@72.62.182.36) — cette session n'a jamais eu cet acces, tout le diagnostic distant a ete fait via des commandes demandees a l'utilisateur puis interpretees ici. Etapes : (1) verifie via l'API GitHub Actions (`mcp__github__actions_get`) que le bon commit etait bien deploye avec succes a 09:14 UTC -- ecarte l'hypothese "mauvais commit/branche" ; (2) demande a l'utilisateur un curl en loopback direct sur le process (`ss -tlnp` pour trouver le port reel 3010, puis `curl http://127.0.0.1:3010/`) pour trancher entre cache CDN/nginx et bug de code -- resultat toujours localhost, ce qui pointait vers un vrai bug ; (3) analyse : ce test loopback envoie lui-meme un Host localhost, ce qui declenchait une 3e branche de secours dans `useSiteUrl.ts` qui renvoyait quand meme la valeur configuree meme si elle ressemblait a localhost, tant que la requete ETAIT AUSSI localhost. Corrige en supprimant cette branche. Voir "Blocages et Points d'Attention" pour le detail. `server/routes/sitemap.xml.ts` a la meme faiblesse theorique dans `normalizeBaseUrl`, non corrigee (risque plus faible, un crawler ne tape jamais le sitemap en loopback). Point de process a retenir : quand un fix "verifie en local" echoue en prod, demander un test en loopback direct sur le VPS (sans passer par nginx/CDN) permet de trancher rapidement entre probleme d'infra et bug de code reel -- fait ici via des allers-retours de commandes/resultats colles par l'utilisateur, faute d'acces SSH direct.
>
> 2026-09-17 (suite 6) : Nouvelle page SEO `/theme-astral-ia` (mot-cle principal "theme astral IA gratuit", secondaire "astrologue IA personnalise"). URL choisie sans l'accent suggere par l'utilisateur (`/theme-astral-ia` plutot que `/thème-astral-ia`) pour rester coherent avec les autres routes du site (`mentions-legales`, `horoscope-du-jour`, etc., toutes en ASCII pur). Title/description/canonical/H1 unique/FAQPage JSON-LD en place, verifie en local (longueurs de title/description calculees, HTML SSR inspecte). Maillage : ajoutee au menu "Explorer astro" (`NavBar.vue`, `resourceLinks`) et en lien contextuel dans l'intro de la section "Pourquoi Stellara" (`BenefitsSection.vue`) ; la page elle-meme fait un lien contextuel vers `/rapport`. Sitemap : verifiee, la page apparait automatiquement (scan de `pages/` dans `sitemap.xml.ts`, aucune modification necessaire). Reutilise `composables/useSiteUrl.ts` sans rien recoder. Point important : l'utilisateur a demande de reutiliser factuellement la FAQ existante sur l'IA (`FaqSection.vue`), qui affirme que Stellara utilise GPT-4o — verification dans le code (`server/api/generate-report.post.ts`) : le rapport natal utilise en realite exclusivement Claude 3.5 Sonnet (Anthropic), jamais GPT-4o (GPT-4o-mini n'existe que comme fallback pour la localisation de l'horoscope du jour, une feature differente). La FAQ existante contenait donc une affirmation technique fausse. Sur la nouvelle page, le contenu evite de reprendre cette erreur : decrit le mecanisme (calcul astronomique -> synthese par "un modele de langage avance") sans nommer de marque/modele specifique.
>
> 2026-09-17 (suite 7) : Utilisateur confirme que c'etait bien une erreur. `components/FaqSection.vue` corrigee : la reponse "Comment fonctionne l'analyse par intelligence artificielle" ne mentionne plus GPT-4o, meme formulation neutre que sur `/theme-astral-ia` ("un modele de langage avance"). Verifie : plus aucune occurrence de "GPT-4o" dans le code source ni dans le bundle client build. Point ouvert pour une session future si l'utilisateur veut un jour communiquer publiquement le nom exact du modele utilise (Claude 3.5 Sonnet) : mettre a jour aux deux endroits (`FaqSection.vue` et `theme-astral-ia.vue`) en meme temps pour eviter une nouvelle divergence. Note : hors session, `main` a ensuite recu 2 commits ("comment out AI analysis question in FAQ section") qui commentent completement cette question au lieu de la reformuler -- constate au debut de la session suivante, pas fait par cet agent, laisse tel quel (l'ancien texte GPT-4o reste dans le commentaire, inoffensif tant qu'il n'est pas decommente sans etre corrige en meme temps).
>
> 2026-09-18 : Analyse d'un rapport d'outil SEO externe (titres courts, word count faible, pages "bloquees", URLs "mal formatees") sur `/account`, `/checkout/success`, `/horoscope-du-jour`, `/rapport`. Verdict par point, rien corrige sans validation prealable de l'utilisateur : (1) pages bloquees par robots.txt (`/api/stripe/...`) et noindex (`/mentions-legales`) sont intentionnelles, aucun changement fait ; (2) titles courts sur `/account` et `/checkout/success` sans impact reel (deja noindex depuis la session du 2026-09-17) ; (3) word count faible sur `/horoscope-du-jour` et `/rapport` est structurel -- ce sont des pages-outils dont le contenu reel (lecture d'horoscope, rapport genere) n'existe qu'apres action utilisateur et n'apparait donc pas dans le HTML statique scanne par l'outil, verifie en lisant le template ; la cible de 2200 mots suggeree par Ubersuggest jugee inadaptee a ce type de page (pas suivie) ; (4) URLs "sans mot-cle" sur `/account`, `/checkout/success`, `/rapport` jugees a ne pas renommer : `/rapport` est reference a 12 endroits dans le code, `/checkout/success` est le `success_url` code en dur dans l'appel Stripe (`server/api/stripe/create-checkout-session.get.ts`) -- renommer casserait le tunnel de paiement sans redirection 301, `/account` est deja noindex. Utilisateur a valide uniquement le point (2)+(3) sur `/horoscope-du-jour` et `/rapport` : titles enrichis en mots-cles ("Thème Natal Gratuit en 30 Secondes — Stellara", "Horoscope du Jour Gratuit par Signe — Stellara") et ~100-110 mots de texte explicatif ajoutes sur chaque page (pas du remplissage : definition du concept + lien contextuel croise entre les deux pages). Verifie en local : titles corrects en HTML SSR, texte ajoute bien present et rendu correctement.
>
> 2026-09-19 : Lancement du chantier "12 pages piliers signes astrologiques". Avant toute redaction, compilation d'une table de reference factuelle (table de base 12 signes : element/modalite/planete maitresse/mots-cles, plus 144 combinaisons signe x ascendant avec 2-3 points de nuance concrets chacune) -- verifie qu'aucune table de ce type n'existe deja dans le prompt IA (`server/utils/report-sections.ts`, entierement dynamique, pas de base de connaissances statique) ; reprise des donnees deja publiees sur `pages/signes-astrologiques.vue` (element/modalite/essence/force/vigilance) pour rester coherent avec le site, planetes maitresses ajoutees (conventions standards, absentes du code). Table livree en fichier Markdown, validee par l'utilisateur. Premiere page pilier `/belier` (`pages/belier.vue`) creee sur ce modele : chaque ligne de la table developpee en paragraphe de 3-4 phrases avec exemple concret de manifestation au quotidien (reunion, negociation, conflit...), pas une reformulation de la ligne -- consigne explicite de l'utilisateur pour eviter le pattern de contenu genere en masse. Point de vigilance a repercuter sur les 11 autres pages : la ligne "ascendant = meme signe" ne doit pas reprendre la meme formule syntaxique d'une page a l'autre (sur `/belier`, ouverture choisie : "Avec l'ascendant en Bélier, l'élan du signe solaire..." -- varier sur les pages suivantes). Page verifiee (build local, canonical, H1 unique, 12 H3, sitemap auto-inclus) et poussee sur la branche `seo-titles-copy` (pas `main`) en attente de validation utilisateur avant de repliquer sur les 11 signes restants. Volontairement pas encore linkee depuis le hub `pages/signes-astrologiques.vue` -- prevu en un seul batch une fois les 12 pages pretes.

---

## Regle de memoire narrative
Apres toute session impliquant une decision business, un pivot, un
changement de statut, ou un apprentissage terrain significatif (pas les
changements purement techniques), mettre a jour /STORY.md en
consequence, en plus des notes de session habituelles.
