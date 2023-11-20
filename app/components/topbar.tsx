import type { SerializeFrom } from '@remix-run/node'
import { Form } from '@remix-run/react'
import type { User } from 'remix-auth-spotify'
import { css } from '../../styled-system/css'
import { UserAvatar } from './user-avatar'

const topbarStyles = css({
    display: 'flex',
    justifyContent: 'space-between',
    bg: '#101010',
    p: '14px 30px',
})

const buttonStyles = css({
    color: '#7a7a7a',
    cursor: 'not-allowed',
    width: '34px',
    height: '34px',
    borderRadius: '100%',
    fontSize: '18px',
    border: '0px',
    bg: '#090909',
    mr: '10px',
    '&:hover': {
        bg: '#f2f2f2',
    },
})

const navbarStyles = css({
    display: 'flex',
    alignItems: 'center',
})

const navbarListStyles = css({
    listStyle: 'none',
})

const navbarItemStyles = css({
    display: 'inline-block',
    mx: '8px',
    width: '70px',
})

const navbarLinkStyles = css({
    color: '#b3b3b3',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '14px',
    letterSpacing: '1px',

    '&:hover': {
        color: '#ffffff',
        fontSize: '15px',
    },
})

const dividerStyles = css({
    color: '#ffffff',
    fontSize: '26px',
    mx: '20px',
    width: 'auto',
})

const loginButtonStyles = css({
    bg: '#ffffff',
    color: '#000000',
    fontSize: '16px',
    fontWeight: 'bold',
    p: '14px 30px',
    border: '0px',
    borderRadius: '40px',
    cursor: 'pointer',
    ml: '20px',
})

export function Topbar({ user }: { user: SerializeFrom<User> | undefined }) {
    return (
        <div className={topbarStyles}>
            <div></div>

            <div className={navbarStyles}>
                <ul className={navbarListStyles}>
                    <li className={navbarItemStyles}>
                        <a href="#" className={navbarLinkStyles}>
                            Premium
                        </a>
                    </li>
                    <li className={navbarItemStyles}>
                        <a href="#" className={navbarLinkStyles}>
                            Support
                        </a>
                    </li>
                    <li className={`${navbarItemStyles} ${dividerStyles}`}>|</li>
                    {user ? null : (
                        <li className={navbarItemStyles}>
                            <a href="#" className={navbarLinkStyles}>
                                Sign Up
                            </a>
                        </li>
                    )}
                </ul>
                {user ? <UserAvatar user={user} /> : null}
                <Form action={user ? '/logout' : '/auth/spotify'} method="post">
                    <button className={loginButtonStyles}>{user ? 'Logout' : 'Log in with Spotify'}</button>
                </Form>
            </div>
        </div>
    )
}
