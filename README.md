# Younes Kamouly Portfolio

Portfolio React + Vite, bilingue FR/EN, avec admin local et formulaire de contact via Formspree.

## Stack
- React 18
- Vite 5
- Tailwind CSS
- Framer Motion
- Zustand

## Installation
```bash
npm install
npm run dev
```

## Variables d'environnement
Créer un fichier `.env` à la racine:

```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
VITE_ADMIN_USER=admin
VITE_ADMIN_PASS=admin
```

Optionnel (fallback contact):
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Scripts
```bash
npm run dev
npm run build
npm run preview
```

## Déploiement Vercel
Le projet contient `vercel.json` (SPA rewrite) pour supporter les routes React (`/admin`, etc.).

Après import sur Vercel:
1. Vérifier que la branche `main` déploie en Production.
2. Ajouter `VITE_FORMSPREE_ENDPOINT` dans les Environment Variables.
3. Redéployer.

## Admin
- URL: `/admin/login`
- Identifiants par défaut: `admin / admin` (à changer en prod via `.env`)

## Notes utiles
- Le contenu public est stocké en localStorage.
- En cas de cache cassé:
  - supprimer `yk_site_config_v1`, `yk_site_saved_config_v1`, `yk_site_history_v1` dans le localStorage.
- Une erreur `sentry.io 429` peut venir d'extensions navigateur externes (pas du code de ce repo).
