import type { ActionFunctionArgs } from '@remix-run/node'
import type { ExtendedSpotifySession } from '../services/auth.server'
import { spotifyStrategy } from '../services/auth.server'
import { spotifySdk } from '../services/spotify.server'

export async function action({ request }: ActionFunctionArgs) {
    const session = (await spotifyStrategy.getSession(request)) as ExtendedSpotifySession | null
    if (!session) {
        throw new Response('Unauthorized', { status: 401 })
    }
    const sdk = spotifySdk(session)

    const body = await request.formData()
    const track = body.get('track')
    console.log(track)

    await sdk.makeRequest('PUT', `me/player/play`, {
        uris: track ? [track] : undefined,
    })
}
