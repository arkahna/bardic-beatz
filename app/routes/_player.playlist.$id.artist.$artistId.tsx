import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useParams } from '@remix-run/react'
import { ExternalLink, X } from 'react-feather'
import { css } from '../../styled-system/css'
import type { ExtendedSpotifySession } from '../services/auth.server'
import { spotifyStrategy } from '../services/auth.server'
import { spotifySdk } from '../services/spotify.server'

export const artistDetailStyles = css({
    padding: '20px',
    color: '#ffffff',
    bg: '#181818',
    borderRadius: '6px',
    borderColor: 'black',
    ml: '30px',
    minWidth: '250px',
})

const artistNameStyles = css({
    fontSize: '32px',
    mb: '15px',
    fontWeight: 'bold',
})
const topTracksHeaderStyles = css({
    fontSize: '22px',
    mb: '15px',
    fontWeight: 'bold',
})

const artistImageStyles = css({
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '100%',
    mb: '20px',
})

const topTracksStyles = css({
    listStyle: 'none',
    padding: '0',
    mb: '30px',
})

const trackItemStyles = css({
    mb: '10px',
    '&:hover': {
        color: '#1db954',
    },
})

const linkStyles = css({
    color: '#ffffff',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
})

const headerStyles = css({
    display: 'flex',
    justifyContent: 'right',
    alignItems: 'center',
    mb: '20px',
})

const closeButtonStyles = css({
    cursor: 'pointer',
})

const openLinkStyles = css({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#ffffff',
    '&:hover': {
        textDecoration: 'underline',
    },
})

export async function loader({ params, request }: LoaderFunctionArgs) {
    const artistId = params.artistId!

    const session = (await spotifyStrategy.getSession(request)) as ExtendedSpotifySession
    const sdk = spotifySdk(session)

    const artistDetails = await sdk.artists.get(artistId)

    const topTracks = await sdk.artists.topTracks(artistId, 'AU').then(delay(1000))

    return json({ artistDetails, topTracks })
}

export default function ArtistDetail() {
    const { id: playlistId } = useParams()
    const { artistDetails, topTracks } = useLoaderData<typeof loader>()
    const image = artistDetails.images[0]

    return (
        <div className={artistDetailStyles}>
            <div className={headerStyles}>
                <Link to={`/artist/${artistDetails.id}`} className={openLinkStyles}>
                    <ExternalLink size={16} className="mr-2" />
                </Link>
                <Link to={`/playlist/${playlistId}`} className={openLinkStyles}>
                    <X className={closeButtonStyles} size={24} />
                </Link>
            </div>
            <h2 className={artistNameStyles}>{artistDetails.name}</h2>
            {image && <img src={image.url} alt={`Image of ${artistDetails.name}`} className={artistImageStyles} />}
            <h3 className={topTracksHeaderStyles}>Top Tracks</h3>
            <ul className={topTracksStyles}>
                {topTracks.tracks.map((track) => (
                    <li key={track.id} className={trackItemStyles}>
                        {track.name}
                    </li>
                ))}
            </ul>
            <Link to={`/artist/${artistDetails.id}`} className={linkStyles}>
                Open in main view
            </Link>
        </div>
    )
}

function delay<T>(delay: number) {
    return async (res: T) => {
        await new Promise((resolve) => setTimeout(resolve, delay))
        return res
    }
}
