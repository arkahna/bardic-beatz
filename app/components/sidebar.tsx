import { Book, Heart, Home, Plus, Search } from 'react-feather'
import { css } from '../../styled-system/css'

const sidebarStyles = css({
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: '196px',
    bg: 'background',
    p: '24px',
})

const logoImageStyles = css({
    width: '130px',
})

const navigationListStyles = css({
    listStyle: 'none',
    mt: '20px',
})

const navigationItemStyles = css({
    padding: '10px 0px',
})

const navigationLinkStyles = css({
    color: 'text',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '13px',
    '&:hover': {
        color: '#ffffff',
    },
})

const iconStyles = css({
    fontSize: '20px',
    mr: '10px',
    display: 'inline-block',
    color: 'primary',
})

const policiesContainerStyles = css({
    position: 'absolute',
    bottom: '20px',
})

const policiesListStyles = css({
    listStyle: 'none',
})

const policyLinkStyles = css({
    color: '#b3b3b3',
    fontWeight: '500',
    textDecoration: 'none',
    fontSize: '10px',
    '&:hover': {
        textDecoration: 'underline',
    },
})

const Navigation = ({ items }: { items: Array<{ href: string; icon: JSX.ElementType; label: string }> }) => (
    <ul className={navigationListStyles}>
        {items.map((item, index) => (
            <li key={index} className={navigationItemStyles}>
                <a href={item.href} className={navigationLinkStyles}>
                    {typeof item.icon === 'string' ? (
                        <span className={iconStyles}>{item.icon}</span>
                    ) : (
                        <item.icon className={iconStyles} />
                    )}
                    <span>{item.label}</span>
                </a>
            </li>
        ))}
    </ul>
)

export function Sidebar() {
    const mainNavigationItems = [
        { href: '/', icon: Home, label: 'Home' },
        { href: '/search', icon: Search, label: 'Search' },
        { href: '/library', icon: Book, label: 'Your Library' },
    ]

    const secondaryNavigationItems = [
        { href: '/playlist/create', icon: Plus, label: 'Create Playlist' },
        { href: '/playlist/liked', icon: Heart, label: 'Liked Songs' },
    ]

    return (
        <div className={sidebarStyles}>
            <div className={logoImageStyles}>
                <a href="/">
                    <img src="/logo.png" alt="Logo" />
                </a>
            </div>

            <Navigation items={mainNavigationItems} />
            <Navigation items={secondaryNavigationItems} />

            <div className={policiesContainerStyles}>
                <ul className={policiesListStyles}>
                    <li>
                        <a className={policyLinkStyles} href="#">
                            Cookies
                        </a>
                    </li>
                    <li>
                        <a className={policyLinkStyles} href="#">
                            Privacy
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}
