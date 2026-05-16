# La Station Awards

Site de vote anonyme pour Discord.

## Installation locale

```bash
npm install
npm run dev
```

## Supabase

Dans Supabase > SQL Editor, colle le contenu de `supabase.sql`.

## Variables Vercel

Dans Vercel > Project > Settings > Environment Variables :

- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- IP_SALT : mets une longue phrase random
- ADMIN_CODE : code pour voir les résultats

## Voir les résultats

Après déploiement :

`/api/vote?code=TON_CODE_ADMIN`

## Modifier les catégories et participants

Va dans `api/config.js`.
