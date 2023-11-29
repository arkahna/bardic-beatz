import type { PopoverProps } from '@ark-ui/react'
import { Portal } from '@ark-ui/react'
import { useFetcher } from '@remix-run/react'
import { useEffect } from 'react'
import { Airplay, X } from 'react-feather'
import { Box, Stack } from 'styled-system/jsx'
import { css } from '../../styled-system/css'
import type { loader } from '../routes/api.devices'
import { Button } from './primatives/button'
import { IconButton } from './primatives/icon-button'
import { Popover } from './primatives/popover'

const deviceNameStyle = css({
    fontSize: '14px',
})
const activeStyle = css({
    color: 'primary',
    fontWeight: 'bold',
})

const selectingStyle = css({
    color: 'primary',
    fontWeight: 'bold',
    // slightly transparent
    opacity: '0.6',
})

const iconStyle = css({
    color: '#fff',
})

export function Players(props: PopoverProps) {
    return (
        <Popover.Root {...props} closeOnEsc unmountOnExit lazyMount>
            <Popover.Trigger asChild>
                <IconButton variant="ghost">
                    <Airplay className={iconStyle} />
                </IconButton>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Arrow>
                            <Popover.ArrowTip />
                        </Popover.Arrow>
                        <Stack gap="1">
                            <Popover.Title>Players</Popover.Title>
                            <PlayerList />
                        </Stack>
                        <Box position="absolute" top="1" right="1">
                            <Popover.CloseTrigger asChild>
                                <IconButton aria-label="Close Popover" variant="ghost" size="sm">
                                    <X />
                                </IconButton>
                            </Popover.CloseTrigger>
                        </Box>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}

function PlayerList() {
    const deviceFetcher = useFetcher<typeof loader>()
    const switchDeviceFetcher = useFetcher()

    useEffect(() => {
        deviceFetcher.load(`/api/devices`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (deviceFetcher.state === 'loading' && !deviceFetcher.data) return <p>Loading...</p>
    if (!deviceFetcher.data) return <p>No devices</p>

    return deviceFetcher.data.devices.map((device) => {
        const isActive = switchDeviceFetcher.formData
            ? // use to optimistic value if submitting
              switchDeviceFetcher.formData.get('deviceId') === device.id
            : // fall back to the database state
              device.is_active

        if (!device.id) {
            return null
        }

        return (
            <switchDeviceFetcher.Form key={device.id} method="post" action="/api/switch-device">
                <input type="hidden" name="deviceId" value={device.id} />
                <Button
                    variant="ghost"
                    className={
                        deviceNameStyle +
                        (isActive ? ` ${switchDeviceFetcher.formData ? selectingStyle : activeStyle}` : '')
                    }
                    type="submit"
                >
                    {device.name}
                </Button>
            </switchDeviceFetcher.Form>
        )
    })
}
