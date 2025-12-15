# Email Editor

A Nuxt 3 + TypeScript + Vuetify single-page experience for composing and previewing emails.

## Features
- Modern Vuetify-based layout with live preview.
- Compose subject, recipients, and body with real-time syncing.
- Attachment chips show selected files.
- Email template picker with starter templates and the ability to save your own for reuse.

## Getting started
1. Install dependencies
   ```bash
   npm install
   ```
2. Run the development server
   ```bash
   npm run dev
   ```
3. Build for production
   ```bash
   npm run build
   ```

## Project structure
- `pages/index.vue` – landing page that loads the editor.
- `components/EmailEditor.vue` – main composing surface with preview.
- `plugins/vuetify.ts` – Vuetify setup.
- `nuxt.config.ts` – Nuxt configuration with TypeScript and Vuetify integration.
