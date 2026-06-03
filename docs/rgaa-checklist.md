# Checklist RGAA 4.1.2 - SWAAN

Ce document sert de support de cours et de suivi. Il ne remplace pas un audit RGAA officiel, mais il liste les techniques appliquées dans le projet avec les connaissances vues en cours.

## Corrections appliquees

### 1. Images

- Les illustrations utiles ont un texte alternatif descriptif.
- Les SVG purement decoratifs sont masques avec `aria-hidden="true"` et `focusable="false"`.
- Les images de signes gardent un `alt` utile pour comprendre le contenu.
- Les videos du dictionnaire ont un controle natif via l'attribut `controls`.

### 2. Cadres

- Aucun `iframe` n'est utilise actuellement.
- Pas de correction necessaire tant que le site ne contient pas de cadre.

### 3. Couleurs

- Les etats interactifs ne reposent pas uniquement sur la couleur : ombres, contour de focus, changement de relief et texte accompagnent les retours.
- Un focus clavier visible a ete ajoute globalement avec `:focus-visible`.
- Les messages d'erreur et de succes utilisent aussi du texte, pas seulement une couleur.

### 4. Multimedia

- Les videos de signes sont prevues avec controles utilisateur.
- A faire lors de l'ajout des vraies videos : ajouter une transcription textuelle ou une explication equivalente du signe.
- A faire si une video contient de l'audio : fournir sous-titres et/ou transcription.

### 5. Tableaux

- Le projet utilise surtout des cartes et des grilles, pas de vrais tableaux de donnees.
- Si une page RH devient un vrai tableau, il faudra utiliser `<table>`, `<caption>`, `<th scope="col">` et des en-tetes clairs.

### 6. Liens

- Les liens principaux ont des intitules comprehensibles : `Demander une demo`, `Voir les offres`, `Tous les jeux`, etc.
- Les liens de navigation sont regroupes dans des zones `nav` avec un nom accessible.
- Les liens du footer ont ete clarifies quand le libelle pouvait etre ambigu.

### 7. Scripts

- Les contenus modifies par JavaScript dans les jeux et formulaires utilisent `role="status"` et `aria-live="polite"` quand c'est utile.
- Les boutons de jeu ont un `type="button"` pour eviter les comportements implicites.
- Les cartes du memory indiquent leur etat avec `aria-pressed`.
- Les animations respectent `prefers-reduced-motion`.

### 8. Elements obligatoires

- Le document utilise `<!doctype html>`.
- La langue principale est declaree avec `<html lang="fr">`.
- Les pages passent par le layout Astro avec un `title` et une `description`.
- Les balises SEO principales sont presentes : description, canonical, Open Graph, Twitter card.

### 9. Structuration de l'information

- Les pages principales utilisent un `<main>`.
- Les titres suivent une structure lisible avec un `h1` principal par page.
- Les fils d'Ariane sont identifies avec `aria-label="Fil d'Ariane"`.
- Les listes de navigation sont structurees en `<ul>` dans le header et le footer.

### 10. Presentation de l'information

- Le site reste responsive avec Tailwind.
- Le contenu est visible sans interaction complexe.
- Le focus clavier est visible.
- Les animations sont reduites si l'utilisateur demande moins de mouvement.
- La page `demande-demo` a deux zones scrollables independantes sur desktop pour eviter de bloquer la lecture d'un cote pendant qu'on parcourt le formulaire.

### 11. Formulaires

- Les champs ont des labels visibles.
- Les champs obligatoires utilisent `required`.
- Les formulaires critiques affichent des messages d'erreur avec `role="alert"`.
- Les messages de succes sont annonces avec `role="status"` et `aria-live="polite"`.
- Les types de champs sont adaptes : `email`, `tel`, `url`, `file`, `select`, etc.

### 12. Navigation

- Un lien d'evitement `Aller au contenu principal` est present sur toutes les pages.
- La navigation principale et la navigation de l'espace apprenant ont un nom accessible.
- Le lien actif de l'espace apprenant utilise `aria-current="page"`.
- L'ordre de tabulation suit l'ordre visuel principal.

### 13. Consultation

- Pas de limite de temps imposee.
- Pas de geste complexe obligatoire.
- Le site fonctionne en orientation portrait et paysage grace au responsive.
- Les fonctions principales restent utilisables au clavier.

## Points a verifier manuellement avant rendu final

- Tester toutes les pages au clavier : `Tab`, `Shift + Tab`, `Enter`, `Espace`.
- Verifier les contrastes exacts avec un outil de contraste, surtout les textes `text-soft`.
- Ajouter les transcriptions quand les vraies videos LSF seront integrees.
- Tester avec un lecteur d'ecran si possible.
- Valider le HTML final avec un validateur.
- Rediger une declaration d'accessibilite seulement si un audit complet est fait.
