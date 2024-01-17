import { Portal } from '@ark-ui/react'
import type { SerializeFrom } from '@remix-run/node'
import type { User } from 'remix-auth-spotify'
import type { AvatarProps } from './primatives/avatar'
import { Avatar } from './primatives/avatar'
import { Tooltip } from './primatives/tooltip'

export function UserAvatar({ user, ...props }: AvatarProps & { user: SerializeFrom<User> }) {
    return (
        <Tooltip.Root>
            <Tooltip.Trigger>
                <Avatar.Root {...props}>
                    <Avatar.Fallback>{getAbbreviation(user.name || user.email)}</Avatar.Fallback>
                    {user?.image ? <Avatar.Image src={user.image} alt="avatar" /> : null}
                </Avatar.Root>
            </Tooltip.Trigger>
            <Portal>
                <Tooltip.Positioner>
                    <Tooltip.Arrow>
                        <Tooltip.ArrowTip />
                    </Tooltip.Arrow>
                    <Tooltip.Content>{user.name ?? user.email}</Tooltip.Content>
                </Tooltip.Positioner>
            </Portal>
        </Tooltip.Root>
    )
}

function getAbbreviation(name: string) {
    const splitName = name.split(' ')
    if (splitName.length > 1) {
        const [first, last] = splitName
        return `${first[0]}${last[0]}`.toUpperCase()
    } else {
        return name.slice(0, 2).toUpperCase()
    }
}
