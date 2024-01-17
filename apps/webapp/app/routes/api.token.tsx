import type { LoaderFunctionArgs } from '@remix-run/node'
import type { ExtendedSpotifySession } from '../services/auth.server'
import { spotifyStrategy } from '../services/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
    const session = (await spotifyStrategy.getSession(request)) as ExtendedSpotifySession | null
    if (!session) {
        throw new Response('Unauthorized', { status: 401 })
    }

    return new Response(session.accessToken, {
        headers: {
            ContentType: 'text/plain',
            // Do not cache
            'Cache-Control': 'no-store',
        },
    })
}
