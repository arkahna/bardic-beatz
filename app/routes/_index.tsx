import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { css } from '../../styled-system/css'
import { SpotifyPlaylists } from '../components/row'
import { Sidebar } from '../components/sidebar'
import { Topbar } from '../components/topbar'
import { spotifyStrategy } from '../services/auth.server'

const mainContainerStyle = css({
    marginLeft: '245px',
    marginBottom: '100px',
})

export async function loader({ request }: LoaderFunctionArgs) {
    return spotifyStrategy.getSession(request)
}

export default function App() {
    const data = useLoaderData<typeof loader>()
    const user = data?.user ?? undefined

    return (
        <div className={css({ background: 'black' })}>
            <Sidebar />
            <div className={mainContainerStyle}>
                <Topbar user={user} />
                <SpotifyPlaylists />
            </div>
        </div>
    )
}
