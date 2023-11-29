import { json, type LoaderFunctionArgs } from '@remix-run/node'
import type { ExtendedSpotifySession } from '../services/auth.server'
import { spotifyStrategy } from '../services/auth.server'
import { spotifySdk } from '../services/spotify.server'

export async function loader({ request }: LoaderFunctionArgs) {
    const session = (await spotifyStrategy.getSession(request)) as ExtendedSpotifySession | null
    if (!session) {
        throw new Response('Unauthorized', { status: 401 })
    }
    const sdk = spotifySdk(session)

    return json(await sdk.player.getAvailableDevices())
}
