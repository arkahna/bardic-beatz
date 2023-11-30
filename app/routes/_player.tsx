import { defer, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { css } from '../../styled-system/css'
import { CurrentlyPlaying } from '../components/currently-playing'
import { Sidebar } from '../components/sidebar'
import { Topbar } from '../components/topbar'
import type { ExtendedSpotifySession } from '../services/auth.server'
import { spotifyStrategy } from '../services/auth.server'
import { spotifySdk } from '../services/spotify.server'

const mainContainerStyle = css({
    marginLeft: '196px',
    background: 'black',
    paddingX: '30px',
    display: 'grid',
    height: 'screen',
    gridTemplateRows: 'auto 1fr auto',
})

const outletContainer = css({
    overflowY: 'auto',
    mb: '30px',
})

export async function loader({ request }: LoaderFunctionArgs) {
    const session = (await spotifyStrategy.getSession(request)) as ExtendedSpotifySession | null
    const user = session?.user ?? undefined
    const sdk = session ? spotifySdk(session) : undefined

    const devices = sdk ? sdk.player.getAvailableDevices().then((result) => result.devices) : undefined

    return defer({ user, devices })
}

export default function App() {
    const data = useLoaderData<typeof loader>()

    return (
        <div className={css({ height: 'screen' })}>
            <Sidebar />
            <div className={mainContainerStyle}>
                <Topbar user={data.user} devices={data.devices} />
                <div className={outletContainer}>
                    <Outlet />
                </div>
                <CurrentlyPlaying />
            </div>
        </div>
    )
}
