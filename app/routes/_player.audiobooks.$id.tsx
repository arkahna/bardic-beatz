import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { SpotifyAudiobookDetail } from '../components/audiobook-detail'
import type { ExtendedSpotifySession } from '../services/auth.server'
import { spotifyStrategy } from '../services/auth.server'
import { spotifySdk } from '../services/spotify.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
    const audiobookId = params.id // Get playlist ID from the URL
    if (!audiobookId) {
        throw new Response('Not Found', { status: 404 })
    }

    const session = (await spotifyStrategy.getSession(request)) as ExtendedSpotifySession
    const sdk = spotifySdk(session)

    const audiobookDetails = await sdk.audiobooks.get(audiobookId)

    return json({ audiobookDetails: audiobookDetails })
}

export default function Playlist() {
    const data = useLoaderData<typeof loader>()
    const audiobook = data.audiobookDetails

    return <div>{audiobook ? <SpotifyAudiobookDetail audiobook={audiobook} /> : null}</div>
}
