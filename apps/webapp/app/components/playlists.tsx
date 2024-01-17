import type { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk'
import { css } from '../../styled-system/css'

const spotifyPlaylistsStyles = css({
    padding: '20px 40px',
})

const scrollWrapper = css({
    overflowX: 'scroll',
})

const titleStyles = css({
    color: '#ffffff',
    fontSize: '22px',
    mb: '20px',
})

const listStyles = css({
    display: 'flex',
    gap: '20px',
})

const itemStyles = css({
    minWidth: '140px',
    width: '160px',
    padding: '15px',
    bg: '#181818',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all ease 0.4s',
    '&:hover': {
        bg: '#252525',
    },
})

const imageStyles = css({
    width: '100%',
    borderRadius: '6px',
    mb: '10px',
})

const playStyles = css({
    position: 'relative',
})

const iconStyles = css({
    position: 'absolute',
    right: '10px',
    top: '-60px',
    padding: '18px',
    bg: '#1db954',
    borderRadius: '100%',
    opacity: 0,
    transition: 'all ease 0.4s',
    // ':hover': {
    //     opacity: 1,
    //     transform: 'translateY(-20px)',
    // },
})

const headingStyles = css({
    color: '#ffffff',
    fontSize: '14px',
    mb: '10px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
})

const paragraphStyles = css({
    color: '#989898',
    fontSize: '12px',
    lineHeight: '20px',
    fontWeight: '600',
})

const SpotifyPlaylistsItem = ({ images: [imageUrl], name, description, id }: SimplifiedPlaylist) => (
    <a className={itemStyles} href={`/playlist/${id}`}>
        <img className={imageStyles} src={imageUrl.url} />
        <div className={playStyles}>
            <span className={iconStyles}>▶️</span>
        </div>
        <h4 className={headingStyles}>{name}</h4>
        <p className={paragraphStyles}>{description}</p>
    </a>
)

export function SpotifyPlaylists({
    collectionTitle,
    playlistItems,
}: {
    collectionTitle: string
    playlistItems: SimplifiedPlaylist[]
}) {
    return (
        <div className={spotifyPlaylistsStyles}>
            <h2 className={titleStyles}>{collectionTitle}</h2>
            <div className={scrollWrapper}>
                <div className={listStyles}>
                    {playlistItems.map((item, index) => (
                        <SpotifyPlaylistsItem key={index} {...item} />
                    ))}
                </div>
            </div>
        </div>
    )
}
