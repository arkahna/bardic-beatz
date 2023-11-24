import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { css } from '../../styled-system/css'
import { SpotifyAudiobooks } from '../components/audiobooks'
import { SpotifyPlaylists } from '../components/playlists'
import type { ExtendedSpotifySession } from '../services/auth.server'
import { spotifyStrategy } from '../services/auth.server'
import { spotifySdk } from '../services/spotify.server'

const titleStyles = css({
    color: '#ffffff',
    fontSize: '22px',
    mb: '20px',
    fontWeight: 'bold',
})

export async function loader({ request }: LoaderFunctionArgs) {
    const session = (await spotifyStrategy.getSession(request)) as ExtendedSpotifySession | null
    const sdk = session ? spotifySdk(session) : undefined
    const playlists = sdk ? await sdk.currentUser.playlists.playlists(50) : undefined
    const audiobooks = sdk ? await sdk.currentUser.audiobooks.savedAudiobooks(50) : undefined
    return json({ playlists, audiobooks })
}

export default function Home() {
    const data = useLoaderData<typeof loader>()

    return (
        <div>
            <h1 className={titleStyles}>My Library</h1>
            {data.playlists ? (
                <SpotifyPlaylists collectionTitle="My Playlists" playlistItems={data.playlists.items} />
            ) : null}
            {data.audiobooks ? (
                <SpotifyAudiobooks collectionTitle="My Audiobooks" audiobooksItems={data.audiobooks.items} />
            ) : null}
        </div>
    )
}
