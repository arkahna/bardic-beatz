import type { Audiobook, SimplifiedChapter } from '@spotify/web-api-ts-sdk'
import { css } from '../../styled-system/css'
import { usePlay } from '../lib/usePlay'

const audiobookDetailStyles = css({
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

const authorStyles = css({
    fontSize: '20px',
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

const chapterDetailsStyles = css({
    display: 'flex',
    alignItems: 'center',
})

const chapterInfoStyles = css({
    marginLeft: '10px',
})

const chapterNameStyles = css({
    fontSize: '16px',
    color: '#ffffff',
    marginBottom: '5px',
})

const chapterNumberStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '50px', // Adjust this value as needed to prevent wrapping
})

const audiobookHeaderStyles = css({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
})

const audiobookImageStyles = css({
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

export function SpotifyAudiobookDetail({ audiobook }: { audiobook: Audiobook }) {
    const play = usePlay()
    const audiobookImageUrl = audiobook.images[0]?.url
    const authors = audiobook.authors.map((author) => author.name).join(', ')

    const renderAudiobookItem = (item: SimplifiedChapter, index: number) => {
        const name = item.name
        const duration = formatDuration(item.duration_ms)

        const handlePlayClick = () => {
            play(item.uri)
            console.log(`Playing chapter: ${item.name}`)
            // Implement logic to play the chapter
        }

        return (
            <tr key={index}>
                <td className={tdStyles}>
                    <div className={chapterNumberStyles}>
                        <button onClick={handlePlayClick} className={playButtonStyles}>
                            ▶️
                        </button>
                        {index + 1}
                    </div>
                </td>
                <td className={`${tdStyles} ${chapterDetailsStyles}`}>
                    <div className={chapterInfoStyles}>
                        <div className={chapterNameStyles}>{name}</div>
                    </div>
                </td>
                <td className={tdStyles}>{duration}</td>
            </tr>
        )
    }

    return (
        <div className={audiobookDetailStyles}>
            <div className={audiobookHeaderStyles}>
                {audiobookImageUrl && (
                    <img src={audiobookImageUrl} alt={audiobook.name} className={audiobookImageStyles} />
                )}
                <div>
                    <h1 className={titleStyles}>{audiobook.name}</h1>
                    <h2 className={authorStyles}>{authors}</h2>
                    <div
                        className={descriptionStyles}
                        // possibly unsafe, do we trust the Spotify API lol
                        dangerouslySetInnerHTML={{ __html: audiobook.description }}
                    ></div>
                </div>
            </div>
            <table className={tableStyles}>
                <thead>
                    <tr>
                        <th className={thStyles}>#</th>
                        <th className={thStyles}>Title</th>
                        <th className={thStyles}>Duration</th>
                    </tr>
                </thead>
                <tbody>{audiobook.chapters.items.map(renderAudiobookItem)}</tbody>
            </table>
        </div>
    )
}
