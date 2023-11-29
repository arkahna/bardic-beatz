import { Link } from '@remix-run/react'
import type { Playlist, PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { usePlay } from '../lib/usePlay'

const playlistDetailStyles = css({
    padding: '20px 40px',
    color: '#ffffff',
    bg: '#181818',
    borderRadius: '6px',
    overflowX: 'auto',
})

const titleStyles = css({
    fontSize: '28px',
    mb: '20px',
})

const descriptionStyles = css({
    fontSize: '16px',
    color: '#989898',
    mb: '20px',
})

const tableStyles = css({
    width: '100%',
    borderCollapse: 'collapse',
})

const thStyles = css({
    textAlign: 'left',
    borderBottom: '1px solid #333',
    padding: '10px',
    fontSize: '14px',
})

const tdStyles = css({
    padding: '10px',
    borderBottom: '1px solid #333',
})

const albumImageStyles = css({
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '10px',
})

const playButtonStyles = css({
    cursor: 'pointer',
    fontSize: '16px',
    color: 'primary',
    border: 'none',
    background: 'none',
    marginRight: '10px',
    '&:hover': {
        color: 'accent',
    },
})

const trackDetailsStyles = css({
    display: 'flex',
    alignItems: 'center',
})

const trackInfoStyles = css({
    marginLeft: '10px',
})

const trackNameStyles = css({
    fontSize: '16px',
    color: '#ffffff',
    marginBottom: '5px',
})

const trackArtistStyles = css({
    fontSize: '14px',
    color: '#989898',
})
const trackNumberStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '50px', // Adjust this value as needed to prevent wrapping
})

const playlistHeaderStyles = css({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
})

const playlistImageStyles = css({
    width: '100%',
    maxWidth: '200px', // Set max width to 200px
    borderRadius: '6px',
    marginRight: '20px', // Add some space between the image and the text
})

function formatDuration(durationMs: number) {
    const minutes = Math.floor(durationMs / 60000)
    const seconds = ((durationMs % 60000) / 1000).toFixed(0)
    return minutes + ':' + (Number(seconds) < 10 ? '0' : '') + seconds
}

export function SpotifyPlaylistDetail({ playlist }: { playlist: Playlist }) {
    const play = usePlay()
    const playlistImageUrl = playlist.images[0]?.url

    const renderPlaylistItem = (item: PlaylistedTrack, index: number) => {
        const name = item.track.name
        const album = 'show' in item.track ? item.track.show.name : item.track.album.name
        const albumImageUrl = 'show' in item.track ? item.track.show.images[0]?.url : item.track.album.images[0]?.url
        const artists =
            'show' in item.track
                ? 'Podcast' // You can replace this with more specific info if available
                : item.track.artists
                      .map((artist) => (
                          <Link to={`artist/${artist.id}`} key={artist.id}>
                              {artist.name}
                          </Link>
                      ))
                      .reduce<ReactNode[]>((prev, curr, index, array) => {
                          return index < array.length - 1 ? [...prev, curr, ', '] : [...prev, curr]
                      }, [])

        const duration = formatDuration(item.track.duration_ms)

        const handlePlayClick = () => {
            play(item.track.uri)
            console.log(`Playing track: ${item.track.name}`)
            // Implement logic to play the track
        }

        return (
            <tr key={index}>
                <td className={tdStyles}>
                    <div className={trackNumberStyles}>
                        <button onClick={handlePlayClick} className={playButtonStyles}>
                            ▶️
                        </button>
                        {index + 1}
                    </div>
                </td>
                <td className={`${tdStyles} ${trackDetailsStyles}`}>
                    {albumImageUrl && <img src={albumImageUrl} alt={album} className={albumImageStyles} />}
                    <div className={trackInfoStyles}>
                        <div className={trackNameStyles}>{name}</div>
                        <div className={trackArtistStyles}>{artists}</div>
                    </div>
                </td>
                <td className={tdStyles}>{album}</td>
                <td className={tdStyles}>{duration}</td>
            </tr>
        )
    }

    return (
        <div className={playlistDetailStyles}>
            <div className={playlistHeaderStyles}>
                {playlistImageUrl && <img src={playlistImageUrl} alt={playlist.name} className={playlistImageStyles} />}
                <div>
                    <h1 className={titleStyles}>{playlist.name}</h1>
                    <p className={descriptionStyles}>{playlist.description}</p>
                </div>
            </div>
            <table className={tableStyles}>
                <thead>
                    <tr>
                        <th className={thStyles}>#</th>
                        <th className={thStyles}>Title</th>
                        <th className={thStyles}>Album</th>
                        <th className={thStyles}>Duration</th>
                    </tr>
                </thead>
                <tbody>{playlist.tracks.items.map(renderPlaylistItem)}</tbody>
            </table>
        </div>
    )
}
