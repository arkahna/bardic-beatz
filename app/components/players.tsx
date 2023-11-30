import type { PopoverProps } from '@ark-ui/react'
import { Portal } from '@ark-ui/react'
import { Await, useFetcher } from '@remix-run/react'
import type { Device } from '@spotify/web-api-ts-sdk'
import { Suspense } from 'react'
import { Airplay, X } from 'react-feather'
import { Box, Stack } from 'styled-system/jsx'
import { css } from '../../styled-system/css'
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

export function Players(props: PopoverProps & { devices: Promise<Device[]> | undefined }) {
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
                            <PlayerList devices={props.devices} />
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

function PlayerList({ devices: devicesPromises }: { devices: Promise<Device[]> | undefined }) {
    const switchDeviceFetcher = useFetcher()

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={devicesPromises}>
                {(devices) =>
                    devices?.map((device) => {
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
                                        (isActive
                                            ? ` ${switchDeviceFetcher.formData ? selectingStyle : activeStyle}`
                                            : '')
                                    }
                                    type="submit"
                                >
                                    {device.name}
                                </Button>
                            </switchDeviceFetcher.Form>
                        )
                    })
                }
            </Await>
        </Suspense>
    )
}
