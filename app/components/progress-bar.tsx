import { css } from '../../styled-system/css'
import { Slider } from './primatives/slider'

const showThumbOnHover = css({
    [`&:hover [data-part=thumb]`]: {
        opacity: 1,
        transition: 'opacity 0.3s ease',
    },
})

export function ProgressBar({ position, duration }: { position: number; duration: number }) {
    return (
        <Slider.Root min={0} max={duration} value={[position]} className={showThumbOnHover} size="sm">
            <Slider.Control>
                <Slider.Track>
                    <Slider.Range />
                </Slider.Track>
                <Slider.Thumb index={0} css={{ opacity: 0 }} />
            </Slider.Control>
        </Slider.Root>
    )
}
