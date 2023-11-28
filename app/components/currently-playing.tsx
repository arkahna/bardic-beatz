import { useEffect, useState } from 'react'
import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'react-feather' // Importing icons
import { css } from '../../styled-system/css'
import { usePlay } from '../lib/usePlay'
import { IconButton } from './primatives/icon-button'
import { ProgressBar } from './progress-bar'
import { VolumeBar } from './volume-bar'

const currentlyPlayingStyles = css({
    display: 'grid',
    padding: '10px',
    bg: '#202020',
    color: '#fff',
    borderRadius: '6px',
    justifyContent: 'space-between',
    gridTemplateColumns: '1fr 2fr 1fr',
})

const songInfoStyles = css({
    display: 'flex',
})

const volumeStyles = css({
    display: 'flex',
    justifyContent: 'right',
    alignItems: 'center',
})
const controlsStyles = css({
    display: 'flex',
    alignItems: 'center',
})

const progressBarStyles = css({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
})

const coverImageStyles = css({
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '10px',
})

const songTitleStyles = css({
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
})

const artistStyles = css({
    fontSize: '14px',
})

const songSectionStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    justifyItems: 'center',
})

export function CurrentlyPlaying() {
    usePlay()

    const [, setPlayer] = useState<Spotify.Player | undefined>(undefined)
    const [isPaused, setPaused] = useState(false)
    const [, setActive] = useState(false)
    const [current_track, setTrack] = useState<
        | {
              name: string
              album: { images: Array<{ url: string }> }
              artists: Array<{ name: string }>
          }
        | undefined
    >()
    const [position, setPosition] = useState(0)
    const [duration, setDuration] = useState(0)

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://sdk.scdn.co/spotify-player.js'
        script.async = true

        document.body.appendChild(script)

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Bardic Beatz',
                getOAuthToken(cb) {},
                volume: 0.5,
            })

            setPlayer(player)

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id)
            })

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id)
            })
            player.addListener('player_state_changed', (state) => {
                if (!state) {
                    return
                }

                setTrack(state.track_window.current_track)
                setPaused(state.paused)
                setPosition(state.position)
                setDuration(state.duration)

                player.getCurrentState().then((state) => {
                    !state ? setActive(false) : setActive(true)
                })
            })

            player.connect()
        }
    }, [])

    if (!current_track) {
        return null
    }

    return (
        <div className={currentlyPlayingStyles}>
            <div className={songInfoStyles}>
                <img
                    src={current_track.album.images[0].url}
                    alt={`${current_track.name} cover`}
                    className={coverImageStyles}
                />
                <div>
                    <div className={songTitleStyles}>{current_track.name}</div>
                    <div className={artistStyles}>{current_track.artists[0].name}</div>
                </div>
            </div>
            <div className={songSectionStyles}>
                <div className={controlsStyles}>
                    <IconButton onClick={() => {}} variant="ghost">
                        <SkipBack color="white" />
                    </IconButton>
                    <IconButton onClick={() => {}} variant="ghost">
                        {!isPaused ? <Pause color="white" /> : <Play color="white" />}
                    </IconButton>
                    <IconButton onClick={() => {}} variant="ghost">
                        <SkipForward color="white" />
                    </IconButton>
                </div>
                <div className={progressBarStyles}>
                    <ProgressBar position={position} duration={duration} />
                </div>
            </div>
            <div className={volumeStyles}>
                <Volume2 />
                <VolumeBar value={50} />
            </div>
        </div>
    )
}
