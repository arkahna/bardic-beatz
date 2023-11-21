import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import type { ExtendedSpotifySession } from './auth.server'

if (!process.env.SPOTIFY_CLIENT_ID) {
    throw new Error('Missing SPOTIFY_CLIENT_ID env')
}

export function spotifySdk(session: ExtendedSpotifySession) {
    return SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, {
        access_token: session.accessToken,
        refresh_token: session.refreshToken!,
        expires_in: session.expiresIn,
        token_type: session.tokenType!,
        expires: session.expiresAt,
    })
}
