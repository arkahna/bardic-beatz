export function useGetToken() {
    return async () => {
        const response = await fetch('/api/token')
        if (!response.ok) {
            throw new Error('Failed to get token')
        }
        return response.text()
    }
}
