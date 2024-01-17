import { useRevalidator } from '@remix-run/react'
import { useEffect, useReducer } from 'react'
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

        stateInterval?: NodeJS.Timeout
        initialised?: boolean
    }
}

export function CurrentlyPlaying() {
    const getToken = useGetToken()
    const revalidator = useRevalidator()

    const [state, dispatch] = useReducer(reducer, initialState)

    function playerStateChanged(state: Spotify.PlaybackState | null) {
        if (!state) {
            dispatch({ type: 'SET_ACTIVE', payload: false })
            return
        }

        dispatch({ type: 'UPDATE_PLAYER_STATE', payload: state })
    }

    useEffect(() => {
        if (state.current_track) {
            revalidator.revalidate()
        }
    }, [state.current_track])

    useEffect(() => {
        if (!window.stateInterval) {
            window.stateInterval = setInterval(() => {
                window.playerInstance?.getCurrentState().then((state) => {
                    if (!state) {
                        return
                    }

                    playerStateChanged(state)
                })
            }, 300)
        }
        if (window.playerInstance) {
            window.playerInstance.addListener('player_state_changed', playerStateChanged)

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
                volume: state.volume / 100,
            })

            window.playerInstance.addListener('player_state_changed', playerStateChanged)

            console.log('Connecting to spotify')
            window.playerInstance.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id)
                revalidator.revalidate()
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
            window.stateInterval = undefined
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!state.current_track) {
        return null
    }

    return (
        <div className={currentlyPlayingStyles}>
            <div className={songInfoStyles}>
                <img
                    src={state.current_track.album.images[0].url}
                    alt={`${state.current_track.name} cover`}
                    className={coverImageStyles}
                />
                <div>
                    <div className={songTitleStyles}>{state.current_track.name}</div>
                    <div className={artistStyles}>{state.current_track.artists[0].name}</div>
                </div>
            </div>
            <div className={songSectionStyles}>
                <div className={controlsStyles}>
                    <IconButton onClick={() => {}} variant="ghost">
                        <SkipBack color="white" />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            if (window.playerInstance) {
                                if (state.isPaused) {
                                    window.playerInstance.resume()
                                } else {
                                    window.playerInstance.pause()
                                }
                            }
                        }}
                        variant="ghost"
                    >
                        {!state.isPaused ? <Pause color="white" /> : <Play color="white" />}
                    </IconButton>
                    <IconButton onClick={() => {}} variant="ghost">
                        <SkipForward color="white" />
                    </IconButton>
                </div>
                <div className={progressBarStyles}>
                    <ProgressBar position={state.position} duration={state.duration} />
                </div>
            </div>
            <div className={volumeStyles}>
                <Volume2 />
                <VolumeBar
                    value={state.volume}
                    onValueChanged={(e) => {
                        dispatch({ type: 'SET_VOLUME', payload: e })
                        window.playerInstance?.setVolume(e / 100)
                    }}
                />
            </div>
        </div>
    )
}

type State = {
    isPaused: boolean
    active: boolean
    current_track:
        | {
              name: string
              album: { images: Array<{ url: string }> }
              artists: Array<{ name: string }>
          }
        | undefined
    position: number
    duration: number
    volume: number
}

type Action =
    | { type: 'SET_PAUSED'; payload: boolean }
    | { type: 'SET_ACTIVE'; payload: boolean }
    | { type: 'SET_TRACK'; payload: State['current_track'] }
    | { type: 'SET_POSITION'; payload: number }
    | { type: 'SET_DURATION'; payload: number }
    | { type: 'SET_VOLUME'; payload: number }
    | { type: 'UPDATE_PLAYER_STATE'; payload: Spotify.PlaybackState }

const initialState: State = {
    isPaused: false,
    active: false,
    current_track: undefined,
    position: 0,
    duration: 0,
    volume: 50,
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_PAUSED':
            return { ...state, isPaused: action.payload }
        case 'SET_ACTIVE':
            return { ...state, active: action.payload }
        case 'SET_TRACK':
            return { ...state, current_track: action.payload }
        case 'SET_POSITION':
            return { ...state, position: action.payload }
        case 'SET_DURATION':
            return { ...state, duration: action.payload }
        case 'SET_VOLUME':
            return { ...state, volume: action.payload }
        case 'UPDATE_PLAYER_STATE':
            return {
                ...state,
                isPaused: action.payload.paused,
                active: true,
                current_track: action.payload.track_window.current_track,
                position: action.payload.position,
                duration: action.payload.duration,
            }
        default:
            return state
    }
}
