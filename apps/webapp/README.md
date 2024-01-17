# Bardic Beatz

## Setup

Install dependencies:

```shellscript
pnpm i
```

Create a `.env` file in the root directory with the following contents:

```shellscript
SPOTIFY_CLIENT_ID=<your spotify client id>
SPOTIFY_CLIENT_SECRET=<your spotify client secret>
SPOTIFY_CALLBACK_URL="http://localhost:3000/auth/spotify/callback"
```

You can get your Spotify client ID and secret by creating a Spotify app [here](https://developer.spotify.com/dashboard/applications).

## Run

Spin up the Express server as a dev server:

```shellscript
npm run dev
```

Or build your app for production and run it:

```shellscript
npm run build
npm run start
```
