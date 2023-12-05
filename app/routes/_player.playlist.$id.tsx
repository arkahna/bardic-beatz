/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData, useNavigation } from '@remix-run/react'
import { css } from '../../styled-system/css'
import { SpotifyPlaylistDetail } from '../components/playlist-detail'
import type { ExtendedSpotifySession } from '../services/auth.server'
import { spotifyStrategy } from '../services/auth.server'
import { spotifySdk } from '../services/spotify.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
    const playlistId = params.id // Get playlist ID from the URL
    if (!playlistId) {
        throw new Response('Not Found', { status: 404 })
    }

    const session = (await spotifyStrategy.getSession(request)) as ExtendedSpotifySession
    const sdk = spotifySdk(session)

    const playlistDetails = await sdk.playlists.getPlaylist(playlistId)

    return json({ playlistDetails })
}

export default function Playlist() {
    const data = useLoaderData<typeof loader>()
    const navigation = useNavigation()

    const playlist = data.playlistDetails

    return (
        <div className={containerStyles}>
            {playlist ? <SpotifyPlaylistDetail playlist={playlist} /> : null}
            <Outlet />
        </div>
    )
}

const containerStyles = css({
    display: 'flex',
    flexDirection: 'row',
})

const progressStyles = css({
    position: 'absolute',
    top: '50%',
    right: '120px',
    transform: 'translateY(-50%)',
})
