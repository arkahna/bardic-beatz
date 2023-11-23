import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { css } from '../../styled-system/css'
import { CurrentlyPlaying } from '../components/currently-playing'
import { Sidebar } from '../components/sidebar'
import { Topbar } from '../components/topbar'
import { spotifyStrategy } from '../services/auth.server'

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
    const session = await spotifyStrategy.getSession(request)
    const user = session?.user ?? undefined

    return json({ user })
}

export default function App() {
    const data = useLoaderData<typeof loader>()

    return (
        <div className={css({ height: 'screen' })}>
            <Sidebar />
            <div className={mainContainerStyle}>
                <Topbar user={data.user} />
                <div className={outletContainer}>
                    <Outlet />
                </div>
                <CurrentlyPlaying />
            </div>
        </div>
    )
}
