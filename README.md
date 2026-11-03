# Attribution Atlas

Attribution Atlas is a Nuxt 2, Vue 2, TypeScript, and Vuetify dashboard for lead
attribution and reporting. It uses a configurable external API for authentication,
users, clients, and call-report data.

## Run locally

Prerequisites: Docker and Docker Compose.

1. Copy `.env.example` to `.env` and set values for your API and organization.
2. Start the containers and Nuxt development server:

   **PowerShell (Windows):**

   ```powershell
   docker compose up -d --build
   ```

   **Bash (Linux/macOS or Git Bash):**

   ```sh
   sh install.sh
   ```

3. Open `http://localhost:8088` (or the port set by `NGINX_HOST_PORT`). For direct
   access to Nuxt without Nginx, open `http://localhost:5000` (or the port set by
   `WEB_HOST_PORT`).

The Nuxt application is in `src/`. From that directory, install dependencies with
`npm ci --legacy-peer-deps`, then use `npm run dev`, `npm test`, or `npm run build`.

## Configuration

| Variable | Purpose |
| --- | --- |
| `APP_NAME` | Browser title and application name |
| `ORGANIZATION_NAME` | Organization shown on the login screen |
| `ORGANIZATION_EMAIL_DOMAIN` | Login email placeholder domain |
| `ORGANIZATION_EMAIL_SOURCE_DOMAINS` | Comma-separated source domains rewritten in bundled demo fixtures |
| `ORGANIZATION_LOGO_URL` | Optional organization logo URL or public path |
| `API_BASE_URL` | Backend API base URL, including its version path |
| `APP_BASE_URL` | Public application origin used to derive the OAuth callback |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID; hides Google login when unset |
| `GOOGLE_OAUTH_REDIRECT_URI` | Optional explicit OAuth callback URI |
| `NGINX_HOST_PORT` | Local port exposed by the Nginx container |
| `WEB_HOST_PORT` | Local port mapped directly to the Nuxt web container |
| `DEMO_MODE` | Uses local synthetic data and bypasses authentication; keep enabled only for local demos |

With `DEMO_MODE=true`, dashboard, client, call, and team changes are held in memory
for the current page session and reset on reload. This mode is not suitable for
production. Set `DEMO_MODE=false` to restore the normal authentication flow and
external API calls.

For static generation, provide these values in the environment used for
`npm run generate`; Nuxt embeds public runtime configuration in generated assets.

## Repository

The suggested GitHub repository name is `attribution-atlas`:
`https://github.com/jahidkhantuhin/attribution-atlas`.
