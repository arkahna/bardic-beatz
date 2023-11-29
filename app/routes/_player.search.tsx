import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { Loader } from 'react-feather'
import { css } from '../../styled-system/css'
import { Button } from '../components/primatives/button'
import { Input } from '../components/primatives/input'
import type { ExtendedSpotifySession } from '../services/auth.server'
import { spotifyStrategy } from '../services/auth.server'
import { spotifySdk } from '../services/spotify.server'

export async function loader({ request }: LoaderFunctionArgs) {
    const session = (await spotifyStrategy.getSession(request)) as ExtendedSpotifySession | null
    const sdk = session ? spotifySdk(session) : undefined

    // Extract query parameter for search
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''

    const searchResults = query && sdk ? await sdk.search(query, ['track', 'playlist', 'artist', 'album']) : undefined

    return json({ searchResults, query })
}

export default function Search() {
    const data = useLoaderData<typeof loader>()
    const search = useFetcher()
    const searchResults = data?.searchResults

    return (
        <div className={searchResultsStyles}>
            <search.Form method="get" className={formStyle}>
                <Input
                    name="q"
                    type="text"
                    placeholder="Search tracks, albums, artists..."
                    className={inputClassName}
                    defaultValue={data.query}
                />
                <Button type="submit" disabled={search.state === 'loading'}>
                    Search
                    {(search.state === 'loading' || search.state === 'submitting') && <Loader className={spin} />}
                </Button>
            </search.Form>

            {searchResults ? (
                <div>
                    <h3 className={headingStyles}>Tracks</h3>
                    <ul className={listStyles}>
                        {searchResults.tracks.items.map((track) => (
                            <li key={track.id} className={listItemStyles}>
                                <div className={songDetailsStyles}>
                                    {track.album.images[0] && (
                                        <img
                                            src={track.album.images[0].url}
                                            alt={track.name}
                                            className={songImageStyles}
                                        />
                                    )}
                                    <div>
                                        <Link to={`/player/track/${track.id}`} className={linkStyles}>
                                            {track.name}
                                        </Link>
                                        <div>{track.artists.map((artist) => artist.name).join(', ')}</div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <h3 className={headingStyles}>Playlists</h3>
                    <ul className={listStyles}>
                        {searchResults.playlists.items.map((playlist) => (
                            <li key={playlist.id} className={listItemStyles}>
                                <Link to={`/player/playlist/${playlist.id}`} className={linkStyles}>
                                    {playlist.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h3 className={headingStyles}>Artists</h3>
                    <ul className={listStyles}>
                        {searchResults.artists.items.map((artist) => (
                            <li key={artist.id} className={listItemStyles}>
                                <Link to={`/player/artist/${artist.id}`} className={linkStyles}>
                                    {artist.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h3 className={headingStyles}>Albums</h3>
                    <ul className={listStyles}>
                        {searchResults.albums.items.map((album) => (
                            <li key={album.id} className={listItemStyles}>
                                <Link to={`/player/album/${album.id}`} className={linkStyles}>
                                    {album.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    )
}

const searchResultsStyles = css({
    padding: '20px',
    color: '#ffffff',
    bg: '#181818',
    borderRadius: '6px',
})

// Styles for the headings
const headingStyles = css({
    fontSize: '24px',
    mb: '15px',
    fontWeight: 'bold',
    borderBottom: '1px solid #333',
    paddingBottom: '10px',
})

// Styles for the lists
const listStyles = css({
    listStyle: 'none',
    padding: '0',
    mb: '30px',
})

// Styles for each list item
const listItemStyles = css({
    mb: '10px',
    '&:hover a': {
        color: '#1db954',
    },
})

// Styles for the links
const linkStyles = css({
    color: '#ffffff',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
})

const songImageStyles = css({
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '10px',
})

// Styles for song details (name and artist)
const songDetailsStyles = css({
    display: 'flex',
    alignItems: 'center',
})

const inputClassName = css({
    color: 'white',
})

const formStyle = css({
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '10px',
})

const spin = css({
    animation: 'spin 1s infinite',
})
