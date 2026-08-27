# STORY.md -- Memoire Narrative

> Ce fichier raconte le projet pour un public exterieur (article de blog,
> presentation, retro). Il ne remplace pas CLAUDE.md : aucun detail
> d'implementation ici, seulement le pourquoi et le contexte business.

---

## Objectif produit
Stellara aide les gens a comprendre leur theme astral grace a des rapports
personnalises generes par IA, avec un parcours gratuit (horoscope du jour,
lexique astro, blog) pensé pour amener vers un rapport payant et un
abonnement.

---

## Statut actuel
Le produit est en croissance active. Le socle technique (backend, paiement,
compte utilisateur) est stable et le produit s'etend maintenant sur
plusieurs fronts en parallele : contenu gratuit pour attirer du trafic
(horoscope du jour, lexique, blog), un canal d'affiliation pour recruter
des apporteurs d'affaires, et un suivi plus fin de l'origine des leads pour
savoir quels canaux marchent vraiment.

---

## Historique des pivots

### Migration vers une stack full JS (mai 2026)
**Contexte** : le backend reposait sur une stack separee du frontend,
compliquant la maintenance.
**Decision** : faire converger tout le backend vers Nuxt/Nitro, avec une
migration progressive plutot qu'une bascule brutale, pour ne pas casser la
production.
**Resultat** : le socle (comptes, abonnements, paiement) tourne desormais
sur cette base unifiee ; la migration continue domaine par domaine.

### Ouverture d'un canal d'affiliation (juin 2026)
**Contexte** : le produit avait besoin de canaux d'acquisition au-dela du
trafic direct.
**Decision** : construire un systeme d'affiliation complet (suivi des
clics, des ventes, remises pour l'acheteur, dashboard admin) plutot que de
passer par un outil tiers.
**Resultat** : ouvre la voie a des partenaires qui relaient Stellara contre
commission, avec un suivi interne complet des performances.

### Contenu gratuit comme porte d'entree (juin-juillet 2026)
**Contexte** : convertir un visiteur froid directement vers un rapport
payant est difficile.
**Decision** : investir dans du contenu gratuit a forte valeur perçue
(horoscope du jour quotidien, lexique astro, fiches detaillees par signe,
articles de blog evenementiels comme l'eclipse d'aout 2026), positionne
discretement dans le header/footer plutot qu'en avant-plan agressif.
**Resultat** : un flux de contenu regulier qui sert a la fois le SEO et la
familiarisation progressive avec la marque, avant de proposer l'abonnement.
Une piste encore a l'etude : un horoscope plus detaille reserve aux
abonnes payants.

### Fiabilisation du deploiement (13 juillet 2026)
**Contexte** : plusieurs incidents de deploiement le meme jour ont montre
que le pipeline n'etait pas assez robuste pour la frequence de mise a jour
du produit.
**Decision** : figer temporairement sur un runtime unique et ajouter des
verifications de sante avant de considerer un deploiement reussi, quitte a
revenir en arriere plusieurs fois dans la journee pour retrouver un etat
stable.
**Resultat** : un pipeline plus previsible, mais qui merite d'etre re-teste
en conditions reelles avant d'etre considere definitivement solide.

### Mesurer l'origine des leads (23 juillet 2026)
**Contexte** : avec plusieurs canaux actifs en parallele (blog, affilies,
horoscope), il devenait impossible de savoir lequel convertissait
reellement.
**Decision** : ajouter un suivi de la source d'acquisition sur chaque lead
et chaque rapport genere.
**Resultat** : permet desormais d'orienter les efforts (contenu, affiliation,
produit) en fonction de donnees plutot que d'intuition.

---

## Ce que la cible attend / a appris
- Les visiteurs reagissent bien a un point d'entree gratuit et discret
  (horoscope du jour) plutot qu'a une demande immediate de paiement.
- La friction sur la capture d'email doit rester minimale : un patch
  recent a d'ailleurs decouple l'envoi vers l'outil d'emailing du reste du
  parcours technique, precisement pour ne jamais perdre un contact a cause
  d'un probleme technique cote serveur.
- L'affiliation est encore jeune : pas encore de recul chiffre verifie sur
  sa contribution reelle au chiffre d'affaires (a mesurer via le tracking
  d'acquisition mis en place en juillet).

---

## Garde-fous de contenu
- Ne jamais publier de chiffre financier precis (revenus, taux de
  conversion, cout d'acquisition) sans indiquer sa source ou le marquer
  "a verifier" -- aucun chiffre de ce type n'est aujourd'hui source dans
  le projet.
- Ne pas detailler la mecanique interne de l'affiliation, du tracking
  d'acquisition ou du pipeline de deploiement de facon a fournir une
  feuille de route exploitable par un concurrent.
- Ne pas mentionner d'incident de production (comme les allers-retours du
  13 juillet 2026) avec des details techniques exploitables (noms de
  scripts, commandes) dans un contenu externe -- rester au niveau du
  "on a renforce la fiabilite du deploiement".
- Garder un ton respectueux envers la cible (personnes interessees par
  l'astrologie) : ne jamais laisser transparaitre un ton condescendant ou
  sceptique sur le sujet dans un contenu publie sous le nom de Stellara.

---

## Derniere mise a jour
2026-08-27 -- creation initiale du fichier, contenu reconstruit et
verifie a partir de l'historique git reel (voir CLAUDE.md pour le detail
technique correspondant).
