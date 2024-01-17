import { Authenticator } from 'remix-auth'
import type { User } from 'remix-auth-spotify'
import { SpotifyStrategy } from 'remix-auth-spotify'

import { sessionStorage } from '~/services/session.server'

if (!process.env.SPOTIFY_CLIENT_ID) {
    throw new Error('Missing SPOTIFY_CLIENT_ID env')
}

if (!process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error('Missing SPOTIFY_CLIENT_SECRET env')
}

if (!process.env.SPOTIFY_CALLBACK_URL) {
    throw new Error('Missing SPOTIFY_CALLBACK_URL env')
}

// See https://developer.spotify.com/documentation/general/guides/authorization/scopes
const scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-library-read',
].join(' ')

export interface ExtendedSpotifySession {
    accessToken: string
    expiresIn: number
    expiresAt: number
    refreshToken?: string
    tokenType?: string
    user: User | null
}

export const spotifyStrategy = new SpotifyStrategy(
    {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: process.env.SPOTIFY_CALLBACK_URL,
        sessionStorage,
        scope: scopes,
    },
    async ({ accessToken, refreshToken, extraParams, profile }) => {
        console.log('profile', profile)
        console.log('extraParams', extraParams)
        return {
            accessToken,
            refreshToken,
            expiresIn: extraParams.expiresIn,
            expiresAt: Date.now() + extraParams.expiresIn * 1000,
            tokenType: extraParams.tokenType,
            user: {
                id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                image: profile.__json.images?.[0]?.url,
            },
        }
    }
)

export const authenticator = new Authenticator(sessionStorage, {
    sessionKey: spotifyStrategy.sessionKey,
    sessionErrorKey: spotifyStrategy.sessionErrorKey,
})

authenticator.use(spotifyStrategy)
