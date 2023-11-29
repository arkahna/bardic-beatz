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
    const deviceId = body.get('deviceId')
    if (!deviceId) {
        throw new Response('No device ID', { status: 400 })
    }

    // Slow it down
    await new Promise((resolve) => setTimeout(resolve, 3000))

    await sdk.player.transferPlayback([deviceId.toString()])

    return null
}
