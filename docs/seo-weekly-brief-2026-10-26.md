# Brief SEO — suivi hebdomadaire (26/10/2026)

> À lire en arrivant sur le projet. Résume l'état des lieux du rapport SEO du 26/10 et ce qui a été fait / reste à faire en réponse.

## Contexte

Rapport hebdomadaire automatisé (Search Console, fenêtre 26/09–23/10) : stagnation sur 3 semaines à 0 clic (~50 impressions au total). Diagnostic clé : **ce n'est pas un problème de titre/CTR, c'est un problème de visibilité**. Une page en position ~70 n'est quasiment jamais vue — retoucher son titre n'y changerait rien. Il faut d'abord remonter vers la première page, via des signaux d'autorité (maillage interne, backlinks), pas du texte.

| Page | Avant | Après (23/10) | Requêtes notables |
|---|---|---|---|
| `/rapport` | 1 impression, position 83 | 8 impressions, position 57 | "thème natal gratuit" (pos. 49), "thème astral gratuit" (pos. 68) |
| `/blog/calculer-signe-lunaire-methode-pas-a-pas` | 44 impressions, position ~71 | 39 impressions, position ~70 | Aucune requête en top 20 |
| Accueil sassify | 16 impressions | 9 impressions | Sous le seuil |

4 leviers avaient été proposés (du plus rapide au plus lourd). **Les 4 ont maintenant été traités ou qualifiés**, voir ci-dessous.

## Ce qui a été fait (commits sur `main`)

### Point 1 — Maillage interne vers l'article signe lunaire (`d3646c0`)
3 liens contextuels ajoutés avec l'ancre exacte **"calculer son signe lunaire"** :
- Accueil (`components/BenefitsSection.vue`)
- `/rapport` (nouveau paragraphe)
- `/blog/theme-astral-gratuit-guide-pas-a-pas` (nouvel encart "À lire aussi")

### Point 2 — Anti-cannibalisation `/rapport` ↔ `/theme-astral-ia` (`ba70ee4`)
Les deux pages se chevauchaient sur le cluster "thème astral/natal gratuit" sans aucun lien entre elles. Ajouté un lien croisé dans chaque sens :
- `/rapport` → `/theme-astral-ia` (ancre : "thème astral IA")
- `/theme-astral-ia` → `/rapport` (déjà existant une fois, renforcé par le point 3)

Objectif : signaler à Google une répartition claire — `/theme-astral-ia` = page informationnelle de référence, `/rapport` = page de conversion (l'outil lui-même).

**Titles et meta descriptions n'ont pas été touchés** sur les deux pages (risque de reset de signal jugé supérieur au bénéfice) — seul du contenu et des liens ont été ajoutés.

### Point 3 — Cibler "thème natal gratuit" (`ba70ee4`, même commit)
C'est la requête où Stellara est le mieux placé (position 49), avec un volume probablement supérieur à celui du signe lunaire. Ajouté une section H2 dédiée sur `/theme-astral-ia` : **"Thème natal gratuit ou thème astral gratuit : même chose ?"**, qui affirme explicitement la synonymie des deux termes et cross-link vers `/rapport`. Pas de nouvelle page créée (suivant la recommandation du rapport).

### Point 4 — Backlink depuis sassify.fr
**Non fait.** sassify.fr n'est pas dans le dépôt `stellara` — aucun accès à son code depuis cette session. Reste une action manuelle :
- soit ajouter un lien contextuel depuis une page de sassify.fr vers stellara.sassify.fr,
- soit, si sassify.fr a son propre dépôt accessible, le préciser pour qu'une session future puisse le faire.

## À surveiller dans 2-3 semaines

- `/rapport` : vérifier si les positions sur "thème astral gratuit" / "thème natal gratuit" continuent de progresser (8 impressions ne prouvent encore rien).
- Article signe lunaire : vérifier si le maillage interne (point 1) a un effet mesurable sur la position (~70) — à ce niveau de profondeur, l'effet du maillage interne seul reste limité sans backlinks.
- Site globalement jeune : Google peut mettre plusieurs mois à classer un domaine neuf, donc ne pas tirer de conclusion définitive avant d'avoir plus de données.

## Pas touché / laissé en l'état

- Titles et meta descriptions de `/rapport` et `/theme-astral-ia` (déjà optimisés le 2026-09-30, pas remis en cause).
- Aucune nouvelle page créée.
- Aucune logique métier (calcul du thème natal) modifiée.
