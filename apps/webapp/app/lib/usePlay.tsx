import { useFetcher } from '@remix-run/react'

export function usePlay() {
    const fetcher = useFetcher()

    return (track: string) => {
        return fetcher.submit({ track: track }, { method: 'POST', action: '/api/play' })
    }
}
