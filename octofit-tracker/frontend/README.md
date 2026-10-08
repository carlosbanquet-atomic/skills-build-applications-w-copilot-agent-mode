# Octofit Tracker frontend

The frontend reads its API host from Vite's `import.meta.env.VITE_CODESPACE_NAME`.
When using the app in Codespaces, define `VITE_CODESPACE_NAME` in
`octofit-tracker/frontend/.env.local` with your Codespace name, without the port
suffix:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Vite uses it to call `https://<your-codespace-name>-8000.app.github.dev`. Restart
the Vite dev server after changing `.env.local`, since Vite loads environment
variables when it starts. If the variable is unset, the frontend safely uses
`http://localhost:8000` for local development.
