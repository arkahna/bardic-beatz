import { useEffect, useState } from 'react'
import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'react-feather' // Importing icons
import { css } from '../../styled-system/css'
import { useGetToken } from '../lib/useGetToken'
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

declare global {
    interface Window {
        playerInstance?: Spotify.Player

        stateInterval: NodeJS.Timeout
        initialised?: boolean
    }
}

export function CurrentlyPlaying() {
    // const play = usePlay()
    const getToken = useGetToken()

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
    // as % of 100
    const [volume, setVolume] = useState(50)

    function playerStateChanged(state: Spotify.PlaybackState) {
        if (!state) {
            return
        }

        console.log(state)
        setTrack(state.track_window.current_track)
        setPaused(state.paused)
        setPosition(state.position)
        setDuration(state.duration)

        window.playerInstance!.getCurrentState().then((state) => {
            !state ? setActive(false) : setActive(true)
        })
    }

    useEffect(() => {
        if (window.playerInstance) {
            window.playerInstance.addListener('player_state_changed', playerStateChanged)
            window.stateInterval = setInterval(() => {
                window.playerInstance!.getCurrentState().then((state) => {
                    if (!state) {
                        return
                    }

                    playerStateChanged(state)
                })
            }, 1000)
            return
        }

        if (window.initialised) {
            return
        }
        window.initialised = true

        const script = document.createElement('script')
        script.src = 'https://sdk.scdn.co/spotify-player.js'
        script.async = true

        document.body.appendChild(script)

        window.onSpotifyWebPlaybackSDKReady = () => {
            window.playerInstance = new window.Spotify.Player({
                name: 'Bardic Beatz',
                async getOAuthToken(cb) {
                    try {
                        cb(await getToken())
                    } catch (err) {
                        console.log(err)
                    }
                },
                volume: volume / 100,
            })

            window.playerInstance.addListener('player_state_changed', playerStateChanged)

            console.log('Connecting to spotify')
            window.playerInstance.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id)
            })

            window.playerInstance.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id)
            })
            window.playerInstance
                .connect()
                .catch((err) => {
                    console.log('Failed to connect', err)
                })
                .then(() => {
                    console.log('Connected')
                })
        }

        return () => {
            window.playerInstance?.removeListener('player_state_changed', playerStateChanged)
            clearInterval(window.stateInterval)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <VolumeBar
                    value={volume}
                    onValueChanged={(e) => {
                        setVolume(e)
                        window.playerInstance?.setVolume(e / 100)
                    }}
                />
            </div>
        </div>
    )
}
