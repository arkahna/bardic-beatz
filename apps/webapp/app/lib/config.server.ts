import { z } from 'zod'

export const {
    // WEB_URL,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_CALLBACK_URL,
    FEATUREBOARD_ENVIRONMENT_APIKEY,
} = z
    .object({
        NODE_ENV: z.string().default('development'),
        SESSION_SECRET: z.string().default('SESSION_SECRET'),

        // These are used by the web application for authentication with spotify
        SPOTIFY_CLIENT_ID: z.string(),
        SPOTIFY_CLIENT_SECRET: z.string(),
        SPOTIFY_CALLBACK_URL: z.string(),

        FEATUREBOARD_ENVIRONMENT_APIKEY: z.string(),
    })
    .parse(process.env)
