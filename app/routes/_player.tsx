import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { css } from '../../styled-system/css'
import { Sidebar } from '../components/sidebar'
import { Topbar } from '../components/topbar'
import { spotifyStrategy } from '../services/auth.server'

const mainContainerStyle = css({
    marginLeft: '245px',
    marginBottom: '100px',
})

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await spotifyStrategy.getSession(request)
    const user = session?.user ?? undefined

    return json({ user })
}

export default function App() {
    const data = useLoaderData<typeof loader>()

    return (
        <div className={css({ background: 'black', height: 'screen' })}>
            <Sidebar />
            <div className={mainContainerStyle}>
                <Topbar user={data.user} />
                <Outlet />
            </div>
        </div>
    )
}
