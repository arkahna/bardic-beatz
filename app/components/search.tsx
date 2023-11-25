import { Form } from '@remix-run/react'
import { css } from '../../styled-system/css'
import { Button } from './primatives/button'
import { Input } from './primatives/input'

const inputClassName = css({
    color: 'white',
})

export function SearchComponent() {
    return (
        <Form method="get">
            <Input name="q" type="text" placeholder="Search tracks, albums, artists..." className={inputClassName} />
            <Button type="submit">Search</Button>
        </Form>
    )
}
